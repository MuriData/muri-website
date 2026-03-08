import { useAccount, useReadContracts, useReadContract } from 'wagmi'
import { FILE_MARKET_ADDRESS, FILE_MARKET_ABI } from '../lib/contracts'

const market = { address: FILE_MARKET_ADDRESS, abi: FILE_MARKET_ABI }
const POLL_INTERVAL = 15_000

/**
 * Fetch orders owned by the connected wallet.
 * Scans recent orders and filters by owner === address.
 * Also reads pending refund balance.
 */
export function useMyOrders() {
  const { address, isConnected } = useAccount()

  // Fetch recent orders (up to 50) to find ones owned by this wallet
  const { data: recentData, isLoading: ordersLoading } = useReadContract({
    ...market,
    functionName: 'getRecentOrders',
    args: [50n],
    query: {
      enabled: isConnected && !!address,
      refetchInterval: POLL_INTERVAL,
    },
  })

  // Fetch pending refund balance
  const { data: refundBalance } = useReadContract({
    ...market,
    functionName: 'pendingRefunds',
    args: [address],
    query: {
      enabled: isConnected && !!address,
      refetchInterval: POLL_INTERVAL,
    },
  })

  // Filter orders owned by connected wallet
  let myOrderIds = []
  if (recentData && address) {
    const [ids, owners] = recentData
    for (let i = 0; i < ids.length; i++) {
      if (owners[i]?.toLowerCase() === address.toLowerCase()) {
        myOrderIds.push(ids[i])
      }
    }
  }

  // Fetch details + financials for each owned order
  const detailContracts = myOrderIds.flatMap((id) => [
    { ...market, functionName: 'getOrderDetails', args: [id] },
    { ...market, functionName: 'getOrderFinancials', args: [id] },
  ])

  const { data: detailData, isLoading: detailsLoading } = useReadContracts({
    contracts: detailContracts,
    query: {
      enabled: myOrderIds.length > 0,
      refetchInterval: POLL_INTERVAL,
    },
  })

  // Assemble orders
  const orders = myOrderIds.map((id, i) => {
    const details = detailData?.[i * 2]?.status === 'success' ? detailData[i * 2].result : null
    const financials = detailData?.[i * 2 + 1]?.status === 'success' ? detailData[i * 2 + 1].result : null
    return { id, details, financials }
  })

  return {
    isConnected,
    orders,
    isLoading: ordersLoading || (myOrderIds.length > 0 && detailsLoading),
    refundBalance: refundBalance ?? 0n,
  }
}
