import './Button.css'

function Button({ variant = 'primary', as: Tag = 'button', className = '', children, ...rest }) {
  const classes = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ')

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
}

export default Button
