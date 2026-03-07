import { useNodeList } from '../../hooks/useNodeList'
import { formatMuri, formatChunks, truncateAddress } from '../../hooks/useDashboardData'
import './NodeListTable.css'

function IconNodes() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="5" r="3" /><circle cx="5" cy="15" r="3" /><circle cx="15" cy="15" r="3" />
      <path d="M10 8v2M7.5 13 9 10M12.5 13 11 10" />
    </svg>
  )
}

function NodeListTable() {
  const {
    nodes,
    page,
    totalPages,
    totalNodes,
    isLoading,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  } = useNodeList()

  return (
    <div className="dashboard-panel">
      <h2 className="dashboard-panel__title">
        <span className="dashboard-panel__title-icon"><IconNodes /></span>
        Network Nodes
        <span className="node-list__count">{totalNodes}</span>
      </h2>

      {isLoading ? (
        <p className="dashboard-empty">Loading node list...</p>
      ) : nodes.length === 0 ? (
        <p className="dashboard-empty">No registered nodes</p>
      ) : (
        <>
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Stake</th>
                  <th>Capacity</th>
                  <th>Used</th>
                  <th>Utilization</th>
                  <th>Total Earned</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map(({ address, nodeInfo, earnings }) => {
                  const utilPct = nodeInfo && nodeInfo[1] > 0n
                    ? ((Number(nodeInfo[2]) / Number(nodeInfo[1])) * 100).toFixed(1)
                    : '0'
                  return (
                    <tr key={address}>
                      <td>{truncateAddress(address)}</td>
                      <td>{nodeInfo ? `${formatMuri(nodeInfo[0])} MURI` : '—'}</td>
                      <td>{nodeInfo ? formatChunks(nodeInfo[1]) : '—'}</td>
                      <td>{nodeInfo ? formatChunks(nodeInfo[2]) : '—'}</td>
                      <td>
                        <div className="node-list__util-bar">
                          <div
                            className="node-list__util-fill"
                            style={{ width: `${Math.min(100, parseFloat(utilPct))}%` }}
                          />
                          <span className="node-list__util-text">{utilPct}%</span>
                        </div>
                      </td>
                      <td>{earnings ? `${formatMuri(earnings[0])} MURI` : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="node-list__pagination">
              <button
                className="node-list__page-btn"
                onClick={prevPage}
                disabled={!hasPrev}
              >
                Prev
              </button>
              <span className="node-list__page-info">
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="node-list__page-btn"
                onClick={nextPage}
                disabled={!hasNext}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default NodeListTable
