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
 * Get info about the running Helia node.
 */
export async function getNodeInfo() {
  const { helia } = await getHelia()
  const peerId = helia.libp2p.peerId.toString()
  const peers = helia.libp2p.getPeers()
  return { peerId, peerCount: peers.length }
}
