/**
 * Kubo HTTP API client — fallback for users running a local IPFS daemon.
 * Compatible with the /api/v0/ endpoints.
 *
 * Supports optional auth: 'none' | 'basic' | 'bearer' | 'header'.
 */
export class KuboClient {
  constructor(apiUrl = 'http://localhost:5001', auth = {}) {
    this.apiUrl = apiUrl.replace(/\/$/, '')
    this.auth = auth // { type, username, password, token, headerName, headerValue }
  }

  _headers() {
    const h = {}
    if (!this.auth?.type || this.auth.type === 'none') return h

    if (this.auth.type === 'basic') {
      h['Authorization'] = 'Basic ' + btoa(`${this.auth.username || ''}:${this.auth.password || ''}`)
    } else if (this.auth.type === 'bearer') {
      h['Authorization'] = `Bearer ${this.auth.token || ''}`
    } else if (this.auth.type === 'header') {
      if (this.auth.headerName) {
        h[this.auth.headerName] = this.auth.headerValue || ''
      }
    }
    return h
  }

  async ping() {
    const res = await fetch(`${this.apiUrl}/api/v0/id`, {
      method: 'POST',
      headers: this._headers(),
    })
    if (!res.ok) throw new Error(`IPFS ping failed: ${res.status}`)
    const data = await res.json()
    return { peerId: data.ID, agentVersion: data.AgentVersion }
  }

  async cat(cid) {
    const res = await fetch(`${this.apiUrl}/api/v0/cat?arg=${encodeURIComponent(cid)}`, {
      method: 'POST',
      headers: this._headers(),
    })
    if (!res.ok) throw new Error(`IPFS cat failed: ${res.status}`)
    const buf = await res.arrayBuffer()
    return new Uint8Array(buf)
  }

  async add(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${this.apiUrl}/api/v0/add?pin=true`, {
      method: 'POST',
      headers: this._headers(),
      body: form,
    })
    if (!res.ok) throw new Error(`IPFS add failed: ${res.status}`)
    const data = await res.json()
    return data.Hash
  }
}
