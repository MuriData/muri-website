import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { muriTestnet } from '../../lib/wagmi'
import Button from '../Button/Button'
import './WalletButton.css'

const WALLET_META = {
  'Injected':        { label: 'Browser Wallet', icon: WalletIcon },
  'Core':            { label: 'Core',           icon: CoreIcon },
  'MetaMask':        { label: 'MetaMask',       icon: MetaMaskIcon },
  'WalletConnect':   { label: 'WalletConnect',  icon: WalletConnectIcon },
  'Coinbase Wallet': { label: 'Coinbase',       icon: CoinbaseIcon },
}

function truncateAddress(addr) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''
}

function WalletButton() {
  const [modalOpen, setModalOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const pillRef = useRef(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 })

  const { address, isConnected, chain } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const wrongNetwork = isConnected && chain?.id !== muriTestnet.id

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        pillRef.current && !pillRef.current.contains(e.target)
      ) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [modalOpen])

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') setModalOpen(false)
    }
    if (modalOpen) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [modalOpen])

  if (!isConnected) {
    return (
      <>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Connect Wallet
        </Button>
        {modalOpen && createPortal(
          <ConnectModal
            connectors={connectors}
            isPending={isPending}
            onConnect={(connector) => {
              connect({ connector }, { onSuccess: () => setModalOpen(false) })
            }}
            onClose={() => setModalOpen(false)}
          />,
          document.body
        )}
      </>
    )
  }

  if (wrongNetwork) {
    return (
      <Button
        variant="primary"
        className="wallet-btn--wrong"
        onClick={() => switchChain({ chainId: muriTestnet.id })}
      >
        Switch Network
      </Button>
    )
  }

  const openDropdown = () => {
    if (pillRef.current) {
      const rect = pillRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
      })
    }
    setDropdownOpen((v) => !v)
  }

  return (
    <div className="wallet-connected" ref={dropdownRef}>
      <button
        className="wallet-pill"
        ref={pillRef}
        onClick={openDropdown}
        type="button"
      >
        <span className="wallet-pill__address">{truncateAddress(address)}</span>
        <ChevronIcon open={dropdownOpen} />
      </button>
      {dropdownOpen && createPortal(
        <div
          className="wallet-dropdown"
          ref={dropdownRef}
          style={{ top: dropdownPos.top, right: dropdownPos.right }}
        >
          <div className="wallet-dropdown__status">
            <span className="wallet-dropdown__chain">{muriTestnet.name}</span>
          </div>
          <div className="wallet-dropdown__address-wrap">
            <div className="wallet-dropdown__address-label">Wallet Address</div>
            <div className="wallet-dropdown__address">{address}</div>
          </div>
          <button
            className="wallet-dropdown__disconnect"
            onClick={() => { disconnect(); setDropdownOpen(false) }}
          >
            Disconnect
          </button>
        </div>,
        document.body
      )}
    </div>
  )
}

const DISPLAY_WALLETS = [
  { key: 'injected',           name: 'Injected',        label: 'Browser Wallet', icon: WalletIcon,         primary: true },
  { key: 'metaMask',           name: 'MetaMask',        label: 'MetaMask',       icon: MetaMaskIcon,       primary: false },
  { key: 'core',               name: 'Core',            label: 'Core',           icon: CoreIcon,           primary: false },
  { key: 'walletConnect',      name: 'WalletConnect',   label: 'WalletConnect',  icon: WalletConnectIcon,  primary: false },
  { key: 'coinbaseWalletSDK',  name: 'Coinbase Wallet', label: 'Coinbase',       icon: CoinbaseIcon,       primary: false },
]

const INJECTED_WALLETS = new Set(['Injected', 'MetaMask', 'Core'])

function ConnectModal({ connectors, isPending, onConnect, onClose }) {
  const connectorsByName = {}
  const connectorsById = {}
  for (const c of connectors) {
    if (!connectorsByName[c.name]) connectorsByName[c.name] = c
    if (!connectorsById[c.id]) connectorsById[c.id] = c
  }

  const getConnector = (wallet) => {
    return connectorsByName[wallet.name]
      || connectorsById[wallet.key]
      || (INJECTED_WALLETS.has(wallet.name) ? connectorsByName['Injected'] : null)
  }

  return (
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-modal__header">
          <h3 className="wallet-modal__title">Connect Wallet</h3>
          <button className="wallet-modal__close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="wallet-modal__list">
          {DISPLAY_WALLETS.map((wallet) => {
            const connector = getConnector(wallet)
            const available = !!connector
            return (
              <button
                key={wallet.key}
                className={`wallet-option${wallet.primary ? '' : ' wallet-option--compact'}${available ? '' : ' wallet-option--unavailable'}`}
                onClick={() => available && onConnect(connector)}
                disabled={isPending || !available}
              >
                <span className="wallet-option__icon">
                  <wallet.icon />
                </span>
                <span className="wallet-option__name">{wallet.label}</span>
                {!available && <span className="wallet-option__badge">Not installed</span>}
                {isPending && available && <span className="wallet-option__spinner" />}
              </button>
            )
          })}
        </div>
        <p className="wallet-modal__footer">
          By connecting, you agree to the Terms of Service
        </p>
      </div>
    </div>
  )
}

/* ── Inline SVG Icons ── */

function ChevronIcon({ open }) {
  return (
    <svg className={`wallet-pill__chevron${open ? ' wallet-pill__chevron--open' : ''}`}
      width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="15" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 12.5a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" />
      <path d="M6 5V4a2 2 0 012-2h8a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function MetaMaskIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.8211 19.9179L15.9439 18.7869L13.02 20.4992L10.98 20.4983L8.05434 18.7869L4.1789 19.9179L3 16.0192L4.1789 11.6923L3 8.03404L4.1789 3.5L10.2346 7.04437H13.7653L19.8211 3.5L21 8.03404L19.8211 11.6923L21 16.0192L19.8211 19.9179Z" fill="#FF5C16"/>
      <path d="M4.17957 3.5L10.2354 7.04686L9.99457 9.48105L4.17957 3.5ZM8.05513 16.0209L10.7196 18.0093L8.05513 18.7869V16.0209ZM10.5067 12.7335L9.99457 9.48267L6.7166 11.6933L6.71481 11.6924V11.6941L6.72499 13.9695L8.05424 12.7336L10.5067 12.7335ZM19.821 3.5L13.7652 7.04686L14.0052 9.48105L19.821 3.5ZM15.9456 16.0209L13.2809 18.0093L15.9456 18.7869V16.0209ZM17.2849 11.6939V11.6923L17.2841 11.6932L14.0061 9.48267L13.494 12.7335H15.9454L17.2756 13.9692L17.2849 11.6939Z" fill="#FF5C16"/>
      <path d="M8.05434 18.7869L4.1789 19.9179L3 16.0208H8.05434V18.7869ZM10.5059 12.7325L11.2462 17.4322L10.2202 14.8191L6.72344 13.9692L8.05345 12.7327H10.5059V12.7325ZM15.9455 18.7869L19.8211 19.9179L21 16.0208H15.9455V18.7869ZM13.4941 12.7325L12.7538 17.4322L13.7797 14.8191L17.2766 13.9692L15.9457 12.7327H13.4941V12.7325Z" fill="#E34807"/>
      <path d="M3 16.0192L4.1789 11.6923H6.71402L6.72331 13.9684L10.2203 14.8183L11.2462 17.4313L10.7188 18.0068L8.05434 16.0183H3V16.0192ZM21 16.0192L19.8211 11.6923H17.2858L17.2766 13.9684L13.7798 14.8183L12.7538 17.4313L13.281 18.0068L15.9457 16.0183H21V16.0192ZM13.7653 7.04431H10.2346L9.9948 9.4785L11.2463 17.4288H12.7538L14.0061 9.4785L13.7653 7.04431Z" fill="#FF8D5D"/>
      <path d="M4.1789 3.5L3 8.03404L4.1789 11.6923H6.71402L9.99378 9.48105L4.1789 3.5ZM9.77321 13.6765H8.62471L7.99939 14.277L10.2211 14.8166L9.77321 13.6758V13.6765ZM19.8211 3.5L21 8.03404L19.8211 11.6923H17.2858L14.0062 9.48105L19.8211 3.5ZM14.2284 13.6765H15.3786L16.0039 14.2778L13.7797 14.8184L14.2284 13.6757V13.6765ZM13.0191 18.9483L13.2812 18.0084L12.7538 17.433H11.2452L10.7179 18.0084L10.9798 18.9483" fill="#661800"/>
      <path d="M13.0191 18.9482V20.5H10.98V18.9482H13.0191Z" fill="#C0C4CD"/>
      <path d="M8.05518 18.7853L10.9816 20.4992V18.9474L10.7195 18.0077L8.05518 18.7853ZM15.9456 18.7853L13.0191 20.4992V18.9474L13.2811 18.0077L15.9456 18.7853Z" fill="#E7EBF6"/>
    </svg>
  )
}

function WalletConnectIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.68497 8.71011C9.62039 5.8966 14.3796 5.8966 17.315 8.71011L17.6683 9.04872C17.8151 9.18939 17.8151 9.41747 17.6683 9.55815L16.4598 10.7165C16.3864 10.7868 16.2675 10.7868 16.1941 10.7165L15.7079 10.2505C13.6601 8.28772 10.3399 8.28772 8.29211 10.2505L7.77147 10.7495C7.69809 10.8198 7.57911 10.8198 7.50572 10.7495L6.29721 9.59119C6.15044 9.45052 6.15044 9.22244 6.29721 9.08176L6.68497 8.71011ZM19.8143 11.1056L20.8899 12.1365C21.0367 12.2772 21.0367 12.5053 20.8899 12.646L16.0401 17.2945C15.8933 17.4351 15.6554 17.4351 15.5086 17.2945L12.0665 13.9953C12.0298 13.9601 11.9703 13.9601 11.9336 13.9953L8.49155 17.2945C8.34478 17.4351 8.10682 17.4351 7.96005 17.2945L3.11008 12.6459C2.96331 12.5052 2.96331 12.2772 3.11008 12.1365L4.18565 11.1056C4.33242 10.9649 4.57039 10.9649 4.71716 11.1056L8.15932 14.4048C8.19601 14.44 8.25551 14.44 8.2922 14.4048L11.7342 11.1056C11.881 10.9649 12.1189 10.9649 12.2657 11.1056L15.7079 14.4048C15.7446 14.44 15.804 14.44 15.8407 14.4048L19.2828 11.1056C19.4296 10.965 19.6676 10.965 19.8143 11.1056Z" fill="#3B99FC"/>
    </svg>
  )
}

function CoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 320 249" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M94.6529 248.11C60.34 248.11 28.1307 240.786 0.259766 227.955L113.653 124.456C97.9906 111.607 87.9982 92.1014 87.9982 70.2623C87.9982 48.0254 98.3578 28.2082 114.514 15.3736V0.202384H157.582C157.741 0.201324 157.9 0.200793 158.06 0.200793C175.574 0.200793 191.587 6.62746 203.87 17.2513C216.153 6.62841 232.165 0.202384 249.679 0.202384H249.783L249.786 0.199951L249.788 0.202384H293.225V15.3753C309.381 28.2099 319.74 48.0271 319.74 70.2638C319.74 98.2268 303.358 122.364 279.668 133.601C271.198 158.608 255.266 181.1 233.942 199.395V231.727H180.338C154.548 242.211 125.447 248.11 94.6529 248.11ZM158.059 124.157C170.813 124.157 182.532 119.727 191.762 112.322L203.761 139.34L215.817 112.194C225.071 119.676 236.851 124.157 249.678 124.157C279.443 124.157 303.571 100.029 303.571 70.264C303.571 40.4995 279.443 16.3706 249.678 16.3706C230.338 16.3706 213.377 26.5582 203.869 41.8598C194.361 26.5582 177.4 16.3706 158.059 16.3706C128.295 16.3706 104.166 40.4995 104.166 70.264C104.166 100.029 128.295 124.157 158.059 124.157ZM158.059 107.989C178.894 107.989 195.784 91.0988 195.784 70.2636C195.784 49.4285 178.894 32.5383 158.059 32.5383C137.224 32.5383 120.334 49.4285 120.334 70.2636C120.334 91.0988 137.224 107.989 158.059 107.989ZM158.059 91.8211C169.965 91.8211 179.617 82.1696 179.617 70.2637C179.617 58.3579 169.965 48.7064 158.059 48.7064C146.153 48.7064 136.502 58.3579 136.502 70.2637C136.502 82.1696 146.153 91.8211 158.059 91.8211ZM287.403 70.2636C287.403 91.0988 270.513 107.989 249.678 107.989C228.843 107.989 211.952 91.0988 211.952 70.2636C211.952 49.4285 228.843 32.5383 249.678 32.5383C270.513 32.5383 287.403 49.4285 287.403 70.2636ZM271.235 70.2637C271.235 82.1696 261.584 91.8211 249.678 91.8211C237.772 91.8211 228.12 82.1696 228.12 70.2637C228.12 58.3579 237.772 48.7064 249.678 48.7064C261.584 48.7064 271.235 58.3579 271.235 70.2637Z" fill="currentColor"/>
    </svg>
  )
}

function CoinbaseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" fill="#0E5BFF"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 18.375C15.5208 18.375 18.375 15.5208 18.375 12C18.375 8.47919 15.5208 5.625 12 5.625C8.4792 5.625 5.62501 8.47919 5.62501 12C5.62501 15.5208 8.4792 18.375 12 18.375ZM11.25 10.125C10.6287 10.125 10.125 10.6287 10.125 11.25V12.75C10.125 13.3713 10.6287 13.875 11.25 13.875H12.75C13.3713 13.875 13.875 13.3713 13.875 12.75V11.25C13.875 10.6287 13.3713 10.125 12.75 10.125H11.25Z" fill="white"/>
    </svg>
  )
}

export default WalletButton
