import { useState } from 'react'
import { useStakeNode } from '../../hooks/useNodeActions'
import { formatMuri } from '../../hooks/useDashboardData'

const STAKE_PER_CHUNK = 100000000000000n // 10^14 wei
const CHUNK_BYTES = 16384 // 16 KB

const UNITS = [
  { label: 'Chunks', bytes: CHUNK_BYTES },
  { label: 'KB',     bytes: 1024 },
  { label: 'MB',     bytes: 1024 * 1024 },
  { label: 'GB',     bytes: 1024 * 1024 * 1024 },
]

function NodeStakeForm() {
  const [capacityInput, setCapacityInput] = useState('')
  const [unit, setUnit] = useState('GB')
  const [publicKey, setPublicKey] = useState('')
  const { stake, isPending, isConfirming, isSuccess, error, reset } = useStakeNode()

  const rawValue = Number(capacityInput) || 0
  const selectedUnit = UNITS.find((u) => u.label === unit)
  const chunks = unit === 'Chunks'
    ? Math.floor(rawValue)
    : Math.floor((rawValue * selectedUnit.bytes) / CHUNK_BYTES)
  const stakeValue = BigInt(chunks) * STAKE_PER_CHUNK

  const canSubmit = chunks > 0 && publicKey.length > 0 && !isPending && !isConfirming

  function formatStorage(chunks) {
    const bytes = chunks * CHUNK_BYTES
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    stake(chunks, publicKey, stakeValue)
  }

  if (isSuccess) {
    return (
      <div className="node-panel">
        <div className="tx-status tx-status--success" style={{ marginBottom: 8 }}>
          Node registered successfully!
        </div>
        <button className="console-btn console-btn--secondary console-btn--small" onClick={reset}>
          Dismiss
        </button>
      </div>
    )
  }

  return (
    <div className="node-panel">
      <h2 className="dashboard-panel__title">
        <span className="dashboard-panel__title-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="10" r="7" /><path d="M10 7v6M7 10h6" />
          </svg>
        </span>
        Become a Storage Node
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">Capacity</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className="form-input"
              type="number"
              min={0}
              step="any"
              value={capacityInput}
              onChange={(e) => setCapacityInput(e.target.value)}
              placeholder={unit === 'Chunks' ? 'e.g. 1024' : `e.g. 1`}
              style={{ flex: 1 }}
            />
            <select
              className="form-input"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={{ width: 'auto', minWidth: '90px' }}
            >
              {UNITS.map((u) => (
                <option key={u.label} value={u.label}>{u.label}</option>
              ))}
            </select>
          </div>
          <span className="form-hint">
            {chunks > 0 ? `${chunks} chunks = ${formatStorage(chunks)}` : '1 chunk = 16 KB'}
          </span>
        </div>
        <div className="form-group">
          <label className="form-label">Node Public Key</label>
          <input
            className="form-input form-input--mono"
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="0x1a2b3c..."
          />
          <span className="form-hint">
            Public key of the node. Generate with muri-node CLI (Browser is not safe).
          </span>
        </div>
        <div className="cost-breakdown">
          <div className="cost-row">
            <span>Capacity</span>
            <span className="cost-row__value">{chunks > 0 ? `${chunks} chunks (${formatStorage(chunks)})` : '—'}</span>
          </div>
          <div className="cost-row">
            <span>Stake per chunk</span>
            <span className="cost-row__value">{formatMuri(STAKE_PER_CHUNK)} MURI</span>
          </div>
          <div className="cost-row">
            <span>Total Stake Required</span>
            <span className="cost-row__value">{formatMuri(stakeValue)} MURI</span>
          </div>
        </div>
        <button
          className="console-btn console-btn--primary"
          type="submit"
          disabled={!canSubmit}
        >
          {isPending ? 'Confirm in wallet...' : isConfirming ? 'Confirming...' : `Stake ${formatMuri(stakeValue)} MURI`}
        </button>
        {error && (
          <div className="tx-status tx-status--error">
            {error.shortMessage || error.message}
          </div>
        )}
      </form>
    </div>
  )
}

export default NodeStakeForm
