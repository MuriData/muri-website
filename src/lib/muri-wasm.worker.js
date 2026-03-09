/* Web Worker for muri WASM operations — keeps main thread responsive. */

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

let fspKeysCache = null

async function loadFSPKeys() {
  if (fspKeysCache) return fspKeysCache
  fspKeysCache = await Promise.all([
    fetch('/fsp_prover.key').then((r) => {
      if (!r.ok) throw new Error('Failed to fetch fsp_prover.key')
      return r.arrayBuffer()
    }),
    fetch('/fsp_verifier.key').then((r) => {
      if (!r.ok) throw new Error('Failed to fetch fsp_verifier.key')
      return r.arrayBuffer()
    }),
  ])
  return fspKeysCache
}

self.onmessage = async (e) => {
  const { id, type, file } = e.data
  try {
    await ensureLoaded()
    const fileBytes = new Uint8Array(await file.arrayBuffer())

    if (type === 'computeRoot') {
      const result = await self.muriComputeFileRoot(fileBytes)
      self.postMessage({ id, result })
    } else if (type === 'generateProof') {
      const [pk, vk] = await loadFSPKeys()
      const onProgress = (data) => {
        const progress = { stage: data.stage }
        if (data.root !== undefined) progress.root = data.root
        if (data.numChunks !== undefined) progress.numChunks = data.numChunks
        self.postMessage({ id, progress })
      }
      const result = await self.muriGenerateFSPProof(
        fileBytes,
        new Uint8Array(pk),
        new Uint8Array(vk),
        onProgress,
      )
      self.postMessage({ id, result })
    }
  } catch (err) {
    self.postMessage({ id, error: err.message || String(err) })
  }
}
