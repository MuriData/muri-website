import { useState } from 'react'

function IpfsBar({ ipfs }) {
  const { mode, endpoint, status, info, error, isConnected, isConnecting, setConfig, connect, disconnect } = ipfs
  const [endpointInput, setEndpointInput] = useState(endpoint)

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
          <input
            className="ipfs-bar__endpoint"
            type="text"
            value={endpointInput}
            onChange={(e) => setEndpointInput(e.target.value)}
            onBlur={() => setConfig({ endpoint: endpointInput })}
            placeholder="http://localhost:5001"
          />
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
