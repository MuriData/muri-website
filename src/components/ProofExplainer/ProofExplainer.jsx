import './ProofExplainer.css'

const proofs = [
  {
    abbr: 'PoI',
    name: 'Proof of Integrity',
    tag: 'Integrity',
    description:
      'Verifies that storage nodes still hold the original file data. The protocol selects random chunks and the node proves possession via a ZK-SNARK, without revealing the data itself.',
    variant: 'mint',
  },
  {
    abbr: 'MURI',
    name: 'Measurable Unique Replica Integrity',
    tag: 'Redundancy',
    description:
      'Proves that a node has correctly encoded an archive using a two-pass sequential transform. Encoding binds data to the node\'s identity, preventing regeneration from another source.',
    variant: 'teal',
  },
  {
    abbr: 'PoP',
    name: 'Proof of Probing',
    tag: 'Availability',
    description:
      'Verifies serving availability through quorum-based network probing. Anti-correlated checkers issue random retrieval requests and vote on whether the target responded correctly in time.',
    variant: 'deep',
  },
]

function ProofExplainer() {
  return (
    <div className="proof-grid">
      {proofs.map((p) => (
        <div className={`proof-card proof-card--${p.variant}`} key={p.abbr}>
          <div className="proof-card__top">
            <span className="proof-card__abbr">{p.abbr}</span>
            <span className="proof-card__tag">{p.tag}</span>
          </div>
          <p className="proof-card__desc">{p.description}</p>
          <h3 className="proof-card__name">{p.name}</h3>
        </div>
      ))}
    </div>
  )
}

export default ProofExplainer
