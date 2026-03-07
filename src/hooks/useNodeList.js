import { useMemo, useState } from 'react'
import { useReadContracts } from 'wagmi'
import {
  FILE_MARKET_ADDRESS,
  FILE_MARKET_ABI,
  NODE_STAKING_ADDRESS,
  NODE_STAKING_ABI,
} from '../lib/contracts'

const POLL_INTERVAL = 30_000
const PAGE_SIZE = 20

const stakingContract = { address: NODE_STAKING_ADDRESS, abi: NODE_STAKING_ABI }
const marketContract = { address: FILE_MARKET_ADDRESS, abi: FILE_MARKET_ABI }

export function useNodeList() {
  const [page, setPage] = useState(0)
  const offset = page * PAGE_SIZE

  // Phase 1: get a page of node addresses + total count
  const { data: pageData, isLoading: pageLoading } = useReadContracts({
    contracts: [
      { ...stakingContract, functionName: 'getNodeListPage', args: [BigInt(offset), BigInt(PAGE_SIZE)] },
    ],
    query: { refetchInterval: POLL_INTERVAL },
  })

  const pageResult = pageData?.[0]?.status === 'success' ? pageData[0].result : undefined
  const addresses = useMemo(() => pageResult?.[0] ?? [], [pageResult])
  const totalNodes = pageResult?.[1] != null ? Number(pageResult[1]) : 0
  const totalPages = Math.max(1, Math.ceil(totalNodes / PAGE_SIZE))

  // Phase 2: fetch info for each address on this page
  const infoCalls = useMemo(() => {
    if (!addresses.length) return []
    return addresses.flatMap((addr) => [
      { ...stakingContract, functionName: 'getNodeInfo', args: [addr] },
      { ...marketContract, functionName: 'getNodeEarningsInfo', args: [addr] },
    ])
  }, [addresses])

  const { data: infoData, isLoading: infoLoading } = useReadContracts({
    contracts: infoCalls,
    query: {
      enabled: infoCalls.length > 0,
      refetchInterval: POLL_INTERVAL,
    },
  })

  // Assemble rows: each node has 2 calls (getNodeInfo, getNodeEarningsInfo)
  const nodes = useMemo(() => {
    if (!addresses.length || !infoData) return []
    return addresses.map((addr, i) => {
      const nodeInfo = infoData[i * 2]?.status === 'success' ? infoData[i * 2].result : undefined
      const earnings = infoData[i * 2 + 1]?.status === 'success' ? infoData[i * 2 + 1].result : undefined
      return { address: addr, nodeInfo, earnings }
    })
  }, [addresses, infoData])

  return {
    nodes,
    page,
    totalPages,
    totalNodes,
    isLoading: pageLoading || (addresses.length > 0 && infoLoading),
    setPage,
    hasPrev: page > 0,
    hasNext: page < totalPages - 1,
    prevPage: () => setPage((p) => Math.max(0, p - 1)),
    nextPage: () => setPage((p) => Math.min(totalPages - 1, p + 1)),
  }
}
