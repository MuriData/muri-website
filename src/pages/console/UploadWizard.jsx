import { useState, useRef, useCallback, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useFileUpload } from '../../hooks/useFileUpload'
import { useStorageActions } from '../../hooks/useStorageActions'
import { useWasm } from '../../hooks/useWasm'
import { formatMuri, formatChunks } from '../../hooks/useDashboardData'
import { ipfsGatewayUrl, isRawBlockUri } from '../../lib/config'

function IconFile() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 2h7l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" />
      <path d="M12 2v4h4" />
    </svg>
  )
}

function IconUploadCloud() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 28a8 8 0 01-1-15.9A10 10 0 0130 16a8 8 0 01-2 12" />
      <path d="M20 22v-10" /><path d="M16 16l4-4 4 4" />
    </svg>
  )
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function IconLink() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 23l-3 3a5 5 0 01-7-7l3-3" />
      <path d="M23 17l3-3a5 5 0 017 7l-3 3" />
      <path d="M16 24l8-8" />
    </svg>
  )
}

// Basic CID format validation: CIDv0 (Qm, 46 base58 chars) or CIDv1 (bafy/bafk prefix, base32)
// Also allows CID + path like "QmHash/path/to/file"
function isValidCid(s) {
  if (!s) return false
  const root = s.split('/')[0]
  if (/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(root)) return true
  if (/^b[a-z2-7]{58,}$/i.test(root)) return true
  return false
}

// MURI ↔ Wei conversion (18 decimals)
const MURI_DECIMALS = 10n ** 18n

function muriToWei(muriStr) {
  if (!muriStr || muriStr === '') return '0'
  const parts = muriStr.split('.')
  const whole = parts[0] || '0'
  const frac = (parts[1] || '').padEnd(18, '0').slice(0, 18)
  return (BigInt(whole) * MURI_DECIMALS + BigInt(frac)).toString()
}

// Elapsed time hook for proof generation progress
function useElapsedTime(isRunning) {
  const startRef = useRef(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isRunning) return
    startRef.current = Date.now()
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => { clearInterval(interval); setElapsed(0) }
  }, [isRunning])

  return isRunning ? elapsed : 0
}

