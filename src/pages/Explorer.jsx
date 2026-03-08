import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Explorer.css'
import {
  useBlocks,
  useRecentTransactions,
  useValidators,
  truncAddr,
  truncHash,
  timeAgo,
  formatGwei,
} from '../hooks/useExplorerData'
import { FILE_MARKET_ADDRESS, NODE_STAKING_ADDRESS } from '../lib/contracts'

const BLOCKSCOUT = 'https://testnet-explorer.muri.moe'

// ── Known addresses & selectors ──
const KNOWN_ADDRESSES = {
  [FILE_MARKET_ADDRESS.toLowerCase()]: 'FileMarket',
  [NODE_STAKING_ADDRESS.toLowerCase()]: 'NodeStaking',
  ['0xca11bde05977b3631167028862be2a173976ca11']: 'Multicall3',
}

const KNOWN_SELECTORS = {
  '0x678d66a9': 'placeOrder',
  '0xa1a870d9': 'executeOrder',
  '0xe68f31e3': 'submitProof',
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

// ── Tab type ──
const TABS = ['blocks', 'transactions', 'validators']

// ── Icons ──
function IconCube() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2 L17 6 V14 L10 18 L3 14 V6 Z" />
      <path d="M10 18 V10" /><path d="M17 6 L10 10 L3 6" />
    </svg>
  )
}

function IconTx() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12M12 6l4 4-4 4" />
    </svg>
  )
}

function IconValidator() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="7" r="3" /><path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" />
      <path d="M14 4l1 1.5L14 7" /><path d="M16.5 5.5h-2.5" />
    </svg>
  )
}

