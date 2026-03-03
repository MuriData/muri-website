import './Divider.css'

function Divider({ tight, variant }) {
  const classes = [
    'divider',
    tight ? 'divider--tight' : '',
    variant ? `divider--${variant}` : '',
  ].filter(Boolean).join(' ')

  return <div className={classes} />
}

export default Divider
