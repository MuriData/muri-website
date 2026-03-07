import { Link, useNavigate } from 'react-router-dom'
import './Dashboard.css'
import {
  useDashboardData,
  formatMuri,
  formatChunks,
  truncateAddress,
} from '../hooks/useDashboardData'
import { useOrderBrowser } from '../hooks/useOrderBrowser'
import NodePanel from './dashboard/NodePanel'
import NodeListTable from './dashboard/NodeListTable'

// ── Icon components ──
function IconChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="10" width="3" height="8" rx="1" /><rect x="8.5" y="6" width="3" height="12" rx="1" /><rect x="15" y="2" width="3" height="16" rx="1" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2 L17 5 V10 C17 14.4 13.5 17.5 10 18.5 C6.5 17.5 3 14.4 3 10 V5 Z" />
      <path d="M7 10 L9 12 L13 8" />
    </svg>
  )
}

function IconSlash() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" /><path d="M5 15 L15 5" />
    </svg>
  )
}

function IconGrid() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="7" height="7" rx="1.5" /><rect x="11" y="2" width="7" height="7" rx="1.5" /><rect x="2" y="11" width="7" height="7" rx="1.5" /><rect x="11" y="11" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function IconList() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h14M3 10h14M3 15h14" />
    </svg>
  )
}

// ── Stat Card ──
function StatCard({ label, value, sub, highlight }) {
  return (
    <div className={`stat-card${highlight ? ' stat-card--highlight' : ''}`}>
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value ?? '—'}</span>
      {sub && <span className="stat-card__sub">{sub}</span>}
    </div>
  )
}

// ── Panel Row ──
function PanelRow({ label, value }) {
  return (
    <div className="panel-row">
      <span className="panel-row__label">{label}</span>
      <span className="panel-row__value">{value ?? '—'}</span>
    </div>
  )
}

// ── Challenge Slot Card ──
function SlotCard({ index, orderId, node, deadlineBlock, expired, currentBlock }) {
  const isIdle = !orderId || orderId === 0n
  const status = isIdle ? 'idle' : expired ? 'expired' : 'active'
  const blocksLeft = !isIdle && !expired && currentBlock ? Number(deadlineBlock - currentBlock) : null

  return (
    <div className={`slot-card slot-card--${status}`}>
      <div className="slot-card__header">
        <span className="slot-card__index">Slot {index}</span>
        <span className={`slot-badge slot-badge--${status}`}>{status}</span>
      </div>
      {!isIdle && (
        <>
          <div className="slot-card__detail">
            <span>Order</span>
            <span>#{orderId.toString()}</span>
          </div>
          <div className="slot-card__detail">
            <span>Node</span>
            <span>{truncateAddress(node)}</span>
          </div>
          <div className="slot-card__detail">
            <span>{expired ? 'Expired' : 'Blocks left'}</span>
            <span>{expired ? 'Awaiting sweep' : blocksLeft ?? '—'}</span>
          </div>
        </>
      )}
    </div>
  )
}

// ── Order Browser (paginated) ──
function OrderBrowser({ navigate }) {
  const {
    orders,
    mode,
    setMode,
    page,
    totalPages,
    totalOrders,
    isLoading,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  } = useOrderBrowser()

  return (
    <div className="dashboard-panel">
      <div className="dashboard-panel__title-row">
        <h2 className="dashboard-panel__title" style={{ marginBottom: 0 }}>
          <span className="dashboard-panel__title-icon"><IconGrid /></span>
          Order Browser
          <span className="node-list__count">{totalOrders}</span>
        </h2>
        <div className="order-browser__tabs">
          <button
            className={`order-browser__tab${mode === 'active' ? ' order-browser__tab--active' : ''}`}
            onClick={() => setMode('active')}
          >
            Active
          </button>
          <button
            className={`order-browser__tab${mode === 'challengeable' ? ' order-browser__tab--active' : ''}`}
            onClick={() => setMode('challengeable')}
          >
            Challengeable
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="dashboard-empty">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="dashboard-empty">No {mode} orders</p>
      ) : (
        <>
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Owner</th>
                  <th>Size</th>
                  <th>Periods</th>
                  <th>Replicas</th>
                  <th>Escrow</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(({ id, details: d, financials: f }) => (
                  <tr
                    key={id.toString()}
                    className="orders-table__row--clickable"
                    onClick={() => navigate(`/dashboard/order/${id.toString()}`)}
                  >
                    <td>
                      <Link to={`/dashboard/order/${id.toString()}`} className="explorer-link">
                        #{id.toString()}
                      </Link>
                    </td>
                    <td>{d ? truncateAddress(d[0]) : '—'}</td>
                    <td>{d ? formatChunks(d[3]) : '—'}</td>
                    <td>{d ? d[4]?.toString() : '—'}</td>
                    <td>{d ? `${d[6]?.toString()}/${d[5]?.toString()}` : '—'}</td>
                    <td>{f ? `${formatMuri(f[0])} MURI` : '—'}</td>
                    <td>
                      {f ? (
                        <span className={`order-status order-status--${f[3] ? 'expired' : 'active'}`}>
                          {f[3] ? 'Expired' : 'Active'}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="node-list__pagination">
              <button className="node-list__page-btn" onClick={prevPage} disabled={!hasPrev}>
                Prev
              </button>
              <span className="node-list__page-info">
                Page {page + 1} of {totalPages}
              </span>
              <button className="node-list__page-btn" onClick={nextPage} disabled={!hasNext}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Main Dashboard ──
function Dashboard() {
  const {
    globalStats: g,
    financialStats: f,
    proofStats: p,
    slotInfo,
    recentOrders,
    slashStats,
    blockNumber,
    isLoading,
    isError,
  } = useDashboardData()

  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading__spinner" />
        <span>Connecting to MuriData network...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="dashboard-error">
        <span className="dashboard-error__icon">!</span>
        <span>Unable to connect to the network. Check your RPC connection.</span>
      </div>
    )
  }

  // Capacity utilization percentage
  const capacityPct = g && g[4] > 0n
    ? ((Number(g[5]) / Number(g[4])) * 100).toFixed(1)
    : '0'

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Network Dashboard</h1>
          <p className="dashboard-subtitle">MuriData Testnet — live on-chain data</p>
        </div>
        <div className="dashboard-header__block">
          <span className="dashboard-header__dot" />
          Block {blockNumber?.toLocaleString() ?? '—'}
          {g ? ` / Period ${g[7].toString()}` : ''}
        </div>
      </div>

      {/* Stats banner */}
      <div className="dashboard-stats">
        <StatCard
          label="Total Orders"
          value={g ? g[0].toString() : undefined}
          sub={g ? `${g[1].toString()} active` : undefined}
        />
        <StatCard
          label="Active Nodes"
          value={g ? g[3].toString() : undefined}
        />
        <StatCard
          label="Capacity Used"
          value={g ? `${capacityPct}%` : undefined}
          sub={g ? `${formatChunks(g[5])} / ${formatChunks(g[4])}` : undefined}
          highlight
        />
        <StatCard
          label="Escrow Locked"
          value={g ? `${formatMuri(g[2])} MURI` : undefined}
        />
        <StatCard
          label="Rewards Paid"
          value={f ? `${formatMuri(f[2])} MURI` : undefined}
        />
        <StatCard
          label="Challenge Slots"
          value={g ? `${g[6].toString()} active` : undefined}
          sub={g ? `${g[9].toString()} orders eligible` : undefined}
        />
      </div>

      {/* Connected wallet node panel */}
      <div className="dashboard-node-section">
        <NodePanel />
      </div>

      {/* Middle panels */}
      <div className="dashboard-panels">
        {/* Financial panel */}
        <div className="dashboard-panel">
          <h2 className="dashboard-panel__title">
            <span className="dashboard-panel__title-icon"><IconChart /></span>
            Financial Overview
          </h2>
          <PanelRow label="Contract Balance" value={f ? `${formatMuri(f[0])} MURI` : undefined} />
          <PanelRow label="Escrow Held" value={f ? `${formatMuri(f[1])} MURI` : undefined} />
          <PanelRow label="Total Rewards Paid" value={f ? `${formatMuri(f[2])} MURI` : undefined} />
          <PanelRow label="Avg Order Value" value={f ? `${formatMuri(f[3])} MURI` : undefined} />
          <PanelRow label="Total Stake Value" value={f ? `${formatMuri(f[4])} MURI` : undefined} />
        </div>

        {/* Proof system panel */}
        <div className="dashboard-panel">
          <h2 className="dashboard-panel__title">
            <span className="dashboard-panel__title-icon"><IconShield /></span>
            Proof System
          </h2>
          <PanelRow label="Active Slots" value={p ? p[0].toString() : undefined} />
          <PanelRow label="Idle Slots" value={p ? p[1].toString() : undefined} />
          <PanelRow label="Expired Slots" value={p ? p[2].toString() : undefined} />
          <PanelRow label="Total Slots" value={p ? p[6].toString() : undefined} />
          <PanelRow label="Challenge Window" value={p ? `${p[4].toString()} blocks` : undefined} />
          <PanelRow label="Challengeable Orders" value={p ? p[5].toString() : undefined} />
        </div>
      </div>

      {/* Challenge Slots */}
      <div className="dashboard-slots-section">
        <div className="dashboard-panel">
          <h2 className="dashboard-panel__title">
            <span className="dashboard-panel__title-icon"><IconGrid /></span>
            Challenge Slots
          </h2>
          {slotInfo ? (
            <div className="slots-grid">
              {slotInfo[0].map((_, i) => (
                <SlotCard
                  key={i}
                  index={i}
                  orderId={slotInfo[0][i]}
                  node={slotInfo[1][i]}
                  deadlineBlock={slotInfo[3][i]}
                  expired={slotInfo[4][i]}
                  currentBlock={blockNumber}
                />
              ))}
            </div>
          ) : (
            <p className="dashboard-empty">No challenge slots initialized</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-orders-section">
        <div className="dashboard-panel">
          <h2 className="dashboard-panel__title">
            <span className="dashboard-panel__title-icon"><IconList /></span>
            Recent Orders
          </h2>
          {recentOrders && recentOrders[0].length > 0 ? (
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Owner</th>
                    <th>Size</th>
                    <th>Periods</th>
                    <th>Replicas</th>
                    <th>Escrow</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders[0].map((id, i) => (
                    <tr
                      key={id.toString()}
                      className="orders-table__row--clickable"
                      onClick={() => navigate(`/dashboard/order/${id.toString()}`)}
                    >
                      <td>
                        <Link to={`/dashboard/order/${id.toString()}`} className="explorer-link">
                          #{id.toString()}
                        </Link>
                      </td>
                      <td>{truncateAddress(recentOrders[1][i])}</td>
                      <td>{formatChunks(recentOrders[2][i])}</td>
                      <td>{recentOrders[3][i].toString()}</td>
                      <td>
                        {recentOrders[5][i].toString()}/{recentOrders[4][i].toString()}
                      </td>
                      <td>{formatMuri(recentOrders[6][i])} MURI</td>
                      <td>
                        <span className={`order-status order-status--${recentOrders[7][i] ? 'active' : 'expired'}`}>
                          {recentOrders[7][i] ? 'Active' : 'Expired'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="dashboard-empty">No orders placed yet</p>
          )}
        </div>
      </div>

      {/* Order Browser (paginated active/challengeable) */}
      <div className="dashboard-orders-section">
        <OrderBrowser navigate={navigate} />
      </div>

      {/* Slash Stats */}
      <div className="dashboard-slash-section">
        <div className="dashboard-panel">
          <h2 className="dashboard-panel__title">
            <span className="dashboard-panel__title-icon"><IconSlash /></span>
            Slash Redistribution
          </h2>
          {slashStats ? (
            <>
              <PanelRow label="Total Slashed Received" value={`${formatMuri(slashStats[0])} MURI`} />
              <PanelRow label="Total Burned" value={`${formatMuri(slashStats[1])} MURI`} />
              <PanelRow label="Reporter Rewards" value={`${formatMuri(slashStats[2])} MURI`} />
              <PanelRow label="Client Compensation" value={`${formatMuri(slashStats[4])} MURI`} />
              <PanelRow label="Reporter Reward Rate" value={`${Number(slashStats[3]) / 100}%`} />
            </>
          ) : (
            <p className="dashboard-empty">No slash data available</p>
          )}
        </div>
      </div>

      {/* Node List Table */}
      <div className="dashboard-nodelist-section">
        <NodeListTable />
      </div>

    </div>
  )
}

export default Dashboard