function formatElapsed(seconds) {
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

const STEPS_UPLOAD = ['Select File', 'Upload to IPFS', 'Generate Proof', 'Configure', 'Submit']
const STEPS_IMPORT = ['Enter CID', 'Fetch from IPFS', 'Generate Proof', 'Configure', 'Submit']

function Stepper({ current, steps }) {
  return (
    <div className="wizard-stepper">
      {steps.map((label, i) => {
        const isDone = i < current
        const isActive = i === current
        return (
          <div key={label} style={{ display: 'contents' }}>
            <div className={`wizard-step${isActive ? ' wizard-step--active' : isDone ? ' wizard-step--done' : ''}`}>
              <span className="wizard-step__dot">{isDone ? '✓' : i + 1}</span>
              <span>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`wizard-step__line${isDone ? ' wizard-step__line--done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function UploadWizard({ ipfs }) {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [inputMode, setInputMode] = useState('upload') // 'upload' | 'import'
  const [uriInput, setUriInput] = useState('')
  const { state: uploadState, file, cid, setCid, numChunks, error: uploadError, selectFile, uploadToIpfs, importFromCid, reset: resetUpload } = useFileUpload(ipfs.upload)

  // Consume navigation state (file from drag or openPicker flag from click)
  const location = useLocation()
  const nav = useNavigate()
  useEffect(() => {
    const navState = location.state
    if (!navState) return
    // Clear state so it doesn't re-trigger on re-render / back navigation
    nav(location.pathname, { replace: true, state: null })
    if (navState.file) {
      selectFile(navState.file)
    } else if (navState.openPicker) {
      fileInputRef.current?.click()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // WASM-powered file root + FSP proof
  const wasm = useWasm()
  const proofElapsed = useElapsedTime(wasm.isComputing)

  // Order config
  const [periodsInput, setPeriodsInput] = useState('4')
  const [replicasInput, setReplicasInput] = useState('3')
  const [priceMuri, setPriceMuri] = useState('0.0001')
  const priceWei = muriToWei(priceMuri)

  const periods = Number(periodsInput) || 0
  const replicas = Number(replicasInput) || 0

  // Transaction
  const { placeOrder, isPending, isConfirming, isSuccess, error: txError, reset: resetTx } = useStorageActions()

  // Refresh order list immediately after successful submission
  const queryClient = useQueryClient()
  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries()
    }
  }, [isSuccess, queryClient])

  // Determine current step
  let step = 0
  if (uploadState === 'selected') step = 0
  if (uploadState === 'uploading') step = 1
  if (uploadState === 'uploaded' && !wasm.proof) step = 2
  if (uploadState === 'uploaded' && wasm.proof && !isPending && !isConfirming && !isSuccess) step = 3
  if (isPending || isConfirming) step = 4
  if (isSuccess) step = 5

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer?.files?.[0]
    if (f) selectFile(f)
  }, [selectFile])

  const handleFileSelect = useCallback((e) => {
    const f = e.target.files?.[0]
    if (f) selectFile(f)
  }, [selectFile])

  // Compute root + FSP proof via WASM
  const handleComputeRoot = async () => {
    if (!file) return
    await wasm.generateProof(file)
  }

  const actualNumChunks = wasm.numChunks || numChunks

  const escrow = actualNumChunks > 0 && priceWei
    ? BigInt(actualNumChunks) * BigInt(periods) * BigInt(replicas) * BigInt(priceWei)
    : 0n

  // Detect if user is importing a raw block CID (e.g. "QmHash?type=raw")
  const rawBlock = isRawBlockUri(uriInput) || isRawBlockUri(cid)

  const handleSubmit = () => {
    const uri = rawBlock ? `ipfs://${cid}?type=raw` : `ipfs://${cid}`
    placeOrder({
      root: wasm.root,
      uri,
      numChunks: actualNumChunks,
      periods,
      replicas,
      pricePerChunkPerPeriod: priceWei,
      fspProof: wasm.proof,
    })
  }

  // Parse IPFS URI → full ref (CID + optional path), stripping query params for IPFS fetch.
  const parseRef = (uri) => {
    let s = uri.trim()
    if (s.startsWith('ipfs://')) s = s.slice(7)
    const qIdx = s.indexOf('?')
    if (qIdx >= 0) s = s.slice(0, qIdx)
    if (!s || s === '/') return ''
    return s
  }

  const handleImport = () => {
    const ref = parseRef(uriInput)
    if (!ref) return
    // Use block/get for raw block URIs (directory DAG nodes), cat for normal files
    const fetcher = isRawBlockUri(uriInput) ? ipfs.fetchBlock : ipfs.fetchFile
    importFromCid(ref, fetcher)
  }

  const handleReset = () => {
    resetUpload()
    resetTx()
    wasm.reset()
    setPeriodsInput('4')
    setReplicasInput('3')
    setPriceMuri('0.0001')
    setUriInput('')
  }

  return (
    <div className="console-panel">
      <h2 className="console-panel__title">
        <span className="console-panel__title-icon"><IconFile /></span>
        Upload File
      </h2>

      <div className="upload-wizard">
        <Stepper current={step} steps={inputMode === 'import' ? STEPS_IMPORT : STEPS_UPLOAD} />

        {/* Step 0: Mode toggle + File selection or CID input */}
        {uploadState === 'idle' && (
          <>
            <div className="ipfs-bar__mode-toggle" style={{ justifySelf: 'center' }}>
              <button
                className={`ipfs-bar__mode-btn${inputMode === 'upload' ? ' ipfs-bar__mode-btn--active' : ''}`}
                onClick={() => setInputMode('upload')}
              >
                Upload File
              </button>
              <button
                className={`ipfs-bar__mode-btn${inputMode === 'import' ? ' ipfs-bar__mode-btn--active' : ''}`}
                onClick={() => setInputMode('import')}
              >
                Import from IPFS
              </button>
            </div>

            {!ipfs.isConnected && (
              <div className="ipfs-required-banner">
                <span className="ipfs-required-banner__icon" aria-hidden="true">&#9888;</span>
                Connect to IPFS above before uploading. Files need an IPFS connection to be stored on the network.
              </div>
            )}

            {inputMode === 'upload' && (
              <div
                className={`drop-zone${dragOver ? ' drop-zone--dragover' : ''}${!ipfs.isConnected ? ' drop-zone--disabled' : ''}`}
                onDragOver={(e) => { e.preventDefault(); if (ipfs.isConnected) setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { if (ipfs.isConnected) handleDrop(e); else e.preventDefault() }}
                onClick={() => ipfs.isConnected && fileInputRef.current?.click()}
                role="button"
                tabIndex={ipfs.isConnected ? 0 : -1}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ipfs.isConnected && fileInputRef.current?.click() } }}
                aria-label="Select file for upload"
                aria-disabled={!ipfs.isConnected}
                style={!ipfs.isConnected ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
              >
                <div className="drop-zone__icon" aria-hidden="true"><IconUploadCloud /></div>
                <p className="drop-zone__text">
                  Drag and drop a file, or <strong>browse</strong>
                </p>
                <p className="drop-zone__text" style={{ fontSize: '0.75rem' }}>
                  Files are chunked into 16 KB pieces and stored across IPFS nodes
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            )}

            {inputMode === 'import' && (
              <div className="drop-zone" style={!ipfs.isConnected ? { opacity: 0.5 } : undefined}>
                <div className="drop-zone__icon" aria-hidden="true"><IconLink /></div>
                <p className="drop-zone__text">
                  Enter an IPFS CID or URI to fetch and place a storage order
                </p>
                <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '480px' }}>
                  <input
                    className="form-input form-input--mono"
                    type="text"
                    value={uriInput}
                    onChange={(e) => setUriInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                    placeholder="ipfs://Qm... or bare CID"
                    style={{ flex: 1 }}
                    disabled={!ipfs.isConnected}
                    aria-label="IPFS CID or URI"
                  />
                  <button
                    className="console-btn console-btn--primary"
                    onClick={handleImport}
                    disabled={!parseRef(uriInput) || !ipfs.isConnected}
                  >
                    Fetch
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* File selected — show info */}
        {file && uploadState !== 'idle' && (
          <div className="file-info">
            <div className="file-info__icon"><IconFile /></div>
            <div className="file-info__details">
              <div className="file-info__name">{file.name}</div>
              <div className="file-info__meta">
                {formatBytes(file.size)} · {numChunks} chunks · {formatChunks(BigInt(numChunks))}
              </div>
            </div>
            {!isPending && !isConfirming && !isSuccess && (
              <button className="file-info__remove" onClick={handleReset}>Remove</button>
            )}
          </div>
        )}

        {/* Step 1: Upload to IPFS */}
        {uploadState === 'selected' && ipfs.isConnected && (
          <button className="console-btn console-btn--primary" onClick={uploadToIpfs}>
            Upload to IPFS
          </button>
        )}

        {uploadState === 'selected' && !ipfs.isConnected && (
          <p className="console-empty">Connect to IPFS first using the bar above</p>
        )}

        {uploadState === 'uploading' && (
          <button className="console-btn console-btn--primary" disabled>
            <span className="console-btn__spinner" />
            {inputMode === 'import' ? 'Fetching from IPFS...' : 'Uploading to IPFS...'}
          </button>
        )}

        {uploadError && (
          <div className="tx-status tx-status--error">{uploadError}</div>
        )}

        {/* CID display — editable */}
        {cid != null && (
          <>
            <div className={`cid-display${!isValidCid(cid) ? ' cid-display--invalid' : ''}`}>
              <span className="cid-display__label">CID</span>
              <input
                className="cid-display__input"
                type="text"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
              />
            </div>
            {!isValidCid(cid) && (
              <div className="tx-status tx-status--error" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                Invalid CID format — expected CIDv0 (Qm...) or CIDv1 (bafy...)
              </div>
            )}
          </>
        )}

        {/* Step 2: Compute Merkle root + FSP proof via WASM */}
        {uploadState === 'uploaded' && !wasm.proof && !wasm.isComputing && (
          <>
            <div className="compute-explanation">
              <span className="compute-explanation__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="6" /><path d="M8 5v3" /><circle cx="8" cy="11" r="0.5" fill="currentColor" />
                </svg>
              </span>
              <span>
                Your file will be hashed into a Merkle tree to generate a unique root and a cryptographic file-size proof.
                This verifies file integrity on-chain without revealing your data. May take 30-60 seconds for larger files.
              </span>
            </div>
            <button
              className="console-btn console-btn--primary"
              onClick={handleComputeRoot}
            >
              Generate Proof
            </button>
          </>
        )}

        {/* WASM computing — three-stage progress with elapsed time */}
        {wasm.isComputing && (
          <div className="proof-progress" role="status" aria-live="polite">
            {(() => {
              const stages = ['hashing', 'root', 'proof']
              const labels = [
                `Hashing chunks${wasm.hashWorkers > 0 ? ` (${wasm.hashWorkers} workers)` : ''}`,
                'Building Merkle tree',
                'Generating file-size proof',
              ]
              const idx = stages.indexOf(wasm.stage)
              return stages.map((s, i) => {
                const isDone = i < idx
                const isActive = i === idx
                return (
                  <div key={s} className={`proof-progress__step${isActive ? ' proof-progress__step--active' : isDone ? ' proof-progress__step--done' : ''}`}>
                    {isActive
                      ? <span className="tx-status__spinner" />
                      : isDone
                        ? <span className="proof-progress__check" aria-hidden="true">✓</span>
                        : <span className="proof-progress__dot">{i + 1}</span>
                    }
                    <span>{labels[i]}</span>
                    {isDone && s === 'hashing' && wasm.numChunks > 0 && (
                      <span className="proof-progress__detail">{wasm.numChunks} chunks</span>
                    )}
                    {isActive && proofElapsed > 0 && (
                      <span className="proof-progress__elapsed">{formatElapsed(proofElapsed)}</span>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        )}

        {wasm.error && (
          <div className="tx-status tx-status--error">{wasm.error}</div>
        )}

        {/* Root computed — show result */}
        {wasm.root && (
          <div className="cid-display">
            <span className="cid-display__label">Root</span>
            {'0x' + BigInt(wasm.root).toString(16)}
          </div>
        )}

        {wasm.proof && (
          <div className="tx-status tx-status--success">
            Root & Proof generated successfully ({wasm.numChunks} chunks verified)
          </div>
        )}

        {/* Step 3: Order configuration */}
        {uploadState === 'uploaded' && wasm.proof && !isPending && !isConfirming && !isSuccess && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Storage Periods</label>
                <input
                  className="form-input"
                  type="number"
                  min={1}
                  max={52}
                  value={periodsInput}
                  onChange={(e) => setPeriodsInput(e.target.value)}
                />
                <span className="form-hint">{periods * 7} days ({periods} weeks)</span>
              </div>
              <div className="form-group">
                <label className="form-label">Replicas</label>
                <input
                  className="form-input"
                  type="number"
                  min={1}
                  max={10}
                  value={replicasInput}
                  onChange={(e) => setReplicasInput(e.target.value)}
                />
                <span className="form-hint">{replicas} storage nodes</span>
              </div>
              <div className="form-group">
                <label className="form-label">Price / Chunk / Period</label>
                <div className="price-input-group">
                  <input
                    className="price-input-group__input"
                    type="text"
                    value={priceMuri}
                    onChange={(e) => setPriceMuri(e.target.value)}
                    placeholder="0.0001"
                    aria-label="Price per chunk per period in MURI"
                  />
                  <span className="price-input-group__unit price-input-group__unit--active">MURI</span>
                </div>
                <span className="form-hint">{formatMuri(BigInt(priceWei || '0'))} MURI per chunk per period</span>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="cost-breakdown">
              <div className="cost-row">
                <span>File size</span>
                <span className="cost-row__value">{file ? formatBytes(file.size) : '—'} ({actualNumChunks} chunks)</span>
              </div>
              <div className="cost-row">
                <span>Duration</span>
                <span className="cost-row__value">{periods * 7} days</span>
              </div>
              <div className="cost-row">
                <span>Replicas</span>
                <span className="cost-row__value">{replicas}x</span>
              </div>
              <div className="cost-row">
                <span>Price per chunk per period</span>
                <span className="cost-row__value">{formatMuri(BigInt(priceWei || '0'))} MURI</span>
              </div>
              <div className="cost-row">
                <span>Total Escrow</span>
                <span className="cost-row__value">{formatMuri(escrow)} MURI</span>
              </div>
            </div>

            <button className="console-btn console-btn--primary" onClick={handleSubmit} disabled={!isValidCid(cid)}>
              Place Order — {formatMuri(escrow)} MURI
            </button>
          </>
        )}

        {/* Step 4: Transaction status */}
        {isPending && (
          <div className="tx-status tx-status--pending">
            <span className="tx-status__spinner" />
            Confirm transaction in your wallet...
          </div>
        )}

        {isConfirming && (
          <div className="tx-status tx-status--pending">
            <span className="tx-status__spinner" />
            Waiting for confirmation...
          </div>
        )}

        {isSuccess && (
          <>
            <div className="tx-status tx-status--success">
              Order placed successfully!
            </div>

            {/* Public gateway URL */}
            {cid && ipfsGatewayUrl(`ipfs://${cid}`) && (
              <div className="success-file-url">
                <div className="success-file-url__header">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3" />
                    <path d="M10 2h4v4" />
                    <path d="M7 9L14 2" />
                  </svg>
                  Your file is available at
                </div>
                <div className="success-file-url__url">
                  <a
                    href={ipfsGatewayUrl(`ipfs://${cid}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ipfsGatewayUrl(`ipfs://${cid}`)}
                  </a>
                  <button
                    className="success-file-url__copy"
                    onClick={() => navigator.clipboard.writeText(ipfsGatewayUrl(`ipfs://${cid}`))}
                    title="Copy URL"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="5" width="9" height="9" rx="1" />
                      <path d="M11 5V3a1 1 0 00-1-1H3a1 1 0 00-1 1v7a1 1 0 001 1h2" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Seeding indicator for browser IPFS (upload mode only) */}
            {ipfs.mode === 'browser' && inputMode === 'upload' && (
              <div className="seeding-status">
                <div className="seeding-status__header">
                  <span className="seeding-status__dot" />
                  Seeding file from your browser
                </div>
                <p className="seeding-status__text">
                  Keep this tab open until storage nodes pick up your file.
                  Nodes will fetch the data from your browser IPFS node to fill the order.
                </p>
              </div>
            )}

            <div className="success-actions">
              <Link to="/dashboard" className="console-btn console-btn--primary">
                View on Dashboard
              </Link>
              <button className="console-btn console-btn--secondary" onClick={handleReset}>
                Upload Another File
              </button>
            </div>
          </>
        )}

        {txError && (
          <div className="tx-status tx-status--error">
            {txError.shortMessage || txError.message || 'Transaction failed'}
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadWizard
