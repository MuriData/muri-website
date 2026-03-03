import { useState } from 'react'
import './Header.css'
import Panel from '../Panel/Panel'
import Button from '../Button/Button'
import BrandMark from '../BrandMark/BrandMark'

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <Panel variant="glass" hover={false} className={`navbar${open ? ' navbar--open' : ''}`}>
      <div className="nav-top">
        <div className="nav-logo">
          <BrandMark color="var(--color-bg-teal)" />
          MuriData
        </div>
        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="nav-toggle__bar" />
          <span className="nav-toggle__bar" />
          <span className="nav-toggle__bar" />
        </button>
      </div>
      <div className="nav-links">
        <Button variant="ghost" as="a" href="#">Documentation</Button>
        <Button variant="ghost" as="a" href="#">Network</Button>
        <Button variant="primary" as="a" href="#">Connect Wallet</Button>
      </div>
    </Panel>
  )
}

export default Header
