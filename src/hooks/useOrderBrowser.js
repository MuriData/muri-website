import { useMemo, useState } from 'react'
import { useReadContracts } from 'wagmi'
import { FILE_MARKET_ADDRESS, FILE_MARKET_ABI } from '../lib/contracts'

const POLL_INTERVAL = 15_000
const PAGE_SIZE = 10

const marketContract = { address: FILE_MARKET_ADDRESS, abi: FILE_MARKET_ABI }

export function useOrderBrowser() {
  const [page, setPage] = useState(0)
  const [mode, setMode] = useState('active') // 'active' | 'challengeable'
  const offset = page * PAGE_SIZE

  const functionName = mode === 'active' ? 'getActiveOrdersPage' : 'getChallengeableOrdersPage'

  // Phase 1: get a page of order IDs + total
  const { data: pageData, isLoading: pageLoading } = useReadContracts({
    contracts: [
      { ...marketContract, functionName, args: [BigInt(offset), BigInt(PAGE_SIZE)] },
    ],
    query: { refetchInterval: POLL_INTERVAL },
  })

  const pageResult = pageData?.[0]?.status === 'success' ? pageData[0].result : undefined
  const orderIds = useMemo(() => pageResult?.[0] ?? [], [pageResult])
  const totalOrders = pageResult?.[1] != null ? Number(pageResult[1]) : 0
  const totalPages = Math.max(1, Math.ceil(totalOrders / PAGE_SIZE))

  // Phase 2: fetch details + financials for each order on this page
  const detailCalls = useMemo(() => {
    if (!orderIds.length) return []
    return orderIds.flatMap((id) => [
      { ...marketContract, functionName: 'getOrderDetails', args: [id] },
      { ...marketContract, functionName: 'getOrderFinancials', args: [id] },
    ])
  }, [orderIds])

  const { data: detailData, isLoading: detailLoading } = useReadContracts({
    contracts: detailCalls,
    query: {
      enabled: detailCalls.length > 0,
      refetchInterval: POLL_INTERVAL,
    },
  })

  const orders = useMemo(() => {
    if (!orderIds.length || !detailData) return []
    return orderIds.map((id, i) => {
      const details = detailData[i * 2]?.status === 'success' ? detailData[i * 2].result : undefined
      const financials = detailData[i * 2 + 1]?.status === 'success' ? detailData[i * 2 + 1].result : undefined
      return { id, details, financials }
    })
  }, [orderIds, detailData])

  return {
    orders,
    mode,
    setMode: (m) => { setMode(m); setPage(0) },
    page,
    totalPages,
    totalOrders,
    isLoading: pageLoading || (orderIds.length > 0 && detailLoading),
    hasPrev: page > 0,
    hasNext: page < totalPages - 1,
    prevPage: () => setPage((p) => Math.max(0, p - 1)),
    nextPage: () => setPage((p) => Math.min(totalPages - 1, p + 1)),
  }
}
