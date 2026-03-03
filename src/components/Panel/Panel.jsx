import './Panel.css'

function Panel({ variant = 'surface', hover = true, className = '', children, ...rest }) {
  const classes = [
    'panel',
    `panel--${variant}`,
    hover ? 'panel--hover' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}

export default Panel
