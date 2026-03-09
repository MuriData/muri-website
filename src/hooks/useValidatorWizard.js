import { useState, useCallback, useRef } from 'react'
import {
  isCoreAvailable,
  connectCoreWallet,
  getWarpMessageFromTxHash,
  aggregateWarpSignatures,
  submitRegisterL1ValidatorTx,
  submitSetL1ValidatorWeightTx,
} from '../lib/avalancheWallet'

/**
 * Wizard steps for validator registration:
 *  1. form        — Fill in nodeID, BLS key, weight, initial AVAX balance
 *  2. initiate    — Call initiateValidatorRegistration on L1 (EVM tx via wagmi)
 *  3. aggregate   — Extract Warp message from L1 tx, aggregate L1 validator signatures
 *  4. pchain      — Sign & submit RegisterL1ValidatorTx to P-Chain via Core wallet
 *  5. complete    — Call completeValidatorRegistration on L1 with P-Chain ack Warp message
 *  6. done        — Success
 *
 * For removal:
 *  1. select      — Pick validator to remove
 *  2. initiate    — Call initiateValidatorRemoval on L1
 *  3. aggregate   — Extract Warp message, aggregate signatures
 *  4. pchain      — Submit SetL1ValidatorWeightTx (weight=0) to P-Chain
 *  5. complete    — Call completeValidatorRemoval on L1
 *  6. done
 */

const INITIAL_STATE = {
  step: 'idle',
  operation: null, // 'register' | 'remove' | 'weight'
  error: null,
  // Data passed between steps
  l1TxHash: null,
  warpMessage: null,
  signedWarpMessage: null,
  pChainTxHash: null,
  coreConnected: false,
  coreAddress: null,
}

export function useValidatorWizard() {
  const [state, setState] = useState(INITIAL_STATE)
  const walletClientRef = useRef(null)

  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
    walletClientRef.current = null
  }, [])

  // ── Step 0: Connect Core Wallet ──
  const connectCore = useCallback(async () => {
    if (!isCoreAvailable()) {
      updateState({ error: 'Core wallet not detected. Please install the Core browser extension from https://core.app' })
      return false
    }
    try {
      updateState({ error: null })
      const { walletClient, evmAddress, pChainAddress } = await connectCoreWallet()
      walletClientRef.current = walletClient
      updateState({
        coreConnected: true,
        coreAddress: pChainAddress || evmAddress,
      })
      return true
    } catch (err) {
      updateState({ error: `Core connection failed: ${err.message}` })
      return false
    }
  }, [updateState])

  // ── Start a wizard operation ──
  const startRegister = useCallback(() => {
    setState({ ...INITIAL_STATE, step: 'form', operation: 'register' })
  }, [])

  const startRemove = useCallback(() => {
    setState({ ...INITIAL_STATE, step: 'form', operation: 'remove' })
  }, [])

  const startWeightUpdate = useCallback(() => {
    setState({ ...INITIAL_STATE, step: 'form', operation: 'weight' })
  }, [])

  // ── Step 1b: L1 tx submitted (pending confirmation) ──
  const onL1TxSubmitted = useCallback(() => {
    updateState({ step: 'initiate', error: null })
  }, [updateState])

  // ── Step 2: After L1 tx is confirmed, record the hash ──
  const onL1TxConfirmed = useCallback((txHash) => {
    updateState({ l1TxHash: txHash, step: 'aggregate', error: null })
  }, [updateState])

  // ── Step 3: Aggregate Warp signatures ──
  const aggregateSignatures = useCallback(async () => {
    const { l1TxHash } = state
    if (!l1TxHash) {
      updateState({ error: 'No L1 transaction hash' })
      return
    }
    try {
      updateState({ error: null })

      // Extract unsigned Warp message from L1 tx receipt
      const warpData = await getWarpMessageFromTxHash(l1TxHash)

      // Aggregate BLS signatures from L1 validators
      const signedWarpMessage = await aggregateWarpSignatures(warpData.unsignedMessage)

      updateState({
        warpMessage: warpData,
        signedWarpMessage,
        step: 'pchain',
      })
    } catch (err) {
      updateState({ error: `Warp aggregation failed: ${err.message}` })
    }
  }, [state, updateState])

  // ── Step 4: Submit P-Chain transaction ──
  const submitPChainTx = useCallback(async (params = {}) => {
    const { signedWarpMessage, operation } = state
    if (!signedWarpMessage) {
      updateState({ error: 'No signed Warp message' })
      return
    }

    // Ensure Core is connected
    if (!walletClientRef.current) {
      const connected = await connectCore()
      if (!connected) return
    }

    try {
      updateState({ error: null })
      let txHash

      if (operation === 'register') {
        txHash = await submitRegisterL1ValidatorTx(walletClientRef.current, {
          signedWarpMessage,
          initialBalanceAvax: params.initialBalanceAvax || 0.1,
        })
      } else {
        // remove or weight update both use SetL1ValidatorWeightTx
        txHash = await submitSetL1ValidatorWeightTx(walletClientRef.current, {
          signedWarpMessage,
        })
      }

      updateState({
        pChainTxHash: txHash,
        step: 'complete',
      })
    } catch (err) {
      updateState({ error: `P-Chain transaction failed: ${err.message}` })
    }
  }, [state, updateState, connectCore])

  // ── Step 5: After complete tx on L1 is confirmed ──
  const onCompleteTxConfirmed = useCallback(() => {
    updateState({ step: 'done' })
  }, [updateState])

  // ── Manual override: user provides P-Chain tx hash directly ──
  const setManualPChainTxHash = useCallback((txHash) => {
    updateState({ pChainTxHash: txHash, step: 'complete' })
  }, [updateState])

  return {
    ...state,
    // Actions
    connectCore,
    startRegister,
    startRemove,
    startWeightUpdate,
    onL1TxSubmitted,
    onL1TxConfirmed,
    aggregateSignatures,
    submitPChainTx,
    onCompleteTxConfirmed,
    setManualPChainTxHash,
    reset,
  }
}
