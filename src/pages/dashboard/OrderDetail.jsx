import { useParams, Link } from 'react-router-dom'
import { useOrderDetail } from '../../hooks/useOrderDetail'
import { formatMuri, formatChunks, truncateAddress } from '../../hooks/useDashboardData'
import '../Dashboard.css'

function Row({ label, value, mono }) {
  return (
    <div className="panel-row">
      <span className="panel-row__label">{label}</span>
      <span className={`panel-row__value${mono ? ' explorer-mono' : ''}`}>{value ?? '—'}</span>
    </div>
  )
}

function OrderDetail() {
  const { orderId } = useParams()
  const id = BigInt(orderId)
  const { details, financials, isLoading } = useOrderDetail(id)

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <Link to="/dashboard" className="explorer-back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
            Back to dashboard
          </Link>
          <h1 className="dashboard-title">Order #{orderId}</h1>
          <p className="dashboard-subtitle">
            {isLoading ? 'Loading...' : financials ? (financials[3] ? 'Expired' : 'Active') : ''}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="dashboard-loading">
          <div className="dashboard-loading__spinner" />
          <span>Loading order data...</span>
        </div>
      ) : (
        <div className="dashboard-panels" style={{ gridColumn: '1 / -1' }}>
          {details && (
            <div className="dashboard-panel">
              <h2 className="dashboard-panel__title">Details</h2>
              <Row label="Owner" value={truncateAddress(details[0])} mono />
              <Row label="URI" value={details[1] || '—'} mono />
              <Row label="Root Hash" value={details[2] ? `0x${details[2].toString(16).slice(0, 16)}...` : '—'} mono />
              <Row label="Size" value={formatChunks(details[3])} />
              <Row label="Periods" value={details[4]?.toString()} />
              <Row label="Replicas" value={`${details[6]?.toString()} / ${details[5]?.toString()}`} />
            </div>
          )}

          {financials && (
            <div className="dashboard-panel">
              <h2 className="dashboard-panel__title">Financials</h2>
              <Row label="Escrow" value={`${formatMuri(financials[0])} MURI`} />
              <Row label="Withdrawn" value={`${formatMuri(financials[1])} MURI`} />
              <Row label="Start Period" value={financials[2]?.toString()} />
              <Row
                label="Status"
                value={
                  <span className={`order-status order-status--${financials[3] ? 'expired' : 'active'}`}>
                    {financials[3] ? 'Expired' : 'Active'}
                  </span>
                }
              />
              {financials[4] && financials[4].length > 0 && (
                <div className="panel-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                  <span className="panel-row__label">Assigned Nodes</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {financials[4].map((addr) => (
                      <span key={addr} className="explorer-badge explorer-badge--contract">{truncateAddress(addr)}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!details && !financials && (
            <div className="dashboard-panel" style={{ gridColumn: '1 / -1' }}>
              <p className="dashboard-empty">No data available for this order.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderDetail
