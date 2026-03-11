import { useState, useRef, useCallback } from 'react'
import { useMyOrders } from '../../hooks/useMyOrders'
import { useStorageActions } from '../../hooks/useStorageActions'
import { formatMuri, formatChunks, truncateAddress } from '../../hooks/useDashboardData'
import { ipfsGatewayUrl } from '../../lib/config'

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

function OrderCard({ id, details, financials, ipfs }) {
  const { cancelOrder, completeExpiredOrder, isPending, isConfirming, isSuccess, error } = useStorageActions()
  const [confirming, setConfirming] = useState(null) // 'cancel' | 'complete'
  const [seedStatus, setSeedStatus] = useState(null) // null | 'seeding' | 'seeded' | 'error'
  const [seedError, setSeedError] = useState(null)
  const reseedInputRef = useRef(null)

  const handleReseed = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file || !ipfs?.upload) return
    setSeedStatus('seeding')
    setSeedError(null)
    try {
      await ipfs.upload(file)
      setSeedStatus('seeded')
    } catch (err) {
      setSeedStatus('error')
      setSeedError(err.message || 'Failed to seed file')
    }
    // reset input so the same file can be re-selected
    e.target.value = ''
  }, [ipfs])

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
            <div className="order-card__uri-row">
              <span className="order-card__uri-value">
                {uri}
              </span>
              {ipfsGatewayUrl(uri) && (
                <a
                  href={ipfsGatewayUrl(uri)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="order-card__view-link"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3" />
                    <path d="M10 2h4v4" />
                    <path d="M7 9L14 2" />
                  </svg>
                  View File
                </a>
              )}
            </div>
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
        {status === 'active' && !isFilled && ipfs?.isConnected && (
          <>
            <input
              ref={reseedInputRef}
              type="file"
              onChange={handleReseed}
              style={{ display: 'none' }}
            />
            <button
              className="console-btn console-btn--primary console-btn--small"
              onClick={() => reseedInputRef.current?.click()}
              disabled={seedStatus === 'seeding'}
            >
              {seedStatus === 'seeding' ? 'Seeding...' : 'Reseed File'}
            </button>
          </>
        )}
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

      {seedStatus === 'seeded' && (
        <div className="tx-status tx-status--success" style={{ gridColumn: '1 / -1' }}>File re-added to IPFS — keep this tab open until nodes pick it up</div>
      )}
      {seedStatus === 'error' && (
        <div className="tx-status tx-status--error" style={{ gridColumn: '1 / -1' }}>{seedError}</div>
      )}
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

function MyOrders({ ipfs }) {
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
              <OrderCard key={o.id.toString()} id={o.id} details={o.details} financials={o.financials} ipfs={ipfs} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default MyOrders
