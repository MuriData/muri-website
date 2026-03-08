/**
 * Loader for the muri.wasm Go module.
 *
 * Exposes:
 *   computeFileRoot(file: File) → Promise<{ root: string, numChunks: number }>
 *   generateFSPProof(file: File, proverKey: ArrayBuffer, verifierKey: ArrayBuffer)
 *       → Promise<{ proof: string[], root: string, numChunks: number }>
 *
 * The WASM module is loaded lazily on first call and stays resident.
 */

let loaded = false
let loadPromise = null

async function ensureLoaded() {
  if (loaded) return
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    // Load wasm_exec.js (Go's WASM support runtime)
    if (!globalThis.Go) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = '/wasm_exec.js'
        script.onload = resolve
        script.onerror = () => reject(new Error('Failed to load wasm_exec.js'))
        document.head.appendChild(script)
      })
    }

    const go = new globalThis.Go()
    const result = await WebAssembly.instantiateStreaming(
      fetch('/muri.wasm'),
      go.importObject,
    )

    // Run the Go main() — it sets global functions and blocks forever.
    go.run(result.instance)
    loaded = true
  })()

  return loadPromise
}

/**
 * Compute the Poseidon2 Sparse Merkle Tree root from raw file bytes.
 * Uses the exact same algorithm as muri-zkproof (same hash params, same tree depth).
 *
 * @param {File} file
 * @returns {Promise<{ root: string, numChunks: number }>}
 */
export async function computeFileRoot(file) {
  await ensureLoaded()
  const bytes = new Uint8Array(await file.arrayBuffer())
  return globalThis.muriComputeFileRoot(bytes)
}

/**
 * Fetch the bundled FSP prover and verifier keys from /public.
 * Cached after first fetch.
 */
let fspKeysPromise = null

async function loadFSPKeys() {
  if (fspKeysPromise) return fspKeysPromise
  fspKeysPromise = Promise.all([
    fetch('/fsp_prover.key').then((r) => {
      if (!r.ok) throw new Error('Failed to fetch fsp_prover.key')
      return r.arrayBuffer()
    }),
    fetch('/fsp_verifier.key').then((r) => {
      if (!r.ok) throw new Error('Failed to fetch fsp_verifier.key')
      return r.arrayBuffer()
    }),
  ])
  return fspKeysPromise
}

/**
 * Generate an FSP (File Size Proof) Groth16 proof.
 * Automatically fetches the bundled prover + verifier keys.
 *
 * @param {File} file
 * @returns {Promise<{ proof: string[], root: string, numChunks: number }>}
 */
export async function generateFSPProof(file) {
  await ensureLoaded()
  const [proverKey, verifierKey] = await loadFSPKeys()
  const fileBytes = new Uint8Array(await file.arrayBuffer())
  const pkBytes = new Uint8Array(proverKey)
  const vkBytes = new Uint8Array(verifierKey)
  return globalThis.muriGenerateFSPProof(fileBytes, pkBytes, vkBytes)
}
