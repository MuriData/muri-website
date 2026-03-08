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
    numChunks,
    error,
    selectFile,
    uploadToIpfs,
    reset,
  }
}
