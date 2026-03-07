import './Hero.css'
import Panel from '../Panel/Panel'
import Button from '../Button/Button'
import muriCharacter from '../../assets/muri-character.webp'

const flipped = Math.random() < 0.5

function Hero() {
  return (
    <Panel variant="hero" className={`hero-panel${flipped ? ' hero-panel--flipped' : ''}`}>
      <svg className="map-texture" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <path className="topo-svg" d="M0,200 Q100,100 200,200 T400,200 M-50,250 Q100,150 250,250 T450,200 M-20,150 Q120,50 220,150 T420,150 M0,300 Q150,200 300,300 T500,250" />
        <path className="topo-svg" d="M50,400 Q150,300 250,400 M100,0 Q150,100 50,200" transform="rotate(45, 200, 200)" />
        <path className="topo-svg" d="M300,0 Q200,100 300,200 T300,400" />
      </svg>

      <img src={muriCharacter} alt="MURI character" className="hero-character hero-character--full" />

      <div className="hero-content">
        <h1>Immutable guarantee for off-chain data.</h1>
        <p className="lead">
          MuriData provides an everlasting, platform-agnostic bridge for NFTs and external datasets. 100% On-chain reference.
        </p>
        <div className="hero-actions">
          <Button variant="secondary" as="a" href="#">Explore</Button>
          <Button variant="outline" as="a" href="#">Learn More</Button>
        </div>
      </div>
    </Panel>
  )
}

export default Hero
