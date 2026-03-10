/**
 * WASM operations with multi-worker parallel leaf hashing.
 *
 * For large files (>1000 chunks), leaf hashing is distributed across N Web
 * Workers using File.slice() (zero-copy), then the pre-hashed leaves are sent
 * to a single proof worker for tree assembly + Groth16 proof generation.
 *
 * For small files, the single-worker path is used (no overhead).
 *
 * API:
 *   computeFileRoot(file) → Promise<{ root, numChunks }>
 *   generateFSPProof(file, onProgress?) → Promise<{ proof, root, numChunks }>
 *   terminate() — kill all workers
 */

const CHUNK_SIZE = 16384 // 16 KB — must match Go's fsp.FileSize
const PARALLEL_THRESHOLD = 500 // chunks — below this, single-worker is fine
const MAX_HASH_WORKERS = 8

let proofWorker = null
let nextId = 0
const pending = new Map()

// ── Proof worker (singleton) ──

function getProofWorker() {
  if (!proofWorker) {
    proofWorker = new Worker(new URL('./muri-wasm.worker.js', import.meta.url))
    proofWorker.onmessage = (e) => {
      const { id, result, error, progress } = e.data
      const p = pending.get(id)
      if (!p) return
      if (progress) {
        p.onProgress?.(progress)
        return
      }
      pending.delete(id)
      if (error) p.reject(new Error(error))
      else p.resolve(result)
    }
    proofWorker.onerror = (e) => {
      for (const [, p] of pending) {
        p.reject(new Error(e.message || 'Worker error'))
      }
      pending.clear()
    }
  }
  return proofWorker
}

function callProofWorker(msg, onProgress) {
  return new Promise((resolve, reject) => {
    const id = nextId++
    pending.set(id, { resolve, reject, onProgress })
    getProofWorker().postMessage({ id, ...msg })
  })
}

// ── Parallel leaf hashing ──

function getNumHashWorkers() {
  const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 2) : 2
  // Reserve 1 core for the proof worker, cap at MAX_HASH_WORKERS.
  return Math.min(Math.max(cores - 1, 1), MAX_HASH_WORKERS)
}

/**
 * Hash file chunks in parallel across N workers.
 * Returns a single Uint8Array of concatenated 32-byte leaf hashes.
 */
function parallelHashChunks(file, onProgress) {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  const numWorkers = Math.min(getNumHashWorkers(), totalChunks)

  onProgress?.({ stage: 'hashing', numChunks: totalChunks, workers: numWorkers })

  return new Promise((resolve, reject) => {
    const results = new Array(numWorkers)
    let completed = 0
    let hasErrored = false
    const workers = []

    for (let i = 0; i < numWorkers; i++) {
      const startChunk = Math.floor(i * totalChunks / numWorkers)
      const endChunk = Math.floor((i + 1) * totalChunks / numWorkers)
      const startByte = startChunk * CHUNK_SIZE
      const endByte = Math.min(endChunk * CHUNK_SIZE, file.size)

      const w = new Worker(new URL('./muri-wasm-hasher.worker.js', import.meta.url))
      workers.push(w)

      w.onmessage = (e) => {
        if (hasErrored) return
        if (e.data.error) {
          hasErrored = true
          workers.forEach((wk) => wk.terminate())
          reject(new Error(e.data.error))
          return
        }
        results[i] = e.data.hashes // Uint8Array, already transferred
        completed++
        if (completed === numWorkers) {
          // Concatenate all leaf hashes in order
          const totalBytes = results.reduce((s, r) => s + r.byteLength, 0)
          const combined = new Uint8Array(totalBytes)
          let offset = 0
          for (const r of results) {
            combined.set(r, offset)
            offset += r.byteLength
          }
          workers.forEach((wk) => wk.terminate())
          resolve({ leafHashes: combined.buffer, numLeaves: totalChunks })
        }
      }

      w.onerror = (e) => {
        if (hasErrored) return
        hasErrored = true
        workers.forEach((wk) => wk.terminate())
        reject(new Error(e.message || 'Hash worker error'))
      }

      // File.slice is zero-copy — each worker reads only its portion.
      w.postMessage({ id: i, blob: file.slice(startByte, endByte) })
    }
  })
}

// ── Public API ──

/**
 * Compute the Poseidon2 Sparse Merkle Tree root from a file.
 * @param {File} file
 * @returns {Promise<{ root: string, numChunks: number }>}
 */
export async function computeFileRoot(file) {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

  if (totalChunks < PARALLEL_THRESHOLD) {
    return callProofWorker({ type: 'computeRoot', file })
  }

  // Parallel path: hash leaves, then build tree in proof worker.
  const { leafHashes, numLeaves } = await parallelHashChunks(file)
  return callProofWorker({ type: 'computeRootFromHashes', leafHashes, numLeaves })
}

/**
 * Generate an FSP (File Size Proof) Groth16 proof.
 * @param {File} file
 * @param {function} [onProgress] — { stage, root?, numChunks?, workers? }
 * @returns {Promise<{ proof: string[], root: string, numChunks: number }>}
 */
export async function generateFSPProof(file, onProgress) {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

  if (totalChunks < PARALLEL_THRESHOLD) {
    return callProofWorker({ type: 'generateProof', file }, onProgress)
  }

  // Parallel path: hash leaves across workers, then proof in proof worker.
  const { leafHashes, numLeaves } = await parallelHashChunks(file, onProgress)
  return callProofWorker(
    { type: 'generateProofFromHashes', leafHashes, numLeaves },
    onProgress,
  )
}

/**
 * Terminate all workers, cancelling any in-flight computation.
 */
export function terminate() {
  if (proofWorker) {
    proofWorker.terminate()
    proofWorker = null
    for (const [, p] of pending) {
      p.reject(new Error('Cancelled'))
    }
    pending.clear()
  }
}
