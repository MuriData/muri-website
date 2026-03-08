import './Roadmap.css'

const phases = [
  {
    number: '01',
    tag: 'Current',
    title: 'Testnet & PoI',
    status: 'active',
    items: [
      'Avalanche L1 testnet deployment',
      'Proof of Integrity (PoI) circuit live',
      'FileMarket & NodeStaking contracts',
      'Storage node daemon (murid)',
      'IPFS-backed hot retrieval',
    ],
  },
  {
    number: '02',
    tag: 'Next',
    title: 'MURI & PoP',
    status: 'upcoming',
    items: [
      'MURI archive proofs',
      'PoP file availability checks',
      'Multi-circuit challenge system',
      'Node performance scoring',
      'SDK & developer tooling',
    ],
  },
  {
    number: '03',
    tag: 'Planned',
    title: 'Tokenomics & Distribution',
    status: 'upcoming',
    items: [
      'MURI token generation event',
      'Staking reward calibration',
      'Community & ecosystem allocation',
      'Governance framework',
      'Incentivized testnet campaigns',
    ],
  },
  {
    number: '04',
    tag: 'Future',
    title: 'Mainnet & SaaS',
    status: 'upcoming',
    items: [
      'Production mainnet launch',
      'Dedicated VM replacing EVM',
      'Enterprise storage-as-a-service',
      'Cross-chain bridge integrations',
      'Storage marketplace dashboard',
    ],
  },
]

function Roadmap() {
  return (
    <div className="roadmap-wrapper">
      <h2 className="roadmap-heading"><span className="roadmap-heading__icon">◆</span>Roadmap</h2>
      <div className="roadmap-grid">
      {phases.map((phase, i) => (
        <div className="roadmap-slot" key={phase.number}>
          <div className={`roadmap-card roadmap-card--${phase.status}`}>
            <div className="roadmap-card__top">
              <span className="roadmap-card__number">{phase.number}</span>
              <span className={`roadmap-card__tag roadmap-card__tag--${phase.status}`}>
                {phase.tag}
              </span>
            </div>
            <h3 className="roadmap-card__title">{phase.title}</h3>
            <ul className="roadmap-card__items">
              {phase.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          {i < phases.length - 1 && (
            <span className="roadmap-connector" aria-hidden="true" />
          )}
        </div>
      ))}
      </div>
    </div>
  )
}

export default Roadmap
