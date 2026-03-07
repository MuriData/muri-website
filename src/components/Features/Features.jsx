import './Features.css'
import FeatureCard from '../FeatureCard/FeatureCard'

const features = [
  {
    label: '01 — Philosophy',
    description: 'No much heavy work; No dependence on special hardware. MuriData allows even laptop to become storage provider.',
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
    description: 'Cryptographic proof of data existance, with contract-bounded time range. In theory file will be there - for you; forever.',
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
