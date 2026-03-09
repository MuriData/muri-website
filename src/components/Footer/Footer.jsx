import { Link } from 'react-router-dom'
import './Footer.css'
import BrandMark from '../BrandMark/BrandMark'
import Divider from '../Divider/Divider'
import { BLOCKSCOUT_URL, FAUCET_URL } from '../../lib/config'

const navGroups = [
  {
    title: 'Protocol',
    links: [
      { label: 'Overview', to: '/docs/architecture/overview' },
      { label: 'Whitepaper', to: '/docs' },
      { label: 'Roadmap', to: '/docs' },
      { label: 'Tokenomics', to: '/docs' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', to: '/docs' },
      { label: 'Testnet Faucet', href: FAUCET_URL, external: true },
      { label: 'GitHub', href: 'https://github.com/MuriData', external: true },
      { label: 'SDK Reference', to: '/docs' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: 'https://github.com/MuriData', external: true },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Console', to: '/console' },
      { label: 'Block Explorer', to: '/explorer' },
      { label: 'Blockscout', href: BLOCKSCOUT_URL, external: true },
      { label: 'Blog', to: '/blog' },
    ],
  },
]

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <BrandMark color="var(--color-bg-teal)" />
            <span>MuriData</span>
          </Link>
          <p className="footer__tagline">
            A dream-like storage partner for blockchain-based computing platforms.
          </p>
          <div className="footer__socials">
            <a href="https://github.com/MuriData" className="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>

        <nav className="footer__nav">
          {navGroups.map((group) => (
            <div className="footer__nav-group" key={group.title}>
              <h4 className="footer__nav-title">{group.title}</h4>
              <ul className="footer__nav-list">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className="footer__nav-link">{link.label}</Link>
                    ) : link.external ? (
                      <a href={link.href} className="footer__nav-link" target="_blank" rel="noopener noreferrer">{link.label} ↗</a>
                    ) : (
                      <a href={link.href} className="footer__nav-link">{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <Divider variant="subtle" />

      <div className="footer__bottom">
        <span className="footer__copy">&copy; {new Date().getFullYear()} MuriData Protocol. All rights reserved.</span>
        <div className="footer__legal">
          <Link to="/docs/legal/terms-of-service" className="footer__legal-link">Terms of Service</Link>
          <Link to="/docs/legal/privacy-policy" className="footer__legal-link">Privacy Policy</Link>
          <Link to="/docs/legal/cookie-policy" className="footer__legal-link">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
