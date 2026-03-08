import './AvalancheSection.css'
import Panel from '../Panel/Panel'
import Badge from '../Badge/Badge'
import Button from '../Button/Button'
import Divider from '../Divider/Divider'
import { Link } from 'react-router-dom'

function AvalancheSection() {
  return (
    <Panel variant="surface" className="avalanche-panel">
      <div className="panel-header">
        <Badge variant="label">Infrastructure</Badge>
      </div>
      <Divider />
      <div className="avalanche-content">
        <div className="avalanche-text">
          <h2 className="avalanche-heading">
            Built on Avalanche
          </h2>
          <p className="avalanche-desc">
            MuriData runs as a dedicated Avalanche L1 - a sovereign blockchain
            with its own validator set, consensus, and gas economics. This gives
            the protocol sub-second finality, predictable low fees, and full
            control over chain parameters without competing for blockspace.
          </p>
          <div className="avalanche-actions">
            <Button as={Link} to="/docs/become-validator" variant="primary">Become Validator</Button>
            <Button as={Link} to="/docs/avalanche-integration" variant="outline">Read More</Button>
          </div>
        </div>
        <div className="avalanche-features">
          <div className="avalanche-feature">
            <span className="avalanche-feature__icon">⟐</span>
            <div>
              <h4 className="avalanche-feature__title">Sovereign L1</h4>
              <p className="avalanche-feature__desc">
                Storage proofs need a deterministic clock without a centralized
                sequencer. An L1 gives MuriData its own validator set and
                block production; no single point of failure in timing.
              </p>
            </div>
          </div>
          <div className="avalanche-feature">
            <span className="avalanche-feature__icon">◇</span>
            <div>
              <h4 className="avalanche-feature__title">Sub-Second Finality</h4>
              <p className="avalanche-feature__desc">
                Avalanche consensus finalizes blocks in under a second;
                challenge deadlines and proof submissions resolve fast.
              </p>
            </div>
          </div>
          <div className="avalanche-feature">
            <span className="avalanche-feature__icon">⬡</span>
            <div>
              <h4 className="avalanche-feature__title">Low, Predictable Fees</h4>
              <p className="avalanche-feature__desc">
                No gas wars with DeFi or NFT traffic. Storage operations stay
                cheap and predictable regardless of mainnet congestion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  )
}

export default AvalancheSection
