import './LandingPage.css'
import { Hero, Features, Technical, StatPanel } from '../components'

function LandingPage() {
  return (
    <div className="landing-grid">
      <Hero />
      <Features />
      <Technical />
      <StatPanel />
    </div>
  )
}

export default LandingPage
