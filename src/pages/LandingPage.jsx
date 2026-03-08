import './LandingPage.css'
import { Hero, Features, Technical, StatPanel, UseCases, SecuritySection, NodeCTA, ComparisonTable, ProofExplainer, Roadmap, FAQ, Team, AvalancheSection } from '../components'

function LandingPage() {
  return (
    <div className="landing-grid">
      <Hero />
      <Features />
      <Technical />
      <StatPanel />
      <UseCases />
      <SecuritySection />
      <NodeCTA />
      <ComparisonTable />
      <ProofExplainer />
      <AvalancheSection />
      <Roadmap />
      <FAQ />
      <Team />
    </div>
  )
}

export default LandingPage
