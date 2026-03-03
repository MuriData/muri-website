import './StatPanel.css'
import Panel from '../Panel/Panel'
import Divider from '../Divider/Divider'

function StatPanel() {
  return (
    <Panel variant="teal" className="stat-panel">
      <div className="stat-meta">
        <span>Uptime</span>
        <span>muri.network</span>
      </div>
      <Divider tight variant="dark" />
      <div className="huge-number">
        <svg className="stat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M7 17L17 7M17 7H7M17 7V17"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="bevel"
          />
        </svg>
        99.9%
      </div>
    </Panel>
  )
}

export default StatPanel
