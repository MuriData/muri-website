import './SecuritySection.css'
import Panel from '../Panel/Panel'
import Badge from '../Badge/Badge'
import Divider from '../Divider/Divider'

const details = [
  {
    label: 'Dynamic Slots',
    value: 'Parallel challenge slots scale with network size. Multiple nodes are audited simultaneously.',
  },
  {
    label: 'ZK-SNARK Verified',
    value: 'Groth16 proofs verify several chunk openings per challenge. Constant-size proofs, constant gas.',
  },
  {
    label: 'Randomness Heartbeat Beacon',
    value: 'Each challenge drives the network to produce verifiable and unpredictable randomness that is curcial for security. VRF-like proof.',
  },
  {
    label: 'Key Leak Protection',
    value: 'Anyone can report a compromised node private key with cryptographic proof. Full stake is slashed and the reporter is rewarded.',
  },
]

function SecuritySection() {
  return (
    <Panel variant="surface" className="security-panel">
      <div className="panel-header">
        <Badge variant="label">Security</Badge>
      </div>
      <Divider />
      <h2 className="security-heading">
        Continuous Verification
      </h2>
      <p className="security-intro">
        The challenge system runs perpetually — dynamically scaling parallel
        slots that audit random nodes at random intervals. Every proof is
        verified on-chain. There is no downtime in enforcement.
      </p>
      <div className="security-grid">
        {details.map((d) => (
          <div className="security-card" key={d.label}>
            <h4 className="security-card__label">{d.label}</h4>
            <p className="security-card__value">{d.value}</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export default SecuritySection
