/**
 * Kubo HTTP API client — fallback for users running a local IPFS daemon.
 * Compatible with the /api/v0/ endpoints.
 */
export class KuboClient {
  constructor(apiUrl = 'http://localhost:5001') {
    this.apiUrl = apiUrl.replace(/\/$/, '')
  }

  async ping() {
    const res = await fetch(`${this.apiUrl}/api/v0/id`, { method: 'POST' })
    if (!res.ok) throw new Error(`IPFS ping failed: ${res.status}`)
    const data = await res.json()
    return { peerId: data.ID, agentVersion: data.AgentVersion }
  }

  async add(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${this.apiUrl}/api/v0/add?pin=true`, {
      method: 'POST',
      body: form,
    })
    if (!res.ok) throw new Error(`IPFS add failed: ${res.status}`)
    const data = await res.json()
    return data.Hash
  }
}
