import { useParams, Link } from 'react-router-dom'
import { useOrderDetail } from '../../hooks/useOrderDetail'
import { formatMuri, formatChunks, truncateAddress } from '../../hooks/useDashboardData'
import { ipfsGatewayUrl } from '../../lib/config'
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
  const { details, financials, escrowInfo, nodeEarnings, isLoading } = useOrderDetail(id)

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
              <Row
                label="URI"
                mono
                value={
                  details[1] && ipfsGatewayUrl(details[1]) ? (
                    <a
                      href={ipfsGatewayUrl(details[1])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="order-detail__uri-link"
                    >
                      {details[1]}
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3" />
                        <path d="M10 2h4v4" />
                        <path d="M7 9L14 2" />
                      </svg>
                    </a>
                  ) : (details[1] || '—')
                }
              />
              <Row label="Root Hash" value={details[2] ? `0x${details[2].toString(16).slice(0, 16)}...` : '—'} mono />
              <Row label="Size" value={formatChunks(details[3])} />
              <Row label="Periods" value={details[4]?.toString()} />
              <Row label="Replicas" value={`${details[6]?.toString()} / ${details[5]?.toString()}`} />
              {details[1] && ipfsGatewayUrl(details[1]) && (
                <div style={{ paddingTop: '8px' }}>
                  <a
                    href={ipfsGatewayUrl(details[1])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="order-detail__view-btn"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3" />
                      <path d="M10 2h4v4" />
                      <path d="M7 9L14 2" />
                    </svg>
                    View File on IPFS Gateway
                  </a>
                </div>
              )}
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
            </div>
          )}

          {escrowInfo && (
            <div className="dashboard-panel">
              <h2 className="dashboard-panel__title">Escrow Breakdown</h2>
              <Row label="Total Escrow" value={`${formatMuri(escrowInfo[0])} MURI`} />
              <Row label="Paid to Nodes" value={`${formatMuri(escrowInfo[1])} MURI`} />
              <Row label="Remaining" value={`${formatMuri(escrowInfo[2])} MURI`} />
              {escrowInfo[0] > 0n && (
                <Row
                  label="Utilization"
                  value={`${((Number(escrowInfo[1]) / Number(escrowInfo[0])) * 100).toFixed(1)}%`}
                />
              )}
            </div>
          )}

          {nodeEarnings && nodeEarnings.length > 0 && (
            <div className="dashboard-panel">
              <h2 className="dashboard-panel__title">Node Earnings</h2>
              <div className="orders-table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Node</th>
                      <th>Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodeEarnings.map(({ address, earned }) => (
                      <tr key={address}>
                        <td>{truncateAddress(address)}</td>
                        <td>{earned != null ? `${formatMuri(earned)} MURI` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
