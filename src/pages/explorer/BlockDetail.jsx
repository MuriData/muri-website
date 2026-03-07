import { useParams, Link } from 'react-router-dom'
import '../Explorer.css'
import {
  useTransactions,
  truncAddr,
  truncHash,
} from '../../hooks/useExplorerData'
import { FILE_MARKET_ADDRESS, NODE_STAKING_ADDRESS } from '../../lib/contracts'

const KNOWN_ADDRESSES = {
  [FILE_MARKET_ADDRESS.toLowerCase()]: 'FileMarket',
  [NODE_STAKING_ADDRESS.toLowerCase()]: 'NodeStaking',
  ['0xca11bde05977b3631167028862be2a173976ca11']: 'Multicall3',
}

const KNOWN_SELECTORS = {
  '0x789ec3bb': 'placeOrder',
  '0x94f61134': 'executeOrder',
  '0xf25eb35a': 'submitProof',
  '0x514fcac7': 'cancelOrder',
  '0x4ee7de66': 'completeExpiredOrder',
  '0xdd203e8d': 'quitOrder',
  '0x372500ab': 'claimRewards',
  '0xdbbbe766': 'processExpiredSlots',
  '0x53e3c7a1': 'activateSlots',
  '0x780a7750': 'stakeNode',
  '0x95d426ad': 'unstakeNode',
  '0xbb34a381': 'increaseCapacity',
  '0xc90cbfbe': 'decreaseCapacity',
  '0x485cc955': 'initialize',
  '0x82ad56cb': 'aggregate3',
}

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
          <p className="explorer-subtitle">{isLoading ? 'Loading...' : `${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}</p>
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
                        <td className="explorer-mono">{truncHash(tx.hash)}</td>
                        <td>
                          <span className={`explorer-method${isKnownMethod ? ' explorer-method--known' : ''}`}>
                            {method}
                          </span>
                        </td>
                        <td className="explorer-mono">{truncAddr(tx.from)}</td>
                        <td>
                          {isCreate ? (
                            <span className="explorer-badge explorer-badge--create">Contract Created</span>
                          ) : toLabel ? (
                            <span className="explorer-badge explorer-badge--contract">{toLabel}</span>
                          ) : (
                            <span className="explorer-mono">{truncAddr(tx.to)}</span>
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
