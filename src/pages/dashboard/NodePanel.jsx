import { useNodePanel } from '../../hooks/useNodePanel'
import { formatMuri, formatChunks } from '../../hooks/useDashboardData'
import './NodePanel.css'

function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="7" r="4" /><path d="M3 18 C3 14 7 12 10 12 C13 12 17 14 17 18" />
    </svg>
  )
}

function NodePanel() {
  const {
    isConnected,
    isNode,
    isLoading,
    address,
    nodeInfo,
    earningsInfo,
    activeChallenges,
    nodeOrders,
    claimableRewards,
    maxSlashable,
  } = useNodePanel()

  if (!isConnected) {
    return (
      <div className="node-panel node-panel--hint">
        <p className="node-panel__hint">Connect wallet to view your node stats</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="node-panel">
        <div className="node-panel__loading">Loading node data...</div>
      </div>
    )
  }

  if (!isNode) return null

  const utilPct = nodeInfo && nodeInfo[1] > 0n
    ? ((Number(nodeInfo[2]) / Number(nodeInfo[1])) * 100).toFixed(1)
    : '0'

  return (
    <div className="node-panel">
      <h2 className="dashboard-panel__title">
        <span className="dashboard-panel__title-icon"><IconUser /></span>
        Your Node
      </h2>
      <div className="node-panel__grid">
        <div className="node-panel__row">
          <span className="node-panel__label">Address</span>
          <span className="node-panel__value node-panel__value--mono">{address}</span>
        </div>
        <div className="node-panel__row">
          <span className="node-panel__label">Stake</span>
          <span className="node-panel__value">{nodeInfo ? `${formatMuri(nodeInfo[0])} MURI` : '—'}</span>
        </div>
        <div className="node-panel__row">
          <span className="node-panel__label">Capacity</span>
          <span className="node-panel__value">{nodeInfo ? formatChunks(nodeInfo[1]) : '—'}</span>
        </div>
        <div className="node-panel__row">
          <span className="node-panel__label">Used</span>
          <span className="node-panel__value">{nodeInfo ? `${formatChunks(nodeInfo[2])} (${utilPct}%)` : '—'}</span>
        </div>
        <div className="node-panel__row">
          <span className="node-panel__label">Total Earned</span>
          <span className="node-panel__value">{earningsInfo ? `${formatMuri(earningsInfo[0])} MURI` : '—'}</span>
        </div>
        <div className="node-panel__row">
          <span className="node-panel__label">Claimable</span>
          <span className="node-panel__value node-panel__value--highlight">
            {claimableRewards != null ? `${formatMuri(claimableRewards)} MURI` : '—'}
          </span>
        </div>
        <div className="node-panel__row">
          <span className="node-panel__label">Active Challenges</span>
          <span className="node-panel__value">{activeChallenges != null ? activeChallenges.toString() : '—'}</span>
        </div>
        <div className="node-panel__row">
          <span className="node-panel__label">Max Slashable</span>
          <span className="node-panel__value">{maxSlashable != null ? `${formatMuri(maxSlashable)} MURI` : '—'}</span>
        </div>
      </div>
      {nodeOrders && nodeOrders.length > 0 && (
        <div className="node-panel__orders">
          <span className="node-panel__label">Assigned Orders</span>
          <div className="node-panel__pills">
            {nodeOrders.map((id) => (
              <span key={id.toString()} className="node-panel__pill">#{id.toString()}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NodePanel
