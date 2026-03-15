import { useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import './Console.css'
import StorageTab from './console/StorageTab'
import IpfsBar from './console/IpfsBar'
import { useIpfs } from '../hooks/useIpfs'
import { useFaucet } from '../hooks/useFaucet'
import WalletButton from '../components/WalletButton/WalletButton'
import { FAUCET_ADDRESS, FAUCET_URL } from '../lib/config'

function IconUpload() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 14v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
      <path d="M10 12V3" /><path d="M6 7l4-4 4 4" />
    </svg>
  )
}

function ClaimTokens() {
  const faucet = useFaucet()
  const { address } = useAccount()
  const { data: balance, refetch: refetchBalance } = useBalance({ address })

  useEffect(() => {
    if (faucet.isSuccess) {
      faucet.refetch()
      refetchBalance()
    }
  }, [faucet.isSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

  const isFaucetConfigured = FAUCET_ADDRESS !== '0x0000000000000000000000000000000000000000'

  if (!isFaucetConfigured) return null

  const cooldownRemaining = faucet.lastClaim > 0n && !faucet.canClaim
    ? Number(faucet.lastClaim + faucet.cooldown) - Math.floor(Date.now() / 1000)
    : 0

  function formatCooldown(seconds) {
    if (seconds <= 0) return ''
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  let label = `Claim ${faucet.claimAmount > 0n ? formatEther(faucet.claimAmount) : ''} MURI`
  if (faucet.isPending) label = 'Confirm in wallet...'
  else if (faucet.isConfirming) label = 'Claiming...'
  else if (!faucet.canClaim) label = `Cooldown (${formatCooldown(cooldownRemaining)})`

  return (
    <div className="faucet-bar">
      <div className="faucet-bar__info">
        <span className="faucet-bar__tag">Testnet Faucet</span>
        <span className="faucet-bar__sep" />
        <span className="faucet-bar__label">Balance</span>
        <span className="faucet-bar__balance">{balance ? Number(formatEther(balance.value)).toFixed(2) : '...'} MURI</span>
      </div>
      <div className="faucet-bar__actions">
        <button
          className="console-btn console-btn--primary console-btn--small"
          onClick={faucet.claim}
          disabled={faucet.isPending || faucet.isConfirming || !faucet.canClaim}
        >
          {(faucet.isPending || faucet.isConfirming) && <span className="console-btn__spinner" />}
          {label}
        </button>
        {faucet.isSuccess && (
          <span className="faucet-bar__success">Tokens claimed!</span>
        )}
        {faucet.error && (
          <span className="faucet-bar__error">{faucet.error.shortMessage || faucet.error.message}</span>
        )}
        <span className="faucet-bar__hint">
          Need gas for the first claim?{' '}
          <a href={FAUCET_URL} target="_blank" rel="noopener noreferrer">Get free tokens here</a>.
        </span>
      </div>
    </div>
  )
}

function Console() {
  const { isConnected } = useAccount()
  const ipfs = useIpfs()

  if (!isConnected) {
    return (
      <div className="console">
        <div className="console-header">
          <h1 className="console-title">Storage Console</h1>
          <p className="console-subtitle">Upload files and manage your storage orders</p>
        </div>
        <div className="console-gate">
          <div className="console-gate__icon">
            <IconUpload />
          </div>
          <p className="console-gate__text">Connect your wallet to start uploading files</p>
          <WalletButton />
          <p className="console-gate__hint">
            Need tokens? Get free testnet MURI from the{' '}
            <a href={FAUCET_URL} target="_blank" rel="noopener noreferrer">Testnet Faucet</a>
            {' '}— no gas required.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="console">
      <div className="console-header">
        <h1 className="console-title">Storage Console</h1>
        <p className="console-subtitle">Upload files to IPFS and place storage orders on-chain.</p>
      </div>
      <ClaimTokens />
      <IpfsBar ipfs={ipfs} />
      <StorageTab ipfs={ipfs} />
    </div>
  )
}

export default Console
