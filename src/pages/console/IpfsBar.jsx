import { useState } from 'react'

const AUTH_TYPES = [
  { value: 'none', label: 'None' },
  { value: 'basic', label: 'Basic Auth' },
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'header', label: 'Custom Header' },
]

function IpfsBar({ ipfs }) {
  const { mode, endpoint, auth, status, info, error, isConnected, isConnecting, setConfig, connect, disconnect } = ipfs
  const [endpointInput, setEndpointInput] = useState(endpoint)
  const [authState, setAuthState] = useState(auth || { type: 'none' })

  const updateAuth = (updates) => {
    const next = { ...authState, ...updates }
    setAuthState(next)
    setConfig({ auth: next })
  }

  const dotClass = `ipfs-bar__dot ipfs-bar__dot--${status}`

  const statusLabel = {
    disconnected: 'IPFS Disconnected',
    connecting: 'Connecting...',
    connected: mode === 'browser' ? 'Browser Node Active' : 'Connected to Kubo',
    error: 'Connection Failed',
  }[status]

  return (
    <div className="ipfs-bar">
      <div className="ipfs-bar__status">
        <span className={dotClass} />
        {statusLabel}
      </div>

      {isConnected && info && (
        <span className="ipfs-bar__info">
          Peer: {info.peerId?.slice(0, 12)}...
          {info.peerCount != null && ` · ${info.peerCount} peers`}
        </span>
      )}

      <div className="ipfs-bar__controls">
        <div className="ipfs-bar__mode-toggle">
          <button
            className={`ipfs-bar__mode-btn${mode === 'browser' ? ' ipfs-bar__mode-btn--active' : ''}`}
            onClick={() => setConfig({ mode: 'browser' })}
            disabled={isConnected}
          >
            Browser
          </button>
          <button
            className={`ipfs-bar__mode-btn${mode === 'external' ? ' ipfs-bar__mode-btn--active' : ''}`}
            onClick={() => setConfig({ mode: 'external' })}
            disabled={isConnected}
          >
            External
          </button>
        </div>

        {mode === 'external' && !isConnected && (
          <>
            <input
              className="ipfs-bar__endpoint"
              type="text"
              value={endpointInput}
              onChange={(e) => setEndpointInput(e.target.value)}
              onBlur={() => setConfig({ endpoint: endpointInput })}
              placeholder="http://localhost:5001"
            />
            <select
              className="ipfs-bar__endpoint"
              value={authState.type}
              onChange={(e) => updateAuth({ type: e.target.value })}
            >
              {AUTH_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {authState.type === 'basic' && (
              <>
                <input
                  className="ipfs-bar__endpoint"
                  type="text"
                  value={authState.username || ''}
                  onChange={(e) => updateAuth({ username: e.target.value })}
                  placeholder="Username"
                />
                <input
                  className="ipfs-bar__endpoint"
                  type="password"
                  value={authState.password || ''}
                  onChange={(e) => updateAuth({ password: e.target.value })}
                  placeholder="Password"
                />
              </>
            )}
            {authState.type === 'bearer' && (
              <input
                className="ipfs-bar__endpoint"
                type="password"
                value={authState.token || ''}
                onChange={(e) => updateAuth({ token: e.target.value })}
                placeholder="Bearer token"
              />
            )}
            {authState.type === 'header' && (
              <>
                <input
                  className="ipfs-bar__endpoint"
                  type="text"
                  value={authState.headerName || ''}
                  onChange={(e) => updateAuth({ headerName: e.target.value })}
                  placeholder="Header name"
                />
                <input
                  className="ipfs-bar__endpoint"
                  type="password"
                  value={authState.headerValue || ''}
                  onChange={(e) => updateAuth({ headerValue: e.target.value })}
                  placeholder="Header value"
                />
              </>
            )}
          </>
        )}

        {!isConnected ? (
          <button
            className="ipfs-bar__btn"
            onClick={connect}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        ) : (
          <button
            className="ipfs-bar__btn ipfs-bar__btn--disconnect"
            onClick={disconnect}
          >
            Disconnect
          </button>
        )}
      </div>

      {error && <div className="ipfs-bar__error">{error}</div>}
    </div>
  )
}

export default IpfsBar
