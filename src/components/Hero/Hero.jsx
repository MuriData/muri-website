import { useNavigate } from 'react-router-dom'
import './Hero.css'
import Panel from '../Panel/Panel'
import Button from '../Button/Button'
import muriCharacter from '../../assets/muri-character.webp'

const flipped = Math.random() < 0.5

function Hero() {
  const navigate = useNavigate()

  const handleExplore = () => {
    const features = document.getElementById('features')
    if (features) {
      features.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Panel variant="hero" className={`hero-panel${flipped ? ' hero-panel--flipped' : ''}`}>
      <svg className="map-texture" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <path className="topo-svg" d="M0,200 Q100,100 200,200 T400,200 M-50,250 Q100,150 250,250 T450,200 M-20,150 Q120,50 220,150 T420,150 M0,300 Q150,200 300,300 T500,250" />
        <path className="topo-svg" d="M50,400 Q150,300 250,400 M100,0 Q150,100 50,200" transform="rotate(45, 200, 200)" />
        <path className="topo-svg" d="M300,0 Q200,100 300,200 T300,400" />
      </svg>

      <img src={muriCharacter} alt="MURI character" className="hero-character hero-character--full" />

      <div className="hero-content">
        <h1>The Storage Network That Proves Itself.</h1>
        <p className="lead">
          Verifiable Storage or Hot Retrieval? MuriData wants both! A dream-like storage partner for blockchain-based computing platforms.
        </p>
        <div className="hero-actions">
          <Button variant="secondary" onClick={handleExplore}>Explore</Button>
          <Button variant="outline" onClick={() => navigate('/docs')}>Learn More</Button>
        </div>
      </div>
    </Panel>
  )
}

export default Hero
