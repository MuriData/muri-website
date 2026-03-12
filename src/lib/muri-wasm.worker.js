/* Web Worker for muri WASM operations — keeps main thread responsive.
 * Handles both single-threaded (small files) and pre-hashed (parallel) paths. */

// Derive base URL from the worker script location so assets resolve
// correctly when hosted under a subpath (e.g. /ipfs/CID/).
const _base = self.location.href.replace(/\/assets\/.*$/, '/')

let loaded = false
let loadPromise = null

async function ensureLoaded() {
  if (loaded) return
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    importScripts(_base + 'wasm_exec.js')
    const go = new Go()
    const result = await WebAssembly.instantiateStreaming(
      fetch(_base + 'muri.wasm'),
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
    fetch(_base + 'fsp_prover.key').then((r) => {
      if (!r.ok) throw new Error('Failed to fetch fsp_prover.key')
      return r.arrayBuffer()
    }),
    fetch(_base + 'fsp_verifier.key').then((r) => {
      if (!r.ok) throw new Error('Failed to fetch fsp_verifier.key')
      return r.arrayBuffer()
    }),
  ])
  return fspKeysCache
}

function makeProgressCallback(id) {
  return (data) => {
    const progress = { stage: data.stage }
    if (data.root !== undefined) progress.root = data.root
    if (data.numChunks !== undefined) progress.numChunks = data.numChunks
    self.postMessage({ id, progress })
  }
}

self.onmessage = async (e) => {
  const { id, type } = e.data
  try {
    await ensureLoaded()

    if (type === 'computeRoot') {
      const fileBytes = new Uint8Array(await e.data.file.arrayBuffer())
      const result = await self.muriComputeFileRoot(fileBytes)
      self.postMessage({ id, result })

    } else if (type === 'generateProof') {
      // Single-worker path (small files)
      const fileBytes = new Uint8Array(await e.data.file.arrayBuffer())
      const [pk, vk] = await loadFSPKeys()
      const result = await self.muriGenerateFSPProof(
        fileBytes,
        new Uint8Array(pk),
        new Uint8Array(vk),
        makeProgressCallback(id),
      )
      self.postMessage({ id, result })

    } else if (type === 'computeRootFromHashes') {
      // Parallel path — leaf hashes already computed by hash workers
      const { leafHashes, numLeaves } = e.data
      const result = await self.muriComputeRootFromHashes(
        new Uint8Array(leafHashes),
        numLeaves,
      )
      self.postMessage({ id, result })

    } else if (type === 'generateProofFromHashes') {
      // Parallel path — leaf hashes already computed by hash workers
      const { leafHashes, numLeaves } = e.data
      const [pk, vk] = await loadFSPKeys()
      const result = await self.muriGenerateFSPProofFromHashes(
        new Uint8Array(leafHashes),
        numLeaves,
        new Uint8Array(pk),
        new Uint8Array(vk),
        makeProgressCallback(id),
      )
      self.postMessage({ id, result })
    }
  } catch (err) {
    self.postMessage({ id, error: err.message || String(err) })
  }
}
