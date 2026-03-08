import { useState } from 'react'
import { useIncreaseCapacity, useDecreaseCapacity } from '../../hooks/useNodeActions'
import { formatMuri, formatChunks } from '../../hooks/useDashboardData'

const STAKE_PER_CHUNK = 100000000000000n // 10^14 wei

function CapacityForm({ nodeInfo }) {
  const [mode, setMode] = useState(null) // null | 'increase' | 'decrease'
  const [amount, setAmount] = useState('')

  const incr = useIncreaseCapacity()
  const decr = useDecreaseCapacity()

  if (!nodeInfo) return null

  const [, capacity, used] = nodeInfo
  const free = capacity - used
  const chunks = Number(amount) || 0

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
        <button className="console-btn console-btn--secondary console-btn--small" onClick={() => { incr.reset(); decr.reset(); setMode(null); setAmount('') }}>
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
        <label className="form-label">{isIncrease ? 'Additional chunks' : 'Reduce chunks'}</label>
        <input
          className="form-input"
          type="number"
          min={1}
          max={isIncrease ? undefined : maxDecrease}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={isIncrease ? 'e.g. 512' : `max ${maxDecrease}`}
        />
        {isIncrease && chunks > 0 && (
          <span className="form-hint">
            Additional stake: {formatMuri(additionalStake)} MURI · New capacity: {formatChunks(capacity + BigInt(chunks))}
          </span>
        )}
        {!isIncrease && chunks > 0 && (
          <span className="form-hint">
            Freed stake: {formatMuri(BigInt(chunks) * STAKE_PER_CHUNK)} MURI · New capacity: {formatChunks(capacity - BigInt(chunks))}
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
