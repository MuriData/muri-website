import { useAccount } from 'wagmi'
import './Console.css'
import StorageTab from './console/StorageTab'
import IpfsBar from './console/IpfsBar'
import { useIpfs } from '../hooks/useIpfs'
import WalletButton from '../components/WalletButton/WalletButton'

function IconUpload() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
      <path d="M10 12V3" /><path d="M6 7l4-4 4 4" />
    </svg>
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
        </div>
      </div>
    )
  }

  return (
    <div className="console">
      <div className="console-header">
        <h1 className="console-title">Storage Console</h1>
        <p className="console-subtitle">Upload files to IPFS and place storage orders on-chain</p>
      </div>
      <IpfsBar ipfs={ipfs} />
      <StorageTab ipfs={ipfs} />
    </div>
  )
}

export default Console
