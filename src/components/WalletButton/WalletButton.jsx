import { ConnectButton } from '@rainbow-me/rainbowkit'
import Button from '../Button/Button'
import './WalletButton.css'

function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            className="wallet-btn-wrapper"
            {...(!ready && {
              'aria-hidden': true,
              style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button variant="primary" onClick={openConnectModal}>
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button variant="primary" onClick={openChainModal}>
                    Wrong network
                  </Button>
                )
              }

              return (
                <button
                  className="wallet-pill"
                  onClick={openAccountModal}
                  type="button"
                >
                  {chain.hasIcon && chain.iconUrl && (
                    <img
                      className="wallet-pill__chain-icon"
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl}
                    />
                  )}
                  <span className="wallet-pill__address">
                    {account.displayName}
                  </span>
                </button>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default WalletButton
