import './Features.css'
import FeatureCard from '../FeatureCard/FeatureCard'

const features = [
  {
    label: '01 — Core',
    description: 'Highly optimized smart contract architecture ensuring minimal gas fees.',
    heading: 'Cost Effective',
    variant: 'light',
  },
  {
    label: '02 — Scale',
    description: 'Works across all EVM compatible chains without modification.',
    heading: 'Platform Agnostic',
    variant: 'dark',
  },
  {
    label: '03 — Trust',
    description: 'Cryptographic proof of data permanence.',
    heading: 'Everlasting',
    variant: 'image-bg',
  },
]

function Features() {
  return (
    <div className="feature-grid">
      {features.map((feature) => (
        <FeatureCard key={feature.label} {...feature} />
      ))}
    </div>
  )
}

export default Features
