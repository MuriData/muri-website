import { useState, useCallback } from 'react'

const CHUNK_SIZE = 16384 // 16 KB — matches muri-zkproof config

/**
 * Manages file upload pipeline:
 * idle → selected → uploading → uploaded → ready
 */
export function useFileUpload(ipfsUpload) {
  const [state, setState] = useState('idle')
  const [file, setFile] = useState(null)
  const [cid, setCid] = useState(null)
  const [numChunks, setNumChunks] = useState(0)
  const [error, setError] = useState(null)

  const selectFile = useCallback((f) => {
    setFile(f)
    setNumChunks(Math.ceil(f.size / CHUNK_SIZE))
    setCid(null)
    setError(null)
    setState('selected')
  }, [])

  const uploadToIpfs = useCallback(async () => {
    if (!file || !ipfsUpload) return
    setState('uploading')
    setError(null)
    try {
      const hash = await ipfsUpload(file)
      setCid(hash)
      setState('uploaded')
    } catch (err) {
      setError(err.message || 'Upload failed')
      setState('selected')
    }
  }, [file, ipfsUpload])

  const importFromCid = useCallback(async (cidStr, ipfsFetch) => {
    setState('uploading')
    setError(null)
    setCid(null)
    setFile(null)
    try {
      const bytes = await ipfsFetch(cidStr)
      if (!bytes || !bytes.length) {
        throw new Error('Fetched 0 bytes — block may not be available from this IPFS node')
      }
      const blob = new File([bytes], cidStr, { type: 'application/octet-stream' })
      setFile(blob)
      setNumChunks(Math.ceil(bytes.length / CHUNK_SIZE))
      setCid(cidStr)
      setState('uploaded')
    } catch (err) {
      setError(err.message || 'Failed to fetch from IPFS')
      setState('idle')
    }
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setFile(null)
    setCid(null)
    setNumChunks(0)
    setError(null)
  }, [])

  return {
    state,       // idle | selected | uploading | uploaded
    file,
    cid,
    setCid,
    numChunks,
    error,
    selectFile,
    uploadToIpfs,
    importFromCid,
    reset,
  }
}
