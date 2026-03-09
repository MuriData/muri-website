import { useState, useEffect, useCallback, useRef } from 'react'
import { createPublicClient, http, formatEther, formatGwei } from 'viem'
import { getSubnetValidators } from '../lib/avalanche'

const RPC_URL = 'https://testnet-rpc.muri.moe/ext/bc/inP2vNhcVSABGmq39UHwuB9tDxUUWp3g6gpRwdE6TqtAtAWmu/rpc'

const client = createPublicClient({
  transport: http(RPC_URL),
})

const BLOCK_POLL = 10_000
const VALIDATOR_POLL = 60_000
const RECENT_BLOCKS_COUNT = 15

// ── Module-level cache ──
// Survives component unmount/remount so navigating away and back is instant.
const cache = {
  blocks: [],
  latestBlockNumber: null,
  recentTxs: [],
  validators: [],
  validatorsError: null,
  seenBlocks: new Set(),
}

export function useBlocks() {
  const [blocks, setBlocks] = useState(cache.blocks)
  const [latestBlockNumber, setLatestBlockNumber] = useState(cache.latestBlockNumber)
  const [isLoading, setIsLoading] = useState(cache.blocks.length === 0)
  const seenRef = useRef(cache.seenBlocks)

  const fetchBlocks = useCallback(async () => {
    try {
      const latest = await client.getBlockNumber()
      setLatestBlockNumber(latest)
      cache.latestBlockNumber = latest

      const start = latest - BigInt(RECENT_BLOCKS_COUNT - 1)
      const from = start > 0n ? start : 0n
      const nums = []
      for (let i = latest; i >= from; i--) {
        if (!seenRef.current.has(i.toString())) nums.push(i)
      }

      if (nums.length === 0) return

      const fetched = await Promise.all(
        nums.map((n) => client.getBlock({ blockNumber: n, includeTransactions: false }))
      )

      const newBlocks = fetched.map((b) => ({
        number: Number(b.number),
        hash: b.hash,
        parentHash: b.parentHash,
        timestamp: Number(b.timestamp),
        gasUsed: b.gasUsed,
        gasLimit: b.gasLimit,
        txCount: b.transactions.length,
        miner: b.miner,
        baseFeePerGas: b.baseFeePerGas,
        size: b.size,
        transactionHashes: b.transactions,
      }))

      newBlocks.forEach((b) => seenRef.current.add(b.number.toString()))
      cache.seenBlocks = seenRef.current

      setBlocks((prev) => {
        const map = new Map(prev.map((b) => [b.number, b]))
        newBlocks.forEach((b) => map.set(b.number, b))
        const result = Array.from(map.values())
          .sort((a, b) => b.number - a.number)
          .slice(0, RECENT_BLOCKS_COUNT)
        cache.blocks = result
        return result
      })
    } catch (err) {
      console.error('Failed to fetch blocks:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBlocks()
    const id = setInterval(fetchBlocks, BLOCK_POLL)
    return () => clearInterval(id)
  }, [fetchBlocks])

  return { blocks, latestBlockNumber, isLoading }
}

// Per-block transaction cache
const txCache = new Map()

export function useTransactions(blockOrHash) {
  const cached = blockOrHash != null ? txCache.get(String(blockOrHash)) : undefined
  const [transactions, setTransactions] = useState(cached || [])
  const [isLoading, setIsLoading] = useState(!cached && blockOrHash != null)

  useEffect(() => {
    if (blockOrHash == null) return
    const key = String(blockOrHash)
    if (txCache.has(key)) {
      setTransactions(txCache.get(key))
      setIsLoading(false)
      return
    }
    let cancelled = false
    setIsLoading(true)

    async function load() {
      try {
        const block = await client.getBlock({
          blockNumber: BigInt(blockOrHash),
          includeTransactions: true,
        })
        if (cancelled) return
        const txs = block.transactions.map((tx) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          gasPrice: tx.gasPrice || tx.maxFeePerGas,
          gas: tx.gas,
          nonce: tx.nonce,
          blockNumber: Number(tx.blockNumber),
          type: tx.type,
          input: tx.input,
        }))
        txCache.set(key, txs)
        setTransactions(txs)
      } catch (err) {
        console.error('Failed to fetch transactions:', err)
        if (!cancelled) setTransactions([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [blockOrHash])

  return { transactions, isLoading }
}

export function useRecentTransactions(blocks) {
  const [txs, setTxs] = useState(cache.recentTxs)
  const [isLoading, setIsLoading] = useState(cache.recentTxs.length === 0)

  useEffect(() => {
    if (!blocks || blocks.length === 0) return
    let cancelled = false

    async function load() {
      const withTxs = blocks.filter((b) => b.txCount > 0).slice(0, 5)
      if (withTxs.length === 0) {
        setTxs([])
        cache.recentTxs = []
        setIsLoading(false)
        return
      }

      try {
        const fullBlocks = await Promise.all(
          withTxs.map((b) =>
            client.getBlock({ blockNumber: BigInt(b.number), includeTransactions: true })
          )
        )
        if (cancelled) return

        const allTxs = fullBlocks
          .flatMap((block) =>
            block.transactions.map((tx) => ({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: tx.value,
              blockNumber: Number(tx.blockNumber),
              timestamp: Number(block.timestamp),
              type: tx.type,
              input: tx.input,
            }))
          )
          .slice(0, 20)

        cache.recentTxs = allTxs
        setTxs(allTxs)
      } catch (err) {
        console.error('Failed to fetch recent txs:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [blocks])

  return { transactions: txs, isLoading }
}

export function useValidators() {
  const [validators, setValidators] = useState(cache.validators)
  const [isLoading, setIsLoading] = useState(cache.validators.length === 0)
  const [error, setError] = useState(cache.validatorsError)

  const fetch_ = useCallback(async () => {
    try {
      const vals = await getSubnetValidators()
      cache.validators = vals
      cache.validatorsError = null
      setValidators(vals)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch validators:', err)
      cache.validatorsError = err.message
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch_()
    const id = setInterval(fetch_, VALIDATOR_POLL)
    return () => clearInterval(id)
  }, [fetch_])

  return { validators, isLoading, error }
}

// Helpers
export function truncAddr(addr) {
  if (!addr) return '—'
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`
}

export function truncHash(hash) {
  if (!hash) return '—'
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

export function timeAgo(ts) {
  const diff = Math.floor(Date.now() / 1000) - ts
  if (diff < 5) return 'just now'
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export { formatEther, formatGwei }
