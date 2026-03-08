import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'

let heliaNode = null
let heliaFs = null
let initPromise = null

/**
 * Lazily create a browser Helia IPFS node.
 * Returns { helia, fs } — reuses the same instance across calls.
 */
export async function getHelia() {
  if (heliaNode && heliaFs) return { helia: heliaNode, fs: heliaFs }
  if (initPromise) return initPromise

  initPromise = (async () => {
    try {
      heliaNode = await createHelia()
      heliaFs = unixfs(heliaNode)
      return { helia: heliaNode, fs: heliaFs }
    } catch (err) {
      initPromise = null
      throw err
    }
  })()

  return initPromise
}

/**
 * Stop the Helia node and reset state.
 */
export async function stopHelia() {
  if (heliaNode) {
    await heliaNode.stop()
    heliaNode = null
    heliaFs = null
    initPromise = null
  }
}

/**
 * Add a File/Blob to the local Helia node via UnixFS.
 * Advertises the CID to the DHT so other nodes can discover this peer.
 * Returns the CID as a string.
 */
export async function addFile(file) {
  const { helia, fs } = await getHelia()
  const bytes = new Uint8Array(await file.arrayBuffer())
  const cid = await fs.addBytes(bytes)

  // Advertise to DHT in the background (don't block upload)
  helia.routing.provide(cid).catch(() => {})

  return cid.toString()
}

/**
 * Fetch file bytes from the network by ref (CID or CID/path).
 * Supports: "QmHash", "QmHash/path/to/file"
 */
export async function catFile(ref) {
  const { fs } = await getHelia()
  const { CID } = await import('multiformats/cid')

  // Split ref into root CID and optional subpath
  const slashIdx = ref.indexOf('/')
  const cidStr = slashIdx > 0 ? ref.slice(0, slashIdx) : ref
  const path = slashIdx > 0 ? ref.slice(slashIdx) : undefined

  const cid = CID.parse(cidStr)
  const opts = path ? { path } : undefined
  const chunks = []
  for await (const chunk of fs.cat(cid, opts)) {
    chunks.push(chunk)
  }
  const total = chunks.reduce((n, c) => n + c.length, 0)
  const result = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }
  return result
}

/**
 * Get info about the running Helia node.
 */
export async function getNodeInfo() {
  const { helia } = await getHelia()
  const peerId = helia.libp2p.peerId.toString()
  const peers = helia.libp2p.getPeers()
  return { peerId, peerCount: peers.length }
}
