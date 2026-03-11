// ─────────────────────────────────────────────────────────────────────────────
// Central configuration — single source of truth for all network, chain,
// contract, and service constants used across the website.
//
// When switching networks (e.g. testnet → mainnet), only edit THIS file.
// ─────────────────────────────────────────────────────────────────────────────

// ── Network ──
export const CHAIN_ID = 97981
export const CHAIN_NAME = 'MuriData Testnet Alpha'
export const NETWORK_SLUG = 'muridata-testnet'
export const NATIVE_CURRENCY = { name: 'MuriCoin', symbol: 'MURI', decimals: 18 }

// ── RPC ──
export const RPC_BASE = 'https://testnet-rpc.muri.moe'
export const BLOCKCHAIN_ID = 'inP2vNhcVSABGmq39UHwuB9tDxUUWp3g6gpRwdE6TqtAtAWmu'
export const L1_RPC = `${RPC_BASE}/ext/bc/${BLOCKCHAIN_ID}/rpc`
export const PLATFORM_API = `${RPC_BASE}/ext/bc/P`
export const WARP_API = `${RPC_BASE}/ext/bc/${BLOCKCHAIN_ID}`

// ── Explorer ──
export const BLOCKSCOUT_URL = 'https://testnet-explorer.muri.moe'
export const EXPLORER_NAME = 'MuriData Testnet Alpha Explorer'

// ── Faucet ──
export const FAUCET_URL = 'https://testnet-faucet.muri.moe/'

// ── IPFS ──
export const IPFS_GATEWAY = 'https://ipfs-rpc.muri.moe/'
export const IPFS_TOKEN = 'v17BbEqG2qlLJfz3DEvQTiTGA3ubUzVoJUD9fShNmQ4'
export const IPFS_PUBLIC_GATEWAY = 'https://ipfs.io/ipfs/'

/** Build a public gateway URL from an on-chain URI like `ipfs://QmHash` or `ipfs://QmHash/path` */
export function ipfsGatewayUrl(uri) {
  if (!uri) return null
  let ref = uri
  if (ref.startsWith('ipfs://')) ref = ref.slice(7)
  if (!ref || ref === '/') return null
  return `${IPFS_PUBLIC_GATEWAY}${ref}`
}

// ── Contract addresses ──
export const FILE_MARKET_ADDRESS = '0xaab9f94671d6b22eee60509b5c3149e90a78fb54'
export const NODE_STAKING_ADDRESS = '0x0aa050f832a6bf4bf7f24741a51544982e22ce41'
export const STAKING_MANAGER_ADDRESS = '0x253803b44d5c309ba776940dd5307ed4dcd25933'
export const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'

// ── Avalanche precompiles ──
export const WARP_PRECOMPILE = '0x0200000000000000000000000000000000000005'
export const SEND_WARP_MESSAGE_TOPIC = '0x56600c567728a800c0aa927500f831cb451df66a7af570eb4df4571bee9c83e4'

// ── Protocol constants ──
export const STAKE_PER_CHUNK = 400000000000000n // 4 × 10^14 wei
export const CHUNK_BYTES = 16384 // 16 KB
export const SNARK_SCALAR_FIELD = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001n

// ── Known contract selectors (explorer display) ──
export const KNOWN_SELECTORS = {
  '0x9e9e5253': 'placeOrder',
  '0xa1a870d9': 'executeOrder',
  '0xe68f31e3': 'submitProof',
  '0x514fcac7': 'cancelOrder',
  '0x4ee7de66': 'completeExpiredOrder',
  '0xd2926b21': 'quitOrder',
  '0x372500ab': 'claimRewards',
  '0xdbbbe766': 'processExpiredSlots',
  '0x53e3c7a1': 'activateSlots',
  '0x780a7750': 'stakeNode',
  '0x95d426ad': 'unstakeNode',
  '0xbb34a381': 'increaseCapacity',
  '0xc90cbfbe': 'decreaseCapacity',
  '0x485cc955': 'initialize',
  '0x82ad56cb': 'aggregate3',
}

// ── Known addresses (explorer display, derived from contract addresses) ──
export const KNOWN_ADDRESSES = {
  [FILE_MARKET_ADDRESS.toLowerCase()]: 'FileMarket',
  [NODE_STAKING_ADDRESS.toLowerCase()]: 'NodeStaking',
  [MULTICALL3_ADDRESS.toLowerCase()]: 'Multicall3',
}
