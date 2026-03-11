import { useState } from 'react'
import { useNodePanel } from '../../hooks/useNodePanel'
import { formatMuri, formatChunks, truncateAddress } from '../../hooks/useDashboardData'
import { useClaimRewards, useClaimReporterRewards, useUnstakeNode } from '../../hooks/useNodeActions'
import CapacityForm from './CapacityForm'
import NodeOrdersTable from './NodeOrdersTable'
import NodeStakeForm from './NodeStakeForm'
import './NodePanel.css'
import '../../pages/Console.css'

function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    reporterInfo,
  } = useNodePanel()

  const claimRewards = useClaimRewards()
  const claimReporter = useClaimReporterRewards()
  const unstakeNode = useUnstakeNode()
  const [confirmUnstake, setConfirmUnstake] = useState(false)

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

  // Not a node → show registration form
  if (!isNode) {
    return <NodeStakeForm />
  }

  const utilPct = nodeInfo && nodeInfo[1] > 0n
    ? ((Number(nodeInfo[2]) / Number(nodeInfo[1])) * 100).toFixed(1)
    : '0'

  const hasClaimable = claimableRewards != null && claimableRewards > 0n
  const hasReporterPending = reporterInfo && reporterInfo[2] > 0n
  const canUnstake = nodeInfo && nodeInfo[2] === 0n // used == 0

  return (
    <div className="node-panel">
      <h2 className="dashboard-panel__title">
        <span className="dashboard-panel__title-icon"><IconUser /></span>
        Your Node
      </h2>

      {/* Utilization gauge */}
      {nodeInfo && (
        <div className="node-panel__gauge">
          <div className="node-panel__gauge-bar">
            <div
              className="node-panel__gauge-fill"
              style={{ width: `${Math.min(Number(utilPct), 100)}%` }}
            />
          </div>
          <span className="node-panel__gauge-label">{utilPct}% utilized</span>
        </div>
      )}

      {/* Identity rows — full width */}
      <div className="node-panel__identity">
        <div className="node-panel__row">
          <span className="node-panel__label">Address</span>
          <span className="node-panel__value node-panel__value--mono" title={address}>
            {truncateAddress(address)}
          </span>
        </div>
        <div className="node-panel__row">
          <span className="node-panel__label">Public Key</span>
          <span className="node-panel__value node-panel__value--mono" title={nodeInfo && nodeInfo[3] ? '0x' + nodeInfo[3].toString(16) : ''}>
            {nodeInfo && nodeInfo[3] ? truncateAddress('0x' + nodeInfo[3].toString(16)) : '—'}
          </span>
        </div>
      </div>

      {/* Stats grid — two columns */}
      <div className="node-panel__grid">
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

      {/* Action buttons */}
      <div className="node-panel__actions">
        {/* Claim Rewards */}
        {hasClaimable && (
          <button
            className="console-btn console-btn--primary console-btn--small"
            onClick={claimRewards.claim}
            disabled={claimRewards.isPending || claimRewards.isConfirming}
          >
            {claimRewards.isPending || claimRewards.isConfirming
              ? 'Claiming...'
              : `Claim ${formatMuri(claimableRewards)} MURI`}
          </button>
        )}

        {claimRewards.isSuccess && (
          <div className="tx-status tx-status--success" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>Rewards claimed</div>
        )}
        {claimRewards.error && (
          <div className="tx-status tx-status--error" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
            {claimRewards.error.shortMessage || 'Claim failed'}
          </div>
        )}

        {/* Capacity management */}
        <CapacityForm nodeInfo={nodeInfo} />

        {/* Unstake — with confirmation dialog */}
        {canUnstake && !confirmUnstake && (
          <button
            className="console-btn console-btn--danger console-btn--small"
            onClick={() => setConfirmUnstake(true)}
          >
            Unstake Node
          </button>
        )}
        {canUnstake && confirmUnstake && !unstakeNode.isSuccess && (
          <div className="confirm-dialog">
            <p className="confirm-dialog__text">
              Are you sure you want to unstake? Your node will be removed from the network and your stake will be returned.
            </p>
            <div className="confirm-dialog__actions">
              <button
                className="console-btn console-btn--danger console-btn--small"
                onClick={() => { unstakeNode.unstake(); setConfirmUnstake(false) }}
                disabled={unstakeNode.isPending || unstakeNode.isConfirming}
              >
                {unstakeNode.isPending || unstakeNode.isConfirming ? 'Unstaking...' : 'Confirm Unstake'}
              </button>
              <button
                className="console-btn console-btn--secondary console-btn--small"
                onClick={() => setConfirmUnstake(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {unstakeNode.isSuccess && (
          <div className="tx-status tx-status--success" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>Unstaked</div>
        )}
        {unstakeNode.error && (
          <div className="tx-status tx-status--error" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
            {unstakeNode.error.shortMessage || 'Unstake failed'}
          </div>
        )}
      </div>

      {/* Reporter earnings */}
      {reporterInfo && (reporterInfo[0] > 0n || reporterInfo[2] > 0n) && (
        <div className="node-panel__reporter">
          <span className="node-panel__label">Reporter Earnings</span>
          <div className="node-panel__grid" style={{ marginTop: '6px' }}>
            <div className="node-panel__row">
              <span className="node-panel__label">Total Earned</span>
              <span className="node-panel__value">{formatMuri(reporterInfo[0])} MURI</span>
            </div>
            <div className="node-panel__row">
              <span className="node-panel__label">Withdrawn</span>
              <span className="node-panel__value">{formatMuri(reporterInfo[1])} MURI</span>
            </div>
            <div className="node-panel__row">
              <span className="node-panel__label">Pending</span>
              <span className="node-panel__value node-panel__value--highlight">{formatMuri(reporterInfo[2])} MURI</span>
            </div>
          </div>
          {hasReporterPending && (
            <button
              className="console-btn console-btn--secondary console-btn--small"
              onClick={claimReporter.claim}
              disabled={claimReporter.isPending || claimReporter.isConfirming}
              style={{ marginTop: 8 }}
            >
              {claimReporter.isPending || claimReporter.isConfirming
                ? 'Claiming...'
                : `Claim ${formatMuri(reporterInfo[2])} MURI`}
            </button>
          )}
          {claimReporter.isSuccess && (
            <div className="tx-status tx-status--success" style={{ marginTop: 6, fontSize: '0.7rem', padding: '4px 8px' }}>Reporter rewards claimed</div>
          )}
        </div>
      )}

      {/* Assigned orders table with quit actions */}
      <NodeOrdersTable nodeOrders={nodeOrders} address={address} />
    </div>
  )
}

export default NodePanel
