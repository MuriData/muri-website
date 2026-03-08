import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './UseCases.css'

const cases = [
  {
    icon: '◈',
    title: 'dApp Storage',
    description:
      'Move user data, media, and app state off-chain without adding a centralized backend. Hot retrieval means your dApp stays fast.',
    area: 'dapp',
    variant: 'light',
  },
  {
    icon: '◎',
    title: 'NFT & Metadata',
    description:
      'Assets are publicly retrievable via IPFS; anyone can fetch your NFT images and metadata directly, not just the uploader.',
    area: 'nft',
    variant: 'teal',
  },
  {
    icon: '⬢',
    title: 'Data Archival',
    description:
      'Cost-effective long-term storage with economic guarantees. Nodes are financially committed, so walking away means losing their stake.',
    area: 'archive',
    variant: 'dark',
  },
  {
    icon: '⟡',
    title: 'Gaming Assets',
    description:
      'Store maps, replays, and player data with low-latency IPFS retrieval. No loading screens waiting on cold storage unsealing.',
    area: 'gaming',
    variant: 'light',
  },
  {
    icon: '◇',
    title: 'AI & ML Datasets',
    description:
      'Store large training sets affordably across many nodes. Permissionless access means any pipeline can fetch data directly.',
    area: 'ai',
    variant: 'mint',
  },
  {
    icon: '⊞',
    title: 'Static Websites',
    description:
      'Host frontends and static sites on IPFS-backed storage. Content is publicly accessible to any browser, giving you decentralized hosting with guaranteed uptime.',
    area: 'web',
    variant: 'light',
  },
]

function UseCases() {
  const [dragging, setDragging] = useState(false)
  const navigate = useNavigate()

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer?.files?.[0]
    navigate('/console', { state: file ? { file } : { openPicker: true } })
  }, [navigate])

  return (
    <div className="usecases-mosaic">
      <div className="usecases-tile usecases-tile--heading">
        <span className="usecases-tile__label">Use Cases</span>
        <h2 className="usecases-tile__heading">Who Is MuriData For?</h2>
        <p className="usecases-tile__intro">
          Any application that needs provably available off-chain storage.
        </p>
      </div>

      {cases.map((c) => (
        <div
          className={`usecases-tile usecases-tile--${c.area} usecases-tile--${c.variant}`}
          key={c.title}
        >
          <div className="usecases-tile__top">
            <span className="usecases-tile__icon">{c.icon}</span>
            <h4 className="usecases-tile__title">{c.title}</h4>
          </div>
          <p className="usecases-tile__desc">{c.description}</p>
        </div>
      ))}

      <div
        className={`usecases-upload${dragging ? ' usecases-upload--active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => navigate('/console', { state: { openPicker: true } })}
      >
        <span className="usecases-upload__icon">⇧</span>
        <span className="usecases-upload__text">
          {dragging ? 'Drop to upload' : 'Drag a file here or click to upload'}
        </span>
      </div>
    </div>
  )
}

export default UseCases
