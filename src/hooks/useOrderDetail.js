import { useReadContracts } from 'wagmi'
import { FILE_MARKET_ADDRESS, FILE_MARKET_ABI } from '../lib/contracts'

const marketContract = { address: FILE_MARKET_ADDRESS, abi: FILE_MARKET_ABI }

export function useOrderDetail(orderId) {
  const { data, isLoading } = useReadContracts({
    contracts: [
      { ...marketContract, functionName: 'getOrderDetails', args: [orderId] },
      { ...marketContract, functionName: 'getOrderFinancials', args: [orderId] },
    ],
    query: {
      enabled: orderId != null,
      staleTime: 30_000,
    },
  })

  const get = (i) => data?.[i]?.status === 'success' ? data[i].result : undefined

  return {
    isLoading,
    details: get(0),     // [owner, uri, root, numChunks, periods, replicas, filled]
    financials: get(1),  // [escrow, withdrawn, startPeriod, expired, nodes[]]
  }
}
