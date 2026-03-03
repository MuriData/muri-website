import './Technical.css'
import Panel from '../Panel/Panel'
import Badge from '../Badge/Badge'
import BrandMark from '../BrandMark/BrandMark'

const specs = [
  { key: 'Storage Proof', value: 'Merkle / ZK-SNARK' },
  { key: 'Latency', value: '< 100ms (Global)' },
  { key: 'Encryption', value: 'AES-256 / ChaCha20' },
  { key: 'Validator Nodes', value: 'Decentralized (DAO)' },
  { key: 'API Compatibility', value: 'REST / GraphQL / gRPC' },
]

function Technical() {
  return (
    <Panel variant="surface" className="tech-list-panel">
      <div className="panel-header">
        <BrandMark />
        Specifications
      </div>

      {specs.map((spec) => (
        <div className="tech-row" key={spec.key}>
          <span className="tech-key">{spec.key}</span>
          <Badge variant="value">{spec.value}</Badge>
        </div>
      ))}
    </Panel>
  )
}

export default Technical
