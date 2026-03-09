/* Lightweight hash worker — loads WASM and hashes a file portion into leaf hashes.
 * Spawned in parallel by the main orchestrator for multi-core leaf hashing. */

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
    const bytes = new Uint8Array(await blob.arrayBuffer())
    const hashes = await self.muriHashChunks(bytes)
    // Transfer the underlying ArrayBuffer (zero-copy back to coordinator)
    self.postMessage({ id, hashes }, [hashes.buffer])
  } catch (err) {
    self.postMessage({ id, error: err.message || String(err) })
  }
}
