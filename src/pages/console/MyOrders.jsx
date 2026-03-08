import { useState } from 'react'
import { useMyOrders } from '../../hooks/useMyOrders'
import { useStorageActions } from '../../hooks/useStorageActions'
import { formatMuri, formatChunks, truncateAddress } from '../../hooks/useDashboardData'

function IconList() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h14M3 10h14M3 15h14" />
    </svg>
  )
}

function IconWallet() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="16" height="13" rx="2" />
      <path d="M2 8h16" />
      <circle cx="14" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

function getOrderStatus(financials) {
  if (!financials) return 'unknown'
  const [, , , expired] = financials
  if (expired) return 'expired'
  return 'active'
}

function OrderCard({ id, details, financials }) {
  const { cancelOrder, completeExpiredOrder, isPending, isConfirming, isSuccess, error } = useStorageActions()
  const [confirming, setConfirming] = useState(null) // 'cancel' | 'complete'

  if (!details) return null

  const [, uri, , numChunks, periods, replicas, filled] = details
  const status = getOrderStatus(financials)
  const escrow = financials ? financials[0] : 0n
  const nodes = financials ? financials[4] : []
  const isFilled = filled === replicas
  const badgeClass = status === 'active' ? (isFilled ? 'active' : 'waiting') : status

  return (
    <div className="order-card">
      <div className="order-card__header">
        <span className="order-card__id">Order #{id.toString()}</span>
        <span className={`order-card__badge order-card__badge--${badgeClass}`}>
          {status === 'active' ? (isFilled ? 'Active' : `Waiting ${filled.toString()}/${replicas.toString()}`) : status}
        </span>
      </div>
      <div className="order-card__grid">
        <div className="order-card__field">
          <span className="order-card__field-label">Size</span>
          <span className="order-card__field-value">{formatChunks(numChunks)}</span>
        </div>
        <div className="order-card__field">
          <span className="order-card__field-label">Duration</span>
          <span className="order-card__field-value">{periods.toString()} periods ({Number(periods) * 7}d)</span>
        </div>
        <div className="order-card__field">
          <span className="order-card__field-label">Replicas</span>
          <span className="order-card__field-value">{filled.toString()} / {replicas.toString()}</span>
        </div>
        <div className="order-card__field">
          <span className="order-card__field-label">Escrow</span>
          <span className="order-card__field-value">{formatMuri(escrow)} MURI</span>
        </div>
        {uri && (
          <div className="order-card__field" style={{ gridColumn: '1 / -1' }}>
            <span className="order-card__field-label">IPFS CID</span>
            <span className="order-card__field-value" style={{ fontFamily: 'monospace', fontSize: '0.7rem', wordBreak: 'break-all' }}>
              {uri}
            </span>
          </div>
        )}
        {nodes && nodes.length > 0 && (
          <div className="order-card__field" style={{ gridColumn: '1 / -1' }}>
            <span className="order-card__field-label">Storage Nodes</span>
            <span className="order-card__field-value">
              {nodes.map((n) => truncateAddress(n)).join(', ')}
            </span>
          </div>
        )}
      </div>

      <div className="order-card__actions">
        {status === 'active' && (
          <>
            {confirming === 'cancel' ? (
              <>
                <button
                  className="console-btn console-btn--danger console-btn--small"
                  onClick={() => { cancelOrder(id); setConfirming(null) }}
                  disabled={isPending || isConfirming}
                >
                  {isPending || isConfirming ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
                <button
                  className="console-btn console-btn--secondary console-btn--small"
                  onClick={() => setConfirming(null)}
                >
                  Back
                </button>
              </>
            ) : (
              <button
                className="console-btn console-btn--danger console-btn--small"
                onClick={() => setConfirming('cancel')}
              >
                Cancel Order
              </button>
            )}
          </>
        )}
        {status === 'expired' && (
          <button
            className="console-btn console-btn--secondary console-btn--small"
            onClick={() => completeExpiredOrder(id)}
            disabled={isPending || isConfirming}
          >
            {isPending || isConfirming ? 'Processing...' : 'Complete & Settle'}
          </button>
        )}
      </div>

      {isSuccess && (
        <div className="tx-status tx-status--success" style={{ gridColumn: '1 / -1' }}>Action completed</div>
      )}
      {error && (
        <div className="tx-status tx-status--error" style={{ gridColumn: '1 / -1' }}>
          {error.shortMessage || error.message}
        </div>
      )}
    </div>
  )
}

function MyOrders() {
  const { orders, isLoading, refundBalance } = useMyOrders()
  const { withdrawRefund, isPending: refundPending, isConfirming: refundConfirming, isSuccess: refundSuccess } = useStorageActions()
  const [filter, setFilter] = useState('all')

  const filtered = orders.filter((o) => {
    if (filter === 'all') return true
    const s = getOrderStatus(o.financials)
    return filter === s
  })

  const hasRefund = refundBalance > 0n

  return (
    <>
      {/* Refund panel */}
      {hasRefund && (
        <div className="console-panel">
          <h2 className="console-panel__title">
            <span className="console-panel__title-icon"><IconWallet /></span>
            Pending Refund
          </h2>
          <div className="refund-panel">
            <div>
              <div className="refund-panel__amount">{formatMuri(refundBalance)} MURI</div>
              <div className="refund-panel__label">Available to withdraw</div>
            </div>
            <button
              className="console-btn console-btn--primary console-btn--small"
              onClick={withdrawRefund}
              disabled={refundPending || refundConfirming}
            >
              {refundPending || refundConfirming ? 'Withdrawing...' : 'Withdraw'}
            </button>
          </div>
          {refundSuccess && (
            <div className="tx-status tx-status--success" style={{ marginTop: 8 }}>Refund withdrawn</div>
          )}
        </div>
      )}

      {/* Orders */}
      <div className="console-panel">
        <h2 className="console-panel__title">
          <span className="console-panel__title-icon"><IconList /></span>
          My Orders
          {orders.length > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>({orders.length})</span>}
        </h2>

        {orders.length > 0 && (
          <div className="my-orders__filters">
            {['all', 'active', 'expired'].map((f) => (
              <button
                key={f}
                className={`my-orders__filter${filter === f ? ' my-orders__filter--active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <p className="console-empty">Loading orders...</p>
        ) : filtered.length === 0 ? (
          <p className="console-empty">
            {orders.length === 0
              ? 'No orders placed yet. Upload a file to create your first order.'
              : `No ${filter} orders`}
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {filtered.map((o) => (
              <OrderCard key={o.id.toString()} id={o.id} details={o.details} financials={o.financials} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default MyOrders
