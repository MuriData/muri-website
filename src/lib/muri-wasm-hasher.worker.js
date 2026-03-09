/* Lightweight hash worker — loads WASM and hashes a file portion into leaf hashes.
 * Spawned in parallel by the main orchestrator for multi-core leaf hashing.
 *
 * Processes the blob in small batches (~1 MB) to keep memory bounded.
 * Without batching, a worker assigned 256 MB of a 1 GB file would load
 * the entire portion into both JS and Go WASM memory simultaneously. */

const CHUNK_SIZE = 16384 // 16 KB — must match Go's fsp.FileSize
const BATCH_CHUNKS = 64 // chunks per batch — peak memory ~1 MB

let loaded = false
let loadPromise = null

async function ensureLoaded() {
  if (loaded) return
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    importScripts('/wasm_exec.js')
    const go = new Go()
    const result = await WebAssembly.instantiateStreaming(
      fetch('/muri.wasm'),
      go.importObject,
    )
    go.run(result.instance)
    loaded = true
  })()

  return loadPromise
}

self.onmessage = async (e) => {
  const { id, blob } = e.data
  try {
    await ensureLoaded()

    const totalChunks = Math.ceil(blob.size / CHUNK_SIZE)
    const batchBytes = BATCH_CHUNKS * CHUNK_SIZE // ~1 MB per batch

    // Pre-allocate output buffer for all leaf hashes (32 bytes each).
    const allHashes = new Uint8Array(totalChunks * 32)
    let hashOffset = 0

    // Process in small batches instead of loading the entire blob at once.
    for (let byteOffset = 0; byteOffset < blob.size; byteOffset += batchBytes) {
      const end = Math.min(byteOffset + batchBytes, blob.size)
      const bytes = new Uint8Array(await blob.slice(byteOffset, end).arrayBuffer())
      const batchHashes = await self.muriHashChunks(bytes)
      allHashes.set(batchHashes, hashOffset)
      hashOffset += batchHashes.byteLength
    }

    // Transfer the underlying ArrayBuffer (zero-copy back to coordinator).
    const hashes = allHashes.subarray(0, hashOffset)
    self.postMessage({ id, hashes }, [hashes.buffer])
  } catch (err) {
    self.postMessage({ id, error: err.message || String(err) })
  }
}