// ── Main Explorer ──
function Explorer() {
  const [activeTab, setActiveTab] = useState('blocks')

  const navigate = useNavigate()
  const { blocks, latestBlockNumber, isLoading: blocksLoading } = useBlocks()
  const { transactions: recentTxs, isLoading: txsLoading } = useRecentTransactions(blocks)
  const { validators, isLoading: valsLoading, error: valsError } = useValidators()

  if (blocksLoading && blocks.length === 0) {
    return (
      <div className="explorer-loading">
        <div className="explorer-loading__spinner" />
        <span>Connecting to MuriData network...</span>
      </div>
    )
  }

  const avgBlockTime = blocks.length >= 2
    ? ((blocks[0].timestamp - blocks[blocks.length - 1].timestamp) / (blocks.length - 1)).toFixed(1)
    : '—'

  const totalTxsInView = blocks.reduce((sum, b) => sum + b.txCount, 0)

  return (
    <div className="explorer">
      {/* Header */}
      <div className="explorer-header">
        <div>
          <h1 className="explorer-title">Block Explorer</h1>
          <p className="explorer-subtitle">
            MuriData Testnet — chain 44946
            <a href={BLOCKSCOUT} target="_blank" rel="noopener noreferrer" className="explorer-blockscout-link">
              View on Blockscout ↗
            </a>
          </p>
        </div>
        <div className="explorer-header__stats">
          <div className="explorer-header__stat">
            <span className="explorer-header__dot" />
            Block {latestBlockNumber?.toLocaleString() ?? '—'}
          </div>
          <div className="explorer-header__stat">
            ~{avgBlockTime}s block time
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="explorer-quick-stats">
        <div className="explorer-qstat">
          <span className="explorer-qstat__label">Latest Block</span>
          <span className="explorer-qstat__value">{latestBlockNumber?.toLocaleString() ?? '—'}</span>
        </div>
        <div className="explorer-qstat">
          <span className="explorer-qstat__label">Avg Block Time</span>
          <span className="explorer-qstat__value">{avgBlockTime}s</span>
        </div>
        <div className="explorer-qstat">
          <span className="explorer-qstat__label">Recent Txs</span>
          <span className="explorer-qstat__value">{totalTxsInView}</span>
        </div>
        <div className="explorer-qstat">
          <span className="explorer-qstat__label">Validators</span>
          <span className="explorer-qstat__value">{valsLoading ? '...' : validators.length}</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="explorer-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`explorer-tab${activeTab === tab ? ' explorer-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'blocks' && <IconCube />}
            {tab === 'transactions' && <IconTx />}
            {tab === 'validators' && <IconValidator />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="explorer-content">
        {activeTab === 'blocks' && (
          <div className="explorer-panel">
            {/* Desktop table */}
            <div className="explorer-table-wrap explorer-desktop">
              <table className="explorer-table">
                <thead>
                  <tr>
                    <th>Block</th>
                    <th>Age</th>
                    <th>Txs</th>
                    <th>Gas Used</th>
                    <th>Gas %</th>
                    <th>Size</th>
                    <th>Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((b) => {
                    const gasPct = b.gasLimit > 0n
                      ? (Number(b.gasUsed) / Number(b.gasLimit) * 100).toFixed(1)
                      : '0'
                    return (
                      <tr key={b.number} className="explorer-row--clickable" onClick={() => navigate(`/explorer/block/${b.number}`)}>
                        <td className="explorer-block-num">
                          <Link to={`/explorer/block/${b.number}`}>#{b.number.toLocaleString()}</Link>
                        </td>
                        <td>{timeAgo(b.timestamp)}</td>
                        <td>
                          {b.txCount > 0 ? (
                            <span className="explorer-badge explorer-badge--tx">{b.txCount}</span>
                          ) : (
                            <span className="explorer-badge explorer-badge--empty">0</span>
                          )}
                        </td>
                        <td>{Number(b.gasUsed).toLocaleString()}</td>
                        <td>
                          <div className="explorer-gas-bar">
                            <div className="explorer-gas-bar__track">
                              <div className="explorer-gas-bar__fill" style={{ width: `${Math.min(gasPct, 100)}%` }} />
                            </div>
                            <span>{gasPct}%</span>
                          </div>
                        </td>
                        <td>{b.size != null ? `${Number(b.size).toLocaleString()} B` : '—'}</td>
                        <td className="explorer-mono">
                          <a href={`${BLOCKSCOUT}/block/${b.number}`} target="_blank" rel="noopener noreferrer" className="explorer-ext-link">{truncHash(b.hash)}</a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="explorer-cards explorer-mobile">
              {blocks.map((b) => {
                const gasPct = b.gasLimit > 0n
                  ? (Number(b.gasUsed) / Number(b.gasLimit) * 100).toFixed(1)
                  : '0'
                return (
                  <Link to={`/explorer/block/${b.number}`} key={b.number} className="explorer-card">
                    <div className="explorer-card__head">
                      <span className="explorer-block-num">#{b.number.toLocaleString()}</span>
                      <span className="explorer-card__age">{timeAgo(b.timestamp)}</span>
                    </div>
                    <div className="explorer-card__rows">
                      <div className="explorer-card__row">
                        <span>Txs</span>
                        <span>{b.txCount > 0 ? <span className="explorer-badge explorer-badge--tx">{b.txCount}</span> : '0'}</span>
                      </div>
                      <div className="explorer-card__row">
                        <span>Gas</span>
                        <span>{Number(b.gasUsed).toLocaleString()} ({gasPct}%)</span>
                      </div>
                      <div className="explorer-card__row">
                        <span>Size</span>
                        <span>{b.size != null ? `${Number(b.size).toLocaleString()} B` : '—'}</span>
                      </div>
                    </div>
                    <div className="explorer-card__hash explorer-mono">{truncHash(b.hash)}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="explorer-panel">
            {txsLoading ? (
              <div className="explorer-loading"><div className="explorer-loading__spinner" /></div>
            ) : recentTxs.length === 0 ? (
              <p className="explorer-empty">No recent transactions found</p>
            ) : (
              <>
                {/* Desktop table */}
                <div className="explorer-table-wrap explorer-desktop">
                  <table className="explorer-table">
                    <thead>
                      <tr>
                        <th>Tx Hash</th>
                        <th>Method</th>
                        <th>Block</th>
                        <th>Age</th>
                        <th>From</th>
                        <th>Interacted With</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTxs.map((tx) => {
                        const toLabel = labelAddress(tx.to)
                        const isCreate = !tx.to
                        const method = isCreate ? 'Deploy' : decodeMethod(tx.input)
                        const isKnownMethod = !method.startsWith('0x')
                        return (
                          <tr key={tx.hash}>
                            <td className="explorer-mono">
                              <a href={`${BLOCKSCOUT}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="explorer-ext-link">{truncHash(tx.hash)}</a>
                            </td>
                            <td>
                              <span className={`explorer-method${isKnownMethod ? ' explorer-method--known' : ''}`}>
                                {method}
                              </span>
                            </td>
                            <td>
                              <Link to={`/explorer/block/${tx.blockNumber}`} className="explorer-link">
                                #{tx.blockNumber.toLocaleString()}
                              </Link>
                            </td>
                            <td>{timeAgo(tx.timestamp)}</td>
                            <td className="explorer-mono">
                              <a href={`${BLOCKSCOUT}/address/${tx.from}`} target="_blank" rel="noopener noreferrer" className="explorer-ext-link">{truncAddr(tx.from)}</a>
                            </td>
                            <td>
                              {isCreate ? (
                                <span className="explorer-badge explorer-badge--create">Deploy</span>
                              ) : toLabel ? (
                                <a href={`${BLOCKSCOUT}/address/${tx.to}`} target="_blank" rel="noopener noreferrer" className="explorer-ext-link">
                                  <span className="explorer-badge explorer-badge--contract">{toLabel}</span>
                                </a>
                              ) : (
                                <a href={`${BLOCKSCOUT}/address/${tx.to}`} target="_blank" rel="noopener noreferrer" className="explorer-ext-link explorer-mono">{truncAddr(tx.to)}</a>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Mobile cards */}
                <div className="explorer-cards explorer-mobile">
                  {recentTxs.map((tx) => {
                    const toLabel = labelAddress(tx.to)
                    const isCreate = !tx.to
                    const method = isCreate ? 'Deploy' : decodeMethod(tx.input)
                    const isKnownMethod = !method.startsWith('0x')
                    return (
                      <div key={tx.hash} className="explorer-card">
                        <div className="explorer-card__head">
                          <span className="explorer-mono" style={{ fontSize: '0.75rem' }}>{truncHash(tx.hash)}</span>
                          <span className="explorer-card__age">{timeAgo(tx.timestamp)}</span>
                        </div>
                        <div className="explorer-card__rows">
                          <div className="explorer-card__row">
                            <span>Method</span>
                            <span className={`explorer-method${isKnownMethod ? ' explorer-method--known' : ''}`}>{method}</span>
                          </div>
                          <div className="explorer-card__row">
                            <span>Block</span>
                            <Link to={`/explorer/block/${tx.blockNumber}`} className="explorer-link">#{tx.blockNumber.toLocaleString()}</Link>
                          </div>
                          <div className="explorer-card__row">
                            <span>From</span>
                            <span className="explorer-mono">{truncAddr(tx.from)}</span>
                          </div>
                          <div className="explorer-card__row">
                            <span>To</span>
                            <span>
                              {isCreate ? (
                                <span className="explorer-badge explorer-badge--create">Deploy</span>
                              ) : toLabel ? (
                                <span className="explorer-badge explorer-badge--contract">{toLabel}</span>
                              ) : (
                                <span className="explorer-mono">{truncAddr(tx.to)}</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'validators' && (
          <div className="explorer-panel">
            {valsLoading ? (
              <div className="explorer-loading"><div className="explorer-loading__spinner" /></div>
            ) : valsError ? (
              <p className="explorer-empty">Unable to fetch validators: {valsError}</p>
            ) : validators.length === 0 ? (
              <p className="explorer-empty">No validators found for this subnet</p>
            ) : (
              <>
                {/* Desktop table */}
                <div className="explorer-table-wrap explorer-desktop">
                  <table className="explorer-table">
                    <thead>
                      <tr>
                        <th>Node ID</th>
                        <th>Weight</th>
                        <th>Balance</th>
                        <th>Validation ID</th>
                        <th>Start</th>
                        <th>BLS Public Key</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validators.map((v) => (
                        <tr key={v.nodeID}>
                          <td className="explorer-mono">{v.nodeID.length > 24 ? `${v.nodeID.slice(0, 16)}...${v.nodeID.slice(-8)}` : v.nodeID}</td>
                          <td>
                            <span className="explorer-badge explorer-badge--tx">{v.weight}</span>
                          </td>
                          <td>{(Number(v.balance) / 1e9).toLocaleString(undefined, { maximumFractionDigits: 4 })} AVAX</td>
                          <td className="explorer-mono">{v.validationID ? `${v.validationID.slice(0, 12)}...${v.validationID.slice(-6)}` : '—'}</td>
                          <td>{new Date(v.startTime * 1000).toLocaleDateString()}</td>
                          <td className="explorer-mono">{v.publicKey ? `${v.publicKey.slice(0, 14)}...${v.publicKey.slice(-8)}` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile cards */}
                <div className="explorer-cards explorer-mobile">
                  {validators.map((v) => (
                    <div key={v.nodeID} className="explorer-card">
                      <div className="explorer-card__head">
                        <span className="explorer-mono" style={{ fontSize: '0.7rem' }}>
                          {v.nodeID.length > 20 ? `${v.nodeID.slice(0, 14)}...${v.nodeID.slice(-6)}` : v.nodeID}
                        </span>
                        <span className="explorer-badge explorer-badge--tx">{v.weight}</span>
                      </div>
                      <div className="explorer-card__rows">
                        <div className="explorer-card__row">
                          <span>Balance</span>
                          <span>{(Number(v.balance) / 1e9).toLocaleString(undefined, { maximumFractionDigits: 4 })} AVAX</span>
                        </div>
                        <div className="explorer-card__row">
                          <span>Start</span>
                          <span>{new Date(v.startTime * 1000).toLocaleDateString()}</span>
                        </div>
                        <div className="explorer-card__row">
                          <span>Validation ID</span>
                          <span className="explorer-mono" style={{ fontSize: '0.7rem' }}>{v.validationID ? `${v.validationID.slice(0, 10)}...${v.validationID.slice(-4)}` : '—'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Explorer
