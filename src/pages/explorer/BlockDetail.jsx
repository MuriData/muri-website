import { useParams, Link } from 'react-router-dom'
import '../Explorer.css'
import {
  useTransactions,
  truncAddr,
  truncHash,
} from '../../hooks/useExplorerData'
import { BLOCKSCOUT_URL, KNOWN_ADDRESSES, KNOWN_SELECTORS } from '../../lib/config'

function labelAddress(addr) {
  if (!addr) return null
  return KNOWN_ADDRESSES[addr.toLowerCase()] || null
}

function decodeMethod(input) {
  if (!input || input === '0x') return 'Transfer'
  const sel = input.slice(0, 10).toLowerCase()
  return KNOWN_SELECTORS[sel] || sel
}

function BlockDetail() {
  const { blockNumber } = useParams()
  const num = Number(blockNumber)
  const { transactions, isLoading } = useTransactions(num)

  return (
    <div className="explorer">
      <div className="explorer-header">
        <div>
          <Link to="/explorer" className="explorer-back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
            Back to explorer
          </Link>
          <h1 className="explorer-title">Block #{num.toLocaleString()}</h1>
          <p className="explorer-subtitle">
            {isLoading ? 'Loading...' : `${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}
            <a href={`${BLOCKSCOUT_URL}/block/${num}`} target="_blank" rel="noopener noreferrer" className="explorer-blockscout-link">
              View on Blockscout ↗
            </a>
          </p>
        </div>
      </div>
      <div className="explorer-content">
        {isLoading ? (
          <div className="explorer-loading"><div className="explorer-loading__spinner" /></div>
        ) : transactions.length === 0 ? (
          <p className="explorer-empty">No transactions in this block</p>
        ) : (
          <div className="explorer-panel">
            <div className="explorer-table-wrap">
              <table className="explorer-table">
                <thead>
                  <tr>
                    <th>Tx Hash</th>
                    <th>Method</th>
                    <th>From</th>
                    <th>Interacted With</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const toLabel = labelAddress(tx.to)
                    const isCreate = !tx.to
                    const method = isCreate ? 'Deploy' : decodeMethod(tx.input)
                    const isKnownMethod = !method.startsWith('0x')
                    return (
                      <tr key={tx.hash}>
                        <td className="explorer-mono">
                          <a href={`${BLOCKSCOUT_URL}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="explorer-ext-link">{truncHash(tx.hash)}</a>
                        </td>
                        <td>
                          <span className={`explorer-method${isKnownMethod ? ' explorer-method--known' : ''}`}>
                            {method}
                          </span>
                        </td>
                        <td className="explorer-mono">
                          <a href={`${BLOCKSCOUT_URL}/address/${tx.from}`} target="_blank" rel="noopener noreferrer" className="explorer-ext-link">{truncAddr(tx.from)}</a>
                        </td>
                        <td>
                          {isCreate ? (
                            <span className="explorer-badge explorer-badge--create">Contract Created</span>
                          ) : toLabel ? (
                            <a href={`${BLOCKSCOUT_URL}/address/${tx.to}`} target="_blank" rel="noopener noreferrer" className="explorer-ext-link">
                              <span className="explorer-badge explorer-badge--contract">{toLabel}</span>
                            </a>
                          ) : (
                            <a href={`${BLOCKSCOUT_URL}/address/${tx.to}`} target="_blank" rel="noopener noreferrer" className="explorer-ext-link explorer-mono">{truncAddr(tx.to)}</a>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlockDetail
