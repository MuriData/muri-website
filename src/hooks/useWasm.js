import { useState, useCallback } from 'react'
import { computeFileRoot as wasmComputeRoot, generateFSPProof as wasmGenerateFSP, terminate as wasmTerminate } from '../lib/muri-wasm'

/**
 * Hook for WASM-powered file root computation and FSP proof generation.
 *
 * Returns:
 *   computeRoot(file)         → sets root + numChunks
 *   generateProof(file, pk, vk) → sets proof[8] + root + numChunks
 *   root, numChunks, proof, isComputing, error, reset
 */
export function useWasm() {
  const [root, setRoot] = useState(null)
  const [numChunks, setNumChunks] = useState(0)
  const [proof, setProof] = useState(null)
  const [isComputing, setIsComputing] = useState(false)
  const [stage, setStage] = useState(null) // 'root' | 'proof' | null
  const [error, setError] = useState(null)

  const computeRoot = useCallback(async (file) => {
    setIsComputing(true)
    setStage('root')
    setError(null)
    try {
      const result = await wasmComputeRoot(file)
      setRoot(result.root)
      setNumChunks(result.numChunks)
      return result
    } catch (err) {
      setError(err.message || String(err))
      throw err
    } finally {
      setIsComputing(false)
      setStage(null)
    }
  }, [])

  const generateProof = useCallback(async (file) => {
    setIsComputing(true)
    setStage('root')
    setError(null)
    try {
      const result = await wasmGenerateFSP(file, (progress) => {
        if (progress.stage === 'root') {
          setRoot(progress.root)
          setNumChunks(progress.numChunks)
          setStage('proof')
        }
      })
      setRoot(result.root)
      setNumChunks(result.numChunks)
      setProof(result.proof)
      return result
    } catch (err) {
      setError(err.message || String(err))
      throw err
    } finally {
      setIsComputing(false)
      setStage(null)
    }
  }, [])

  const reset = useCallback(() => {
    wasmTerminate()
    setRoot(null)
    setNumChunks(0)
    setProof(null)
    setIsComputing(false)
    setStage(null)
    setError(null)
  }, [])

  return {
    root,
    numChunks,
    proof,
    isComputing,
    stage,
    error,
    computeRoot,
    generateProof,
    reset,
  }
}
