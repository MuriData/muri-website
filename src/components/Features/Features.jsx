import './Features.css'
import FeatureCard from '../FeatureCard/FeatureCard'

const features = [
  {
    label: '01 — Philosophy',
    description: 'No much heavy work; No dependence on special hardware. MuriData allows even laptop to store and earn.',
    heading: 'Efficient',
    variant: 'light',
  },
  {
    label: '02 — Design',
    description: 'Protocol is designed to hold many participants, which scales efficiently and strengthen the economy and security.',
    heading: 'Scalable',
    variant: 'dark',
  },
  {
    label: '03 — Trust',
    description: 'Zero-knowledge proofs continuously verify that providers hold your data. Every claim is proven on-chain; no trust required, just math.',
    heading: 'Verifiable',
    variant: 'image-bg',
  },
]

function Features() {
  return (
    <div id="features" className="feature-grid">
      {features.map((feature) => (
        <FeatureCard key={feature.label} {...feature} />
      ))}
    </div>
  )
}

export default Features
