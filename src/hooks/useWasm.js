import { useState, useCallback } from 'react'
import { computeFileRoot as wasmComputeRoot, generateFSPProof as wasmGenerateFSP, terminate as wasmTerminate } from '../lib/muri-wasm'

/**
 * Hook for WASM-powered file root computation and FSP proof generation.
 *
 * stage: 'hashing' | 'root' | 'proof' | null
 *   - hashing: parallel leaf hashing across workers (large files only)
 *   - root: tree assembly / root computation
 *   - proof: Groth16 proving
 */
export function useWasm() {
  const [root, setRoot] = useState(null)
  const [numChunks, setNumChunks] = useState(0)
  const [proof, setProof] = useState(null)
  const [isComputing, setIsComputing] = useState(false)
  const [stage, setStage] = useState(null)
  const [hashWorkers, setHashWorkers] = useState(0)
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
    setStage('hashing')
    setError(null)
    try {
      const result = await wasmGenerateFSP(file, (progress) => {
        if (progress.stage === 'hashing') {
          setNumChunks(progress.numChunks || 0)
          setHashWorkers(progress.workers || 0)
          setStage('hashing')
        } else if (progress.stage === 'root') {
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
      setHashWorkers(0)
    }
  }, [])

  const reset = useCallback(() => {
    wasmTerminate()
    setRoot(null)
    setNumChunks(0)
    setProof(null)
    setIsComputing(false)
    setStage(null)
    setHashWorkers(0)
    setError(null)
  }, [])

  return {
    root,
    numChunks,
    proof,
    isComputing,
    stage,
    hashWorkers,
    error,
    computeRoot,
    generateProof,
    reset,
  }
}
