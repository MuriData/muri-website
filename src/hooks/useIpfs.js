import { useState, useEffect, useCallback, useRef } from 'react'
import { getHelia, stopHelia, addFile as heliaAddFile, catFile as heliaCatFile, getNodeInfo as heliaInfo } from '../lib/helia'
import { KuboClient } from '../lib/ipfs'

const STORAGE_KEY = 'muri_ipfs_config'

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { mode: 'browser', endpoint: 'http://localhost:5001', auth: { type: 'none' } }
}

function saveConfig(cfg) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)) } catch { /* ignore */ }
}

export function useIpfs() {
  const [config, setConfigState] = useState(loadConfig)
  const [status, setStatus] = useState('disconnected') // disconnected | connecting | connected | error
  const [info, setInfo] = useState(null) // { peerId, peerCount? }
  const [error, setError] = useState(null)
  const kuboRef = useRef(null)

  const setConfig = useCallback((updates) => {
    setConfigState((prev) => {
      const next = { ...prev, ...updates }
      saveConfig(next)
      return next
    })
    // reset connection when config changes
    setStatus('disconnected')
    setInfo(null)
    setError(null)
  }, [])

  const connect = useCallback(async () => {
    setStatus('connecting')
    setError(null)
    try {
      if (config.mode === 'browser') {
        await getHelia()
        const nodeInfo = await heliaInfo()
        setInfo({ peerId: nodeInfo.peerId, peerCount: nodeInfo.peerCount })
      } else {
        const client = new KuboClient(config.endpoint, config.auth)
        const res = await client.ping()
        kuboRef.current = client
        setInfo({ peerId: res.peerId })
      }
      setStatus('connected')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Connection failed')
    }
  }, [config.mode, config.endpoint, config.auth])

  const disconnect = useCallback(async () => {
    if (config.mode === 'browser') {
      await stopHelia()
    }
    kuboRef.current = null
    setStatus('disconnected')
    setInfo(null)
    setError(null)
  }, [config.mode])

  const upload = useCallback(async (file) => {
    if (status !== 'connected') throw new Error('IPFS not connected')

    if (config.mode === 'browser') {
      return heliaAddFile(file)
    } else {
      return kuboRef.current.add(file)
    }
  }, [status, config.mode])

  const fetchFile = useCallback(async (cid) => {
    if (status !== 'connected') throw new Error('IPFS not connected')

    if (config.mode === 'browser') {
      return heliaCatFile(cid)
    } else {
      return kuboRef.current.cat(cid)
    }
  }, [status, config.mode])

  // Refresh peer count periodically for browser mode
  useEffect(() => {
    if (status !== 'connected' || config.mode !== 'browser') return
    const id = setInterval(async () => {
      try {
        const nodeInfo = await heliaInfo()
        setInfo((prev) => prev ? { ...prev, peerCount: nodeInfo.peerCount } : prev)
      } catch { /* ignore */ }
    }, 10_000)
    return () => clearInterval(id)
  }, [status, config.mode])

  return {
    mode: config.mode,
    endpoint: config.endpoint,
    auth: config.auth || { type: 'none' },
    status,
    info,
    error,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    setConfig,
    connect,
    disconnect,
    upload,
    fetchFile,
  }
}
