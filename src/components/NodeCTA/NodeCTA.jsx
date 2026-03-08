import './NodeCTA.css'
import Panel from '../Panel/Panel'
import Button from '../Button/Button'
import Divider from '../Divider/Divider'
import { Link } from 'react-router-dom'

const specs = [
  { label: 'CPU', value: '2+ cores' },
  { label: 'Memory', value: '4 GB RAM' },
  { label: 'Disk', value: '500 GB+' },
  { label: 'Staking', value: 'Proportional to capacity' },
  { label: 'Rewards', value: 'Periodic MURI payouts' },
  { label: 'Uptime', value: 'Stable connection required' },
  { label: 'Software', value: 'Single Go binary' },
]

function NodeCTA() {
  return (
    <Panel variant="teal" className="node-cta-panel">
      <h3 className="node-cta__heading">Run a Node</h3>
      <Divider tight variant="dark" />
      <p className="node-cta__desc">
        Earn MURI by storing data. No GPUs, no specialized drives — just
        stake, configure, and stay online. A stable network connection is
        essential to respond to challenges and avoid slashing.
      </p>
      <div className="node-cta__specs">
        {specs.map((s) => (
          <div className="node-cta__spec" key={s.label}>
            <span className="node-cta__spec-label">{s.label}</span>
            <span className="node-cta__spec-value">{s.value}</span>
          </div>
        ))}
      </div>
      <Button as={Link} to="/docs/running-a-node" variant="secondary" className="node-cta__btn">
        Get Started
      </Button>
    </Panel>
  )
}

export default NodeCTA
