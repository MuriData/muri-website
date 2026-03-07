import { useReadContracts } from 'wagmi'
import { formatEther } from 'viem'
import { FILE_MARKET_ADDRESS, FILE_MARKET_ABI } from '../lib/contracts'

const POLL_INTERVAL = 15_000 // 15s — single multicall

const marketContract = { address: FILE_MARKET_ADDRESS, abi: FILE_MARKET_ABI }

// Format bigint wei to MURI with decimals
export function formatMuri(wei, decimals = 4) {
  if (wei == null) return '—'
  const val = formatEther(wei)
  const num = parseFloat(val)
  if (num === 0) return '0'
  if (num < 0.0001) return '< 0.0001'
  return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals })
}

// Format chunk count to human-readable storage size (1 chunk = 16 KB)
export function formatChunks(chunks) {
  if (chunks == null) return '—'
  const n = Number(chunks)
  const kb = n * 16
  if (kb < 1024) return `${kb} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(1)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(2)} GB`
}

export function truncateAddress(addr) {
  if (!addr) return '—'
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

// All dashboard reads batched into one Multicall3 call
const CALLS = [
  { ...marketContract, functionName: 'getGlobalStats' },              // 0
  { ...marketContract, functionName: 'getFinancialStats' },           // 1
  { ...marketContract, functionName: 'getProofSystemStats' },         // 2
  { ...marketContract, functionName: 'getAllSlotInfo' },               // 3
  { ...marketContract, functionName: 'getRecentOrders', args: [10n] },// 4
  { ...marketContract, functionName: 'getSlashRedistributionStats' }, // 5
]

// ── Single multicall for all dashboard data ──
export function useDashboardData() {
  const { data, isLoading, isError, error } = useReadContracts({
    contracts: CALLS,
    query: { refetchInterval: POLL_INTERVAL, staleTime: POLL_INTERVAL },
  })

  const get = (i) => data?.[i]?.status === 'success' ? data[i].result : undefined

  // block.number is returned by both getGlobalStats[9] and getProofSystemStats[3]
  const globalStats = get(0)
  const blockNumber = globalStats?.[8]

  return {
    globalStats,
    financialStats: get(1),
    proofStats: get(2),
    slotInfo: get(3),
    recentOrders: get(4),
    slashStats: get(5),
    blockNumber,
    isLoading,
    isError: isError || (data != null && data.every(r => r.status === 'failure')),
    error,
  }
}
