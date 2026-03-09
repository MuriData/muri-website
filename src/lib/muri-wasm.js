/**
 * WASM operations via Web Worker — prevents main-thread blocking for large files.
 *
 * Same API as before:
 *   computeFileRoot(file: File) → Promise<{ root: string, numChunks: number }>
 *   generateFSPProof(file: File) → Promise<{ proof: string[], root: string, numChunks: number }>
 *   terminate() — kill running computation (e.g. on user cancel)
 */

let worker = null
let nextId = 0
const pending = new Map()

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('./muri-wasm.worker.js', import.meta.url))
    worker.onmessage = (e) => {
      const { id, result, error } = e.data
      const p = pending.get(id)
      if (!p) return
      pending.delete(id)
      if (error) p.reject(new Error(error))
      else p.resolve(result)
    }
    worker.onerror = (e) => {
      for (const [, p] of pending) {
        p.reject(new Error(e.message || 'Worker error'))
      }
      pending.clear()
    }
  }
  return worker
}

function callWorker(type, file) {
  return new Promise((resolve, reject) => {
    const id = nextId++
    pending.set(id, { resolve, reject })
    getWorker().postMessage({ id, type, file })
  })
}

/**
 * Compute the Poseidon2 Sparse Merkle Tree root from raw file bytes.
 * @param {File} file
 * @returns {Promise<{ root: string, numChunks: number }>}
 */
export function computeFileRoot(file) {
  return callWorker('computeRoot', file)
}

/**
 * Generate an FSP (File Size Proof) Groth16 proof.
 * @param {File} file
 * @returns {Promise<{ proof: string[], root: string, numChunks: number }>}
 */
export function generateFSPProof(file) {
  return callWorker('generateProof', file)
}

/**
 * Terminate the worker, cancelling any in-flight computation.
 */
export function terminate() {
  if (worker) {
    worker.terminate()
    worker = null
    for (const [, p] of pending) {
      p.reject(new Error('Cancelled'))
    }
    pending.clear()
  }
}
