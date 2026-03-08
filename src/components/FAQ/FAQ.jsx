import { useState } from 'react'
import './FAQ.css'

const faqs = [
  {
    q: 'How is MuriData different from Filecoin or Arweave?',
    a: 'See the comparison table above — the key differences are continuous parallel challenges, on-chain ZK verification for every proof, consumer-grade hardware requirements, and hot retrieval by default.',
  },
  {
    q: 'What hardware do I need to run a storage node?',
    a: 'Consumer-grade hardware is enough. No GPUs, no specialized ASICs. A standard laptop or desktop with available disk space can participate. The PoI circuit generates proofs in about 40 seconds on commodity CPUs.',
  },
  {
    q: 'What happens if a storage node goes offline?',
    a: 'The challenge system detects it. Each node has 50 blocks (~100 seconds) to respond to a proof challenge. Failure triggers value-proportional slashing — the stake lost scales with the value of data at risk. Slashed funds go to reporters and affected clients.',
  },
  {
    q: 'Is my data private?',
    a: 'Files are stored on IPFS and publicly retrievable by content hash. MuriData is designed for data that benefits from public availability — dApp assets, NFT metadata, datasets. For private data, encrypt before uploading.',
  },
  {
    q: 'How much does storage cost?',
    a: 'Pricing is set by the market. Clients specify their price per chunk when placing orders, and nodes choose which orders to accept. Competition between nodes drives prices toward fair market rates.',
  },
  {
    q: 'What is the MURI token used for?',
    a: 'MURI is the protocol\'s native token. Clients pay in MURI to store data. Nodes stake MURI as collateral and earn periodic rewards. Failed proof challenges trigger slashing — the more you stake, the more you earn, but the more you lose if you cheat.',
  },
]

function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <div className="faq-wrapper">
      <h2 className="faq-heading">
        <span className="faq-heading__icon">?</span>
        Frequently Asked Questions
        <span className="faq-heading__line" />
      </h2>

      <div className="faq-list">
        {faqs.map((faq, i) => (
          <div
            className={`faq-item${open === i ? ' faq-item--open' : ''}`}
            key={i}
          >
            <button
              className="faq-item__q"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{faq.q}</span>
              <span className="faq-item__chevron">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <p className="faq-item__a">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ
