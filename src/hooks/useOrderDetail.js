import { useMemo } from 'react'
import { useReadContracts } from 'wagmi'
import { FILE_MARKET_ADDRESS, FILE_MARKET_ABI } from '../lib/contracts'

const marketContract = { address: FILE_MARKET_ADDRESS, abi: FILE_MARKET_ABI }

export function useOrderDetail(orderId) {
  const { data, isLoading } = useReadContracts({
    contracts: [
      { ...marketContract, functionName: 'getOrderDetails', args: [orderId] },
      { ...marketContract, functionName: 'getOrderFinancials', args: [orderId] },
      { ...marketContract, functionName: 'getOrderEscrowInfo', args: [orderId] },
    ],
    query: {
      enabled: orderId != null,
      staleTime: 30_000,
    },
  })

  const get = (i) => data?.[i]?.status === 'success' ? data[i].result : undefined

  const financials = get(1)
  const nodes = financials?.[4] ?? []

  // Phase 2: fetch per-node earnings for each assigned node
  const earningsCalls = useMemo(() => {
    if (!nodes.length || orderId == null) return []
    return nodes.map((addr) => ({
      ...marketContract,
      functionName: 'getNodeOrderEarnings',
      args: [addr, orderId],
    }))
  }, [nodes, orderId])

  const { data: earningsData, isLoading: earningsLoading } = useReadContracts({
    contracts: earningsCalls,
    query: {
      enabled: earningsCalls.length > 0,
      staleTime: 30_000,
    },
  })

  const nodeEarnings = useMemo(() => {
    if (!earningsData || !nodes.length) return undefined
    return nodes.map((addr, i) => ({
      address: addr,
      earned: earningsData[i]?.status === 'success' ? earningsData[i].result : undefined,
    }))
  }, [earningsData, nodes])

  return {
    isLoading: isLoading || (nodes.length > 0 && earningsLoading),
    details: get(0),        // [owner, uri, root, numChunks, periods, replicas, filled]
    financials,             // [escrow, withdrawn, startPeriod, expired, nodes[]]
    escrowInfo: get(2),     // [totalEscrow, paidToNodes, remainingEscrow]
    nodeEarnings,           // [{address, earned}]
  }
}
