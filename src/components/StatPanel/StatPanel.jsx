import { useReadContracts } from 'wagmi'
import { FILE_MARKET_ADDRESS, FILE_MARKET_ABI } from '../../lib/contracts'
import { formatMuri, formatChunks } from '../../hooks/useDashboardData'
import './StatPanel.css'
import Panel from '../Panel/Panel'
import Divider from '../Divider/Divider'

const marketContract = { address: FILE_MARKET_ADDRESS, abi: FILE_MARKET_ABI }

function StatPanel() {
  const { data } = useReadContracts({
    contracts: [{ ...marketContract, functionName: 'getGlobalStats' }],
    query: { refetchInterval: 30_000, staleTime: 30_000 },
  })

  const g = data?.[0]?.status === 'success' ? data[0].result : undefined

  const stats = [
    { label: 'Active Nodes', value: g ? g[3].toString() : '—' },
    { label: 'Total Orders', value: g ? g[0].toString() : '—' },
    { label: 'Escrow Locked', value: g ? <>{formatMuri(g[2])} <span className="stat-unit">MURI</span></> : '—' },
  ]

  return (
    <Panel variant="teal" className="stat-panel">
      <div className="stat-meta">
        <span>Network Stats</span>
        <span>muri.network</span>
      </div>
      <Divider tight variant="dark" />
      <div className="stat-grid">
        {stats.map((stat) => (
          <div className="stat-item" key={stat.label}>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export default StatPanel
