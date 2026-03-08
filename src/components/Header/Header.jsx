import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import Panel from '../Panel/Panel'
import Button from '../Button/Button'
import BrandMark from '../BrandMark/BrandMark'
import SearchDialog from '../SearchDialog/SearchDialog'
import WalletButton from '../WalletButton/WalletButton'

function Header() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <Panel variant="glass" hover={false} className={`navbar${open ? ' navbar--open' : ''}`}>
        <div className="nav-top">
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            <BrandMark color="var(--color-bg-teal)" />
            MuriData
          </Link>
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
          <Button variant="ghost" as={Link} to="/dashboard" onClick={closeMenu}>Dashboard</Button>
          <Button variant="ghost" as={Link} to="/console" onClick={closeMenu}>Console</Button>
          <Button variant="ghost" as={Link} to="/explorer" onClick={closeMenu}>Explorer</Button>
          <Button variant="ghost" as={Link} to="/docs" onClick={closeMenu}>Documentation</Button>
          <Button variant="ghost" as={Link} to="/blog" onClick={closeMenu}>Blog</Button>
          <button className="nav-search-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="2" />
              <path d="M12 12l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="nav-search-btn__label">Search</span>
            <kbd className="nav-search-btn__kbd">⌘K</kbd>
          </button>
          <WalletButton />
        </div>
      </Panel>
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

export default Header
