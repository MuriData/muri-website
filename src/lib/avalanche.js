// Avalanche Platform API helpers for validator/subnet info
// Base URL derived from the EVM RPC endpoint

const RPC_BASE = 'https://testnet-rpc.muri.moe'
const PLATFORM_URL = `${RPC_BASE}/ext/bc/P`

// The blockchain ID from our RPC path
const BLOCKCHAIN_ID = '2qyiuZtqxCmwRosTYFBsoyTSsupLwsvvFPh9K2inL82Sd8m8Yf'

async function platformCall(method, params = {}) {
  const res = await fetch(PLATFORM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json.result
}

// Resolve subnet ID from blockchain ID, then fetch validators
// Response is ACP-77 L1 format: weight, balance, validationID, publicKey (no connected/uptime/endTime)
export async function getSubnetValidators() {
  // Step 1: get the subnet ID for our blockchain
  let subnetID
  try {
    const blockchains = await platformCall('platform.getBlockchains')
    const chain = blockchains.blockchains?.find(
      (bc) => bc.id === BLOCKCHAIN_ID
    )
    subnetID = chain?.subnetID
  } catch {
    subnetID = undefined
  }

  // Step 2: fetch current validators
  const params = subnetID ? { subnetID } : {}
  const result = await platformCall('platform.getCurrentValidators', params)
  return (result.validators || []).map((v) => ({
    nodeID: v.nodeID,
    startTime: Number(v.startTime),
    weight: v.weight || '0',
    balance: v.balance || '0',
    validationID: v.validationID || '',
    publicKey: v.publicKey || '',
    // ACP-77 L1 validators don't have connected/uptime/endTime/stakeAmount
  }))
}
