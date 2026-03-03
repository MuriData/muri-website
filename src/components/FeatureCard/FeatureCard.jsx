import './FeatureCard.css'
import Badge from '../Badge/Badge'
import Divider from '../Divider/Divider'

function FeatureCard({ label, description, heading, variant }) {
  const classes = [
    'feature-card',
    variant === 'dark' ? 'feature-card--dark' : '',
    variant === 'image-bg' ? 'feature-card--image-bg' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <div className="panel-header" style={{ marginBottom: 0 }}>
        <Badge variant="label">{label}</Badge>
      </div>
      <Divider />
      <div className="feature-content">
        <p className="feature-card__desc">{description}</p>
        <h3 className="feature-card__heading">{heading}</h3>
      </div>
    </div>
  )
}

export default FeatureCard
