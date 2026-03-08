import './ComparisonTable.css'

const features = [
  {
    name: 'Proof System',
    muri: 'PoI + MURI + PoP',
    filecoin: 'PoRep + PoSt',
    arweave: 'Proof of Access',
    storj: 'Audit sampling',
    crust: 'TEE attestation (SGX)',
  },
  {
    name: 'Hardware Requirement',
    muri: 'Consumer-grade',
    filecoin: 'GPU + high RAM',
    arweave: 'Standard',
    storj: 'Standard',
    crust: 'Intel SGX required',
  },
  {
    name: 'On-chain Verification',
    muri: 'Every proof',
    filecoin: 'Every proof',
    arweave: 'Block-level',
    storj: 'None',
    crust: 'Periodic reports',
  },
  {
    name: 'Storage Model',
    muri: 'Hot retrieval',
    filecoin: 'Cold archive',
    arweave: 'Permanent',
    storj: 'Hot retrieval',
    crust: 'Hot (IPFS-based)',
  },
  {
    name: 'Challenge System',
    muri: 'Continuous, parallel',
    filecoin: 'Periodic deadlines',
    arweave: 'Block mining',
    storj: 'Periodic audits',
    crust: 'TEE workload reports',
  },
  {
    name: 'Slashing',
    muri: 'Value-proportional',
    filecoin: 'Sector penalty',
    arweave: 'None',
    storj: 'Reputation loss',
    crust: 'Stake reduction',
  },
]

function ComparisonTable() {
  return (
    <div className="comparison-wrapper">
      <h2 className="comparison-heading">
        <span className="comparison-heading__icon">⟡</span>
        How MuriData Compares
        <span className="comparison-heading__line" />
      </h2>

      {/* Desktop table */}
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="comparison-th comparison-th--feature">Feature</th>
              <th className="comparison-th comparison-th--muri">MuriData</th>
              <th className="comparison-th">Filecoin</th>
              <th className="comparison-th">Crust</th>
              <th className="comparison-th">Arweave</th>
              <th className="comparison-th">Storj</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.name} className="comparison-row">
                <td className="comparison-td comparison-td--feature">{f.name}</td>
                <td className="comparison-td comparison-td--muri">{f.muri}</td>
                <td className="comparison-td">{f.filecoin}</td>
                <td className="comparison-td">{f.crust}</td>
                <td className="comparison-td">{f.arweave}</td>
                <td className="comparison-td">{f.storj}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="comparison-cards">
        {features.map((f) => (
          <div className="comparison-card" key={f.name}>
            <h4 className="comparison-card__title">{f.name}</h4>
            <div className="comparison-card__row comparison-card__row--muri">
              <span className="comparison-card__label">MuriData</span>
              <span className="comparison-card__value">{f.muri}</span>
            </div>
            <div className="comparison-card__row">
              <span className="comparison-card__label">Filecoin</span>
              <span className="comparison-card__value">{f.filecoin}</span>
            </div>
            <div className="comparison-card__row">
              <span className="comparison-card__label">Crust</span>
              <span className="comparison-card__value">{f.crust}</span>
            </div>
            <div className="comparison-card__row">
              <span className="comparison-card__label">Arweave</span>
              <span className="comparison-card__value">{f.arweave}</span>
            </div>
            <div className="comparison-card__row">
              <span className="comparison-card__label">Storj</span>
              <span className="comparison-card__value">{f.storj}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComparisonTable
