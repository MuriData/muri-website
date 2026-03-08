import './Technical.css'
import Panel from '../Panel/Panel'
import BrandMark from '../BrandMark/BrandMark'

const steps = [
  {
    number: '01',
    icon: '↑',
    title: 'Upload',
    summary: 'You send a file',
    description:
      'Your file is split into small chunks and organized into a Merkle tree — a cryptographic structure that makes every piece independently verifiable.',
  },
  {
    number: '02',
    icon: '⊞',
    title: 'Store',
    summary: 'Nodes keep it safe',
    description:
      'Storage providers claim your order, pin the chunks on IPFS, and put up collateral. No GPUs or special hardware — anyone can participate.',
  },
  {
    number: '03',
    icon: '✓',
    title: 'Prove',
    summary: 'Math checks the work',
    description:
      'The protocol continuously challenges random nodes to prove they still hold your data. Zero-knowledge proofs are verified on-chain — no trust required.',
  },
  {
    number: '04',
    icon: '⇄',
    title: 'Settle',
    summary: 'Good actors earn, bad actors lose',
    description:
      'Honest nodes receive periodic MURI rewards. Nodes that fail challenges are slashed proportionally. The economics keep everyone honest.',
  },
]

function Technical() {
  return (
    <div className="tech-column">
      <Panel variant="surface" className="tech-list-panel">
        <div className="panel-header">
          How It Works
        </div>
        <p className="tech-intro">
          MuriData replaces trust with math. Here is how your data stays
          safe — from upload to ongoing verification.
        </p>

        <div className="steps-timeline">
          {steps.map((step, i) => (
            <div className="step-card" key={step.number}>
              <div className="step-indicator">
                <span className="step-icon">{step.icon}</span>
                {i < steps.length - 1 && <div className="step-connector" />}
              </div>
              <div className="step-body">
                <span className="step-number">{step.number}</span>
                <div className="step-title-row">
                  <h3 className="step-title">{step.title}</h3>
                  <span className="step-summary">{step.summary}</span>
                </div>
                <p className="step-desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel variant="surface" className="coin-panel">
        <h3 className="step-title step-title--coin"><BrandMark /> MuriCoin</h3>
        <p className="step-desc">
          MuriCoin (MURI) powers every layer of the protocol. Clients pay in
          MURI to store data. Storage nodes stake MURI as collateral and earn
          periodic rewards for honest service. Failed challenges trigger
          slashing — redistributed to reporters and affected clients. The more
          you stake, the more you earn — but the more you lose if you cheat.
        </p>
      </Panel>
    </div>
  )
}

export default Technical
