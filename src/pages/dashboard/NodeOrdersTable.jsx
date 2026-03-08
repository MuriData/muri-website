import { useReadContracts } from 'wagmi'
import { useQuitOrder } from '../../hooks/useNodeActions'
import { useState } from 'react'
import { FILE_MARKET_ADDRESS, FILE_MARKET_ABI } from '../../lib/contracts'
import { formatMuri, formatChunks } from '../../hooks/useDashboardData'

const market = { address: FILE_MARKET_ADDRESS, abi: FILE_MARKET_ABI }

function QuitButton({ orderId }) {
  const { quit, isPending, isConfirming, isSuccess } = useQuitOrder()
  const [showConfirm, setShowConfirm] = useState(false)

  if (isSuccess) {
    return <span style={{ color: 'var(--color-bg-teal)', fontSize: '0.75rem', fontWeight: 600 }}>Quit</span>
  }

  if (showConfirm) {
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        <button
          className="console-btn console-btn--danger console-btn--small"
          onClick={() => { quit(orderId); setShowConfirm(false) }}
          disabled={isPending || isConfirming}
          style={{ fontSize: '0.7rem', padding: '2px 8px' }}
        >
          {isPending || isConfirming ? '...' : 'Confirm'}
        </button>
        <button
          className="console-btn console-btn--secondary console-btn--small"
          onClick={() => setShowConfirm(false)}
          style={{ fontSize: '0.7rem', padding: '2px 8px' }}
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      className="console-btn console-btn--danger console-btn--small"
      onClick={() => setShowConfirm(true)}
      style={{ fontSize: '0.7rem', padding: '2px 8px' }}
    >
      Quit
    </button>
  )
}

function NodeOrdersTable({ nodeOrders, address }) {
  const orders = nodeOrders || []
  const hasOrders = orders.length > 0

  // Build contracts array for useReadContracts — always called (rules of hooks)
  const contracts = orders.flatMap((id) => [
    { ...market, functionName: 'getOrderDetails', args: [id] },
    { ...market, functionName: 'getNodeOrderEarnings', args: [address, id] },
  ])

  const { data } = useReadContracts({
    contracts,
    query: {
      enabled: hasOrders,
      refetchInterval: 15_000,
    },
  })

  if (!hasOrders) return null

  return (
    <div style={{ marginTop: 'var(--space-xs)' }}>
      <div style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        color: 'var(--color-text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 6,
        fontFamily: 'var(--font-main)',
      }}>
        Assigned Orders ({orders.length})
      </div>
      <div className="orders-table-wrap">
        <table className="orders-table" style={{ fontSize: '0.8rem' }}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Size</th>
              <th>Periods</th>
              <th>Earned</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((id, i) => {
              const details = data?.[i * 2]?.status === 'success' ? data[i * 2].result : null
              const earnings = data?.[i * 2 + 1]?.status === 'success' ? data[i * 2 + 1].result : null
              return (
                <tr key={id.toString()}>
                  <td>#{id.toString()}</td>
                  <td>{details ? formatChunks(details[3]) : '—'}</td>
                  <td>{details ? details[4].toString() : '—'}</td>
                  <td>{earnings != null ? `${formatMuri(earnings)} MURI` : '—'}</td>
                  <td><QuitButton orderId={id} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default NodeOrdersTable
