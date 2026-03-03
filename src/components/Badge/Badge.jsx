import './Badge.css'

function Badge({ variant = 'label', className = '', children, ...rest }) {
  const classes = [`badge--${variant}`, className].filter(Boolean).join(' ')

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  )
}

export default Badge
