import { useState } from 'react'
import { useIncreaseCapacity, useDecreaseCapacity } from '../../hooks/useNodeActions'
import { formatMuri, formatChunks } from '../../hooks/useDashboardData'
import { STAKE_PER_CHUNK, CHUNK_BYTES } from '../../lib/config'

const UNITS = [
  { label: 'Chunks', bytes: CHUNK_BYTES },
  { label: 'KB',     bytes: 1024 },
  { label: 'MB',     bytes: 1024 * 1024 },
  { label: 'GB',     bytes: 1024 * 1024 * 1024 },
]

function CapacityForm({ nodeInfo }) {
  const [mode, setMode] = useState(null) // null | 'increase' | 'decrease'
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('GB')

  const incr = useIncreaseCapacity()
  const decr = useDecreaseCapacity()

  if (!nodeInfo) return null

  const [, capacity, used] = nodeInfo
  const free = capacity - used
  const rawValue = Number(amount) || 0
  const selectedUnit = UNITS.find((u) => u.label === unit)
  const chunks = unit === 'Chunks'
    ? Math.floor(rawValue)
    : Math.floor((rawValue * selectedUnit.bytes) / CHUNK_BYTES)

  const handleIncrease = () => {
    const additionalStake = BigInt(chunks) * STAKE_PER_CHUNK
    incr.increase(chunks, additionalStake)
  }

  const handleDecrease = () => {
    decr.decrease(chunks)
  }

  if (incr.isSuccess || decr.isSuccess) {
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <div className="tx-status tx-status--success">
          Capacity {incr.isSuccess ? 'increased' : 'decreased'} successfully
        </div>
        <button className="console-btn console-btn--secondary console-btn--small" onClick={() => { incr.reset(); decr.reset(); setMode(null); setAmount(''); setUnit('GB') }}>
          Done
        </button>
      </div>
    )
  }

  if (!mode) {
    return (
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="console-btn console-btn--secondary console-btn--small" onClick={() => setMode('increase')}>
          + Increase
        </button>
        <button
          className="console-btn console-btn--secondary console-btn--small"
          onClick={() => setMode('decrease')}
          disabled={free === 0n}
        >
          − Decrease
        </button>
      </div>
    )
  }

  const isIncrease = mode === 'increase'
  const maxDecrease = Number(free)
  const valid = chunks > 0 && (isIncrease || chunks <= maxDecrease)
  const active = isIncrease ? incr : decr
  const additionalStake = isIncrease ? BigInt(chunks) * STAKE_PER_CHUNK : 0n

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div className="form-group">
        <label className="form-label">{isIncrease ? 'Additional capacity' : 'Reduce capacity'}</label>
        <div className="capacity-input-group">
          <input
            className="form-input capacity-input-group__input"
            type="number"
            min={1}
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={isIncrease ? (unit === 'Chunks' ? 'e.g. 512' : 'e.g. 1') : `max ${maxDecrease} chunks`}
          />
          <select
            className="form-input capacity-input-group__select"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            {UNITS.map((u) => (
              <option key={u.label} value={u.label}>{u.label}</option>
            ))}
          </select>
        </div>
        {chunks > 0 && (
          <span className="form-hint">
            {chunks} chunks · {isIncrease
              ? `Additional stake: ${formatMuri(additionalStake)} MURI · New capacity: ${formatChunks(capacity + BigInt(chunks))}`
              : `Freed stake: ${formatMuri(BigInt(chunks) * STAKE_PER_CHUNK)} MURI · New capacity: ${formatChunks(capacity - BigInt(chunks))}`
            }
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          className={`console-btn console-btn--${isIncrease ? 'primary' : 'danger'} console-btn--small`}
          onClick={isIncrease ? handleIncrease : handleDecrease}
          disabled={!valid || active.isPending || active.isConfirming}
        >
          {active.isPending ? 'Confirm...' : active.isConfirming ? 'Confirming...' : isIncrease ? 'Increase' : 'Decrease'}
        </button>
        <button className="console-btn console-btn--secondary console-btn--small" onClick={() => { setMode(null); setAmount('') }}>
          Cancel
        </button>
      </div>
      {active.error && (
        <div className="tx-status tx-status--error">{active.error.shortMessage || active.error.message}</div>
      )}
    </div>
  )
}

export default CapacityForm
