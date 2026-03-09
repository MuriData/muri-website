// Avalanche SDK wallet integration for P-Chain operations via Core wallet.
// Uses @avalanche-sdk/client which is browser-compatible with Vite node polyfills.
// Used for validator management (register, remove, weight update) which requires
// cross-chain Warp messages between the L1 and P-Chain.

import { createAvalancheWalletClient } from '@avalanche-sdk/client'
import '@avalanche-sdk/client/window'
import {
  CHAIN_ID, CHAIN_NAME, NETWORK_SLUG, L1_RPC, PLATFORM_API, WARP_API,
  WARP_PRECOMPILE, SEND_WARP_MESSAGE_TOPIC,
} from './config'

/** Convert AVAX to nanoAVAX (1 AVAX = 10^9 nAVAX). */
export function avaxToNanoAvax(avax) {
  return BigInt(Math.round(avax * 1e9))
}

/**
 * Check if Core wallet extension is available.
 */
export function isCoreAvailable() {
  return typeof window !== 'undefined' && !!window.avalanche
}

/**
 * Create an Avalanche wallet client using Core extension provider.
 * This gives access to P-Chain signing for validator operations.
 */
export function createCoreWalletClient() {
  if (!isCoreAvailable()) {
    throw new Error('Core wallet extension not found. Please install Core: https://core.app')
  }

  return createAvalancheWalletClient({
    chain: {
      id: CHAIN_ID,
      name: CHAIN_NAME,
      network: NETWORK_SLUG,
      rpcUrls: {
        default: { http: [L1_RPC] },
      },
    },
    transport: {
      type: 'custom',
      provider: window.avalanche,
    },
  })
}

/**
 * Request Core wallet connection and get P-Chain address.
 */
export async function connectCoreWallet() {
  const walletClient = createCoreWalletClient()
  const accounts = await walletClient.requestAddresses()
  const evmAddress = accounts[0]

  let pChainAddress
  try {
    const pubKeys = await walletClient.getAccountPubKey()
    pChainAddress = pubKeys.xp
  } catch {
    pChainAddress = null
  }

  return { walletClient, evmAddress, pChainAddress }
}

/**
 * Extract the unsigned Warp message from an L1 transaction receipt.
 * The initiateValidatorRegistration tx emits a SendWarpMessage event
 * from the Warp precompile (0x0200...0005).
 */
export async function getWarpMessageFromTxHash(txHash) {
  const res = await fetch(L1_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getTransactionReceipt',
      params: [txHash],
    }),
  })
  const json = await res.json()
  if (!json.result) throw new Error('Transaction receipt not found')

  const receipt = json.result
  if (receipt.status !== '0x1') throw new Error('Transaction reverted')

  // Find the SendWarpMessage log from the Warp precompile
  const warpLog = receipt.logs.find(
    (log) =>
      log.address.toLowerCase() === WARP_PRECOMPILE.toLowerCase() &&
      log.topics[0] === SEND_WARP_MESSAGE_TOPIC
  )

  if (!warpLog) throw new Error('No SendWarpMessage event found in transaction')

  // The unsigned message is in the unindexed data of the log
  // topics[1] = sender (address, padded to 32 bytes)
  // topics[2] = messageID (bytes32)
  // data = abi-encoded bytes (offset + length + message bytes)
  const messageID = warpLog.topics[2]
  const unsignedMessage = decodeAbiBytes(warpLog.data)

  return { messageID, unsignedMessage, txHash }
}

/**
 * Decode ABI-encoded bytes from log data.
 * Format: 32-byte offset + 32-byte length + padded data
 */
function decodeAbiBytes(hexData) {
  const data = hexData.startsWith('0x') ? hexData.slice(2) : hexData
  // Skip offset (32 bytes = 64 hex chars)
  const lengthHex = data.slice(64, 128)
  const length = parseInt(lengthHex, 16) * 2 // bytes to hex chars
  const bytes = data.slice(128, 128 + length)
  return '0x' + bytes
}

/**
 * Aggregate Warp signatures from L1 validators for a given message.
 * Calls the node's Warp API endpoint.
 */
export async function aggregateWarpSignatures(unsignedMessageHex) {
  const res = await fetch(WARP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'warp.getMessageAggregateSignature',
      params: {
        message: unsignedMessageHex,
        quorumNum: 67,
      },
    }),
  })
  const json = await res.json()

  if (json.error) {
    throw new Error(`Warp aggregation failed: ${json.error.message}`)
  }

  return json.result.signedMessage
}

/**
 * Submit RegisterL1ValidatorTx to P-Chain via Core wallet.
 *
 * @param walletClient - Avalanche wallet client (from createCoreWalletClient)
 * @param params.signedWarpMessage - Aggregated signed Warp message hex
 * @param params.blsSignature - BLS signature hex (from the validator's BLS key)
 * @param params.initialBalanceAvax - Initial AVAX balance for the validator (in AVAX, e.g. 0.1)
 */
export async function submitRegisterL1ValidatorTx(walletClient, { signedWarpMessage, blsSignature, initialBalanceAvax }) {
  const prepared = await walletClient.pChain.prepareRegisterL1ValidatorTxn({
    initialBalanceInAvax: avaxToNanoAvax(initialBalanceAvax),
    blsSignature: blsSignature || '0x',
    message: signedWarpMessage,
  })

  const txHash = await walletClient.sendXPTransaction(prepared)

  // Wait for P-Chain confirmation
  await walletClient.waitForTxn({ txID: txHash, chainAlias: 'P' })

  return txHash
}

/**
 * Submit SetL1ValidatorWeightTx to P-Chain via Core wallet.
 * Used for both validator removal (weight=0) and weight updates.
 */
export async function submitSetL1ValidatorWeightTx(walletClient, { signedWarpMessage }) {
  const prepared = await walletClient.pChain.prepareSetL1ValidatorWeightTxn({
    message: signedWarpMessage,
  })

  const txHash = await walletClient.sendXPTransaction(prepared)

  await walletClient.waitForTxn({ txID: txHash, chainAlias: 'P' })

  return txHash
}

/**
 * Get the P-Chain signed acknowledgement Warp message after a P-Chain validator tx.
 */
export async function getPChainAckWarpMessage(pChainTxHash) {
  const pRes = await fetch(PLATFORM_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'platform.getTx',
      params: { txID: pChainTxHash },
    }),
  })
  const pJson = await pRes.json()
  if (pJson.error) throw new Error(`P-Chain getTx failed: ${pJson.error.message}`)

  return pJson.result
}
