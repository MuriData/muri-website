import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useValidatorManager, ValidatorStatus } from '../../hooks/useValidatorManager'
import { useValidatorWizard } from '../../hooks/useValidatorWizard'
import { VALIDATOR_MANAGER_ADDRESS, VALIDATOR_MANAGER_ABI } from '../../lib/contracts'
import { isCoreAvailable } from '../../lib/avalancheWallet'

const VM_CONTRACT = {
  address: VALIDATOR_MANAGER_ADDRESS,
  abi: VALIDATOR_MANAGER_ABI,
}

// ── Status badge helper ──
function statusBadgeClass(label) {
  switch (label) {
    case 'Active': return 'explorer-badge--active'
    case 'PendingAdded':
    case 'PendingRemoved': return 'explorer-badge--tx'
    case 'Completed': return 'explorer-badge--empty'
    case 'Invalidated': return 'explorer-badge--offline'
    default: return 'explorer-badge--empty'
  }
}

// ── Step indicator ──
const REGISTER_STEPS = ['Form', 'Initiate on L1', 'Aggregate Warp', 'P-Chain Tx', 'Complete on L1', 'Done']
const REMOVE_STEPS = ['Select', 'Initiate on L1', 'Aggregate Warp', 'P-Chain Tx', 'Complete on L1', 'Done']

function StepIndicator({ steps, currentStep }) {
  const stepMap = { form: 0, initiate: 1, aggregate: 2, pchain: 3, complete: 4, done: 5 }
  const currentIdx = stepMap[currentStep] ?? 0

  return (
    <div className="vm-steps">
      {steps.map((label, i) => (
        <div
          key={i}
          className={`vm-step${i < currentIdx ? ' vm-step--done' : ''}${i === currentIdx ? ' vm-step--active' : ''}`}
        >
          <span className="vm-step__num">{i < currentIdx ? '\u2713' : i + 1}</span>
          <span className="vm-step__label">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Registration Wizard ──
function RegisterWizard({ wizard, enrichedValidators }) {
  const [formData, setFormData] = useState({ nodeID: '', blsPublicKey: '', weight: '', initialBalance: '0.1' })

  // L1 initiate tx
  const { writeContract, data: initHash, isPending: initPending, error: initError } = useWriteContract()
  const { isLoading: initConfirming, isSuccess: initSuccess } = useWaitForTransactionReceipt({ hash: initHash })

  // L1 complete tx
  const { writeContract: writeComplete, data: completeHash, isPending: completePending, error: completeError } = useWriteContract()
  const { isLoading: completeConfirming, isSuccess: completeSuccess } = useWaitForTransactionReceipt({ hash: completeHash })

  // When L1 initiate tx confirms, advance wizard
  if (initSuccess && wizard.step === 'initiate' && initHash) {
    wizard.onL1TxConfirmed(initHash)
  }

  // When L1 complete tx confirms, advance wizard
  if (completeSuccess && wizard.step === 'complete') {
    wizard.onCompleteTxConfirmed()
  }

  return (
    <div className="vm-wizard">
      <div className="vm-wizard__header">
        <h3>Register New Validator</h3>
        <button className="vm-action-cancel" onClick={wizard.reset}>&times;</button>
      </div>

      <StepIndicator steps={REGISTER_STEPS} currentStep={wizard.step} />

      {/* Step 1: Form */}
      {wizard.step === 'form' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">Enter the validator details. The node must be running and have a registered BLS public key.</p>
          <div className="vm-action-form">
            <label className="vm-form-label">Node ID <span>(0x prefix, 20 bytes)</span></label>
            <input placeholder="0x..." value={formData.nodeID} onChange={(e) => setFormData({ ...formData, nodeID: e.target.value })} />

            <label className="vm-form-label">BLS Public Key <span>(0x prefix, 48 bytes)</span></label>
            <input placeholder="0x..." value={formData.blsPublicKey} onChange={(e) => setFormData({ ...formData, blsPublicKey: e.target.value })} />

            <label className="vm-form-label">Weight</label>
            <input type="number" placeholder="e.g. 100" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />

            <label className="vm-form-label">Initial P-Chain Balance (AVAX)</label>
            <input type="number" step="0.01" placeholder="0.1" value={formData.initialBalance} onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })} />

            <button
              className="vm-action-submit"
              disabled={!formData.nodeID || !formData.blsPublicKey || !formData.weight}
              onClick={() => {
                // Connect Core in background (needed later for P-Chain step)
                wizard.connectCore()
                // Submit L1 initiate tx
                writeContract({
                  ...VM_CONTRACT,
                  functionName: 'initiateValidatorRegistration',
                  args: [
                    formData.nodeID,
                    formData.blsPublicKey,
                    BigInt(Math.floor(Date.now() / 1000) + 86400), // 24h expiry
                    { threshold: 0, addresses: [] },
                    { threshold: 0, addresses: [] },
                    BigInt(formData.weight),
                  ],
                })
                // Advance wizard to show waiting UI
                wizard.onL1TxSubmitted()
              }}
            >
              Initiate Registration
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Waiting for L1 tx */}
      {wizard.step === 'initiate' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">
            {initPending ? 'Confirm the transaction in your wallet...' :
             initConfirming ? 'Waiting for L1 transaction confirmation...' :
             initError ? 'Transaction failed.' :
             'Submitting initiateValidatorRegistration to L1...'}
          </p>
          {initHash && <p className="vm-wizard__hash">Tx: {initHash.slice(0, 14)}...{initHash.slice(-10)}</p>}
          {initError && <p className="vm-action-error">{initError.shortMessage || initError.message}</p>}
        </div>
      )}

      {/* Step 3: Aggregate Warp signatures */}
      {wizard.step === 'aggregate' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">
            L1 transaction confirmed. Now aggregating BLS signatures from L1 validators over the Warp message.
          </p>
          <p className="vm-wizard__hash">L1 Tx: {wizard.l1TxHash?.slice(0, 14)}...{wizard.l1TxHash?.slice(-10)}</p>
          <button className="vm-action-submit" onClick={wizard.aggregateSignatures}>
            Aggregate Warp Signatures
          </button>
          {wizard.error && <p className="vm-action-error">{wizard.error}</p>}
        </div>
      )}

      {/* Step 4: P-Chain tx */}
      {wizard.step === 'pchain' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">
            Warp signatures aggregated. Sign and submit the RegisterL1ValidatorTx to the P-Chain via Core wallet.
          </p>
          <p className="vm-wizard__detail">Initial Balance: {formData.initialBalance} AVAX</p>
          <button
            className="vm-action-submit"
            onClick={() => wizard.submitPChainTx({ initialBalanceAvax: Number(formData.initialBalance) })}
          >
            Sign & Submit to P-Chain
          </button>
          {wizard.error && <p className="vm-action-error">{wizard.error}</p>}
        </div>
      )}

      {/* Step 5: Complete on L1 */}
      {wizard.step === 'complete' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">
            P-Chain transaction confirmed. Now complete the registration on the L1.
            The Warp acknowledgement will be aggregated and submitted.
          </p>
          {wizard.pChainTxHash && (
            <p className="vm-wizard__hash">P-Chain Tx: {wizard.pChainTxHash}</p>
          )}
          <button
            className="vm-action-submit"
            disabled={completePending || completeConfirming}
            onClick={() => {
              writeComplete({
                ...VM_CONTRACT,
                functionName: 'completeValidatorRegistration',
                args: [0], // messageIndex 0 (first Warp message in access list)
              })
            }}
          >
            {completePending ? 'Confirm in wallet...' : completeConfirming ? 'Confirming...' : 'Complete Registration'}
          </button>
          {completeError && <p className="vm-action-error">{completeError.shortMessage || completeError.message}</p>}
        </div>
      )}

      {/* Step 6: Done */}
      {wizard.step === 'done' && (
        <div className="vm-wizard__body">
          <p className="vm-action-success vm-wizard__success">
            Validator registered successfully!
          </p>
          <button className="vm-action-cancel" onClick={wizard.reset}>Close</button>
        </div>
      )}
    </div>
  )
}

// ── Remove Validator Wizard ──
function RemoveWizard({ wizard, enrichedValidators }) {
  const [selectedValidator, setSelectedValidator] = useState('')

  const { writeContract, data: initHash, isPending: initPending, error: initError } = useWriteContract()
  const { isLoading: initConfirming, isSuccess: initSuccess } = useWaitForTransactionReceipt({ hash: initHash })

  const { writeContract: writeComplete, data: completeHash, isPending: completePending, error: completeError } = useWriteContract()
  const { isLoading: completeConfirming, isSuccess: completeSuccess } = useWaitForTransactionReceipt({ hash: completeHash })

  if (initSuccess && wizard.step === 'initiate' && initHash) {
    wizard.onL1TxConfirmed(initHash)
  }

  if (completeSuccess && wizard.step === 'complete') {
    wizard.onCompleteTxConfirmed()
  }

  const activeValidators = enrichedValidators.filter(v => v.onChain?.statusLabel === 'Active')

  return (
    <div className="vm-wizard">
      <div className="vm-wizard__header">
        <h3>Remove Validator</h3>
        <button className="vm-action-cancel" onClick={wizard.reset}>&times;</button>
      </div>

      <StepIndicator steps={REMOVE_STEPS} currentStep={wizard.step} />

      {wizard.step === 'form' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">Select the validator to remove from the L1.</p>
          <div className="vm-action-form">
            <select value={selectedValidator} onChange={(e) => setSelectedValidator(e.target.value)}>
              <option value="">Select validator...</option>
              {activeValidators.map(v => (
                <option key={v.validationID} value={v.validationID}>
                  {v.nodeID.length > 24 ? `${v.nodeID.slice(0, 16)}...${v.nodeID.slice(-8)}` : v.nodeID} (w: {v.onChain?.weight ?? v.weight})
                </option>
              ))}
            </select>
            <button
              className="vm-action-submit"
              disabled={!selectedValidator}
              onClick={() => {
                wizard.connectCore()
                writeContract({
                  ...VM_CONTRACT,
                  functionName: 'initiateValidatorRemoval',
                  args: [selectedValidator],
                })
                wizard.onL1TxSubmitted()
              }}
            >
              Initiate Removal
            </button>
          </div>
        </div>
      )}

      {wizard.step === 'initiate' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">
            {initPending ? 'Confirm in wallet...' : initConfirming ? 'Waiting for confirmation...' : 'Submitting...'}
          </p>
          {initHash && <p className="vm-wizard__hash">Tx: {initHash.slice(0, 14)}...{initHash.slice(-10)}</p>}
          {initError && <p className="vm-action-error">{initError.shortMessage || initError.message}</p>}
        </div>
      )}

      {wizard.step === 'aggregate' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">L1 transaction confirmed. Aggregating Warp signatures...</p>
          <button className="vm-action-submit" onClick={wizard.aggregateSignatures}>
            Aggregate Warp Signatures
          </button>
          {wizard.error && <p className="vm-action-error">{wizard.error}</p>}
        </div>
      )}

      {wizard.step === 'pchain' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">Submit the weight-zero update to the P-Chain via Core wallet.</p>
          <button className="vm-action-submit" onClick={() => wizard.submitPChainTx()}>
            Sign & Submit to P-Chain
          </button>
          {wizard.error && <p className="vm-action-error">{wizard.error}</p>}
        </div>
      )}

      {wizard.step === 'complete' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">P-Chain confirmed. Complete the removal on the L1.</p>
          <button
            className="vm-action-submit"
            disabled={completePending || completeConfirming}
            onClick={() => {
              writeComplete({
                ...VM_CONTRACT,
                functionName: 'completeValidatorRemoval',
                args: [0],
              })
            }}
          >
            {completePending ? 'Confirm in wallet...' : completeConfirming ? 'Confirming...' : 'Complete Removal'}
          </button>
          {completeError && <p className="vm-action-error">{completeError.shortMessage || completeError.message}</p>}
        </div>
      )}

      {wizard.step === 'done' && (
        <div className="vm-wizard__body">
          <p className="vm-action-success vm-wizard__success">Validator removed successfully!</p>
          <button className="vm-action-cancel" onClick={wizard.reset}>Close</button>
        </div>
      )}
    </div>
  )
}

// ── Main ValidatorsTab ──
export default function ValidatorsTab({ validators, valsLoading, valsError }) {
  const { address } = useAccount()
  const wizard = useValidatorWizard()

  const {
    totalWeight,
    subnetID,
    owner,
    isOwner,
    initialized,
    churnTracker,
    enrichedValidators,
    isLoading: vmLoading,
  } = useValidatorManager(validators)

  const activeCount = enrichedValidators.filter(v => v.onChain?.statusLabel === 'Active').length
  const pendingCount = enrichedValidators.filter(v =>
    v.onChain?.statusLabel === 'PendingAdded' || v.onChain?.statusLabel === 'PendingRemoved'
  ).length

  const hasCoreWallet = isCoreAvailable()

  return (
    <div className="explorer-panel">
      {/* L1 Network Stats Bar */}
      <div className="vm-network-bar">
        <div className="vm-network-bar__stat">
          <span className="vm-network-bar__label">Total Weight</span>
          <span className="vm-network-bar__value">{totalWeight?.toLocaleString() ?? '...'}</span>
        </div>
        <div className="vm-network-bar__stat">
          <span className="vm-network-bar__label">Validators</span>
          <span className="vm-network-bar__value">{valsLoading ? '...' : validators.length}</span>
        </div>
        <div className="vm-network-bar__stat">
          <span className="vm-network-bar__label">Active</span>
          <span className="vm-network-bar__value">{vmLoading ? '...' : activeCount}</span>
        </div>
        {pendingCount > 0 && (
          <div className="vm-network-bar__stat">
            <span className="vm-network-bar__label">Pending</span>
            <span className="vm-network-bar__value">{pendingCount}</span>
          </div>
        )}
        <div className="vm-network-bar__stat">
          <span className="vm-network-bar__label">Initialized</span>
          <span className="vm-network-bar__value">{initialized ? 'Yes' : 'No'}</span>
        </div>
        {churnTracker && churnTracker.churnAmount > 0 && (
          <div className="vm-network-bar__stat">
            <span className="vm-network-bar__label">Churn</span>
            <span className="vm-network-bar__value">{churnTracker.churnAmount} / {churnTracker.initialWeight}</span>
          </div>
        )}
        {subnetID && (
          <div className="vm-network-bar__stat vm-network-bar__stat--wide">
            <span className="vm-network-bar__label">Subnet ID</span>
            <span className="vm-network-bar__value explorer-mono">{subnetID.slice(0, 14)}...{subnetID.slice(-10)}</span>
          </div>
        )}
      </div>

      {/* Owner actions */}
      {isOwner && wizard.step === 'idle' && (
        <div className="vm-owner-panel">
          <h3 className="vm-owner-panel__title">
            Owner Actions
            {!hasCoreWallet && <span className="vm-core-warning"> (Core wallet required for P-Chain operations)</span>}
          </h3>
          <div className="vm-owner-panel__buttons">
            <button
              className="vm-action-btn"
              disabled={!hasCoreWallet}
              onClick={() => wizard.startRegister()}
            >
              Register Validator
            </button>
            <button
              className="vm-action-btn"
              disabled={!hasCoreWallet || activeCount === 0}
              onClick={wizard.startRemove}
            >
              Remove Validator
            </button>
          </div>
          {!hasCoreWallet && (
            <p className="vm-core-install">
              Install <a href="https://core.app" target="_blank" rel="noopener noreferrer">Core wallet</a> to manage validators. Core provides P-Chain transaction signing required for the Warp message relay.
            </p>
          )}
        </div>
      )}

      {/* Active wizard */}
      {wizard.step !== 'idle' && wizard.operation === 'register' && (
        <RegisterWizard wizard={wizard} enrichedValidators={enrichedValidators} />
      )}
      {wizard.step !== 'idle' && wizard.operation === 'remove' && (
        <RemoveWizard wizard={wizard} enrichedValidators={enrichedValidators} />
      )}

      {/* Validator list */}
      {valsLoading ? (
        <div className="explorer-loading"><div className="explorer-loading__spinner" /></div>
      ) : valsError ? (
        <p className="explorer-empty">Unable to fetch validators: {valsError}</p>
      ) : validators.length === 0 ? (
        <p className="explorer-empty">No validators found for this L1</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="explorer-table-wrap explorer-desktop">
            <table className="explorer-table">
              <thead>
                <tr>
                  <th>Node ID</th>
                  <th>Status</th>
                  <th>Weight</th>
                  <th>Balance</th>
                  <th>Validation ID</th>
                  <th>Start</th>
                  <th>BLS Public Key</th>
                </tr>
              </thead>
              <tbody>
                {enrichedValidators.map((v) => (
                  <tr key={v.nodeID}>
                    <td className="explorer-mono">{v.nodeID.length > 24 ? `${v.nodeID.slice(0, 16)}...${v.nodeID.slice(-8)}` : v.nodeID}</td>
                    <td>
                      {v.onChain ? (
                        <span className={`explorer-badge ${statusBadgeClass(v.onChain.statusLabel)}`}>
                          {v.onChain.statusLabel}
                        </span>
                      ) : (
                        <span className="explorer-badge explorer-badge--active">Active</span>
                      )}
                    </td>
                    <td>
                      <span className="explorer-badge explorer-badge--tx">{v.onChain?.weight ?? v.weight}</span>
                    </td>
                    <td>{(Number(v.balance) / 1e9).toLocaleString(undefined, { maximumFractionDigits: 4 })} AVAX</td>
                    <td className="explorer-mono">{v.validationID ? `${v.validationID.slice(0, 12)}...${v.validationID.slice(-6)}` : '—'}</td>
                    <td>{v.onChain?.startTime ? new Date(v.onChain.startTime * 1000).toLocaleDateString() : new Date(v.startTime * 1000).toLocaleDateString()}</td>
                    <td className="explorer-mono">{v.publicKey ? `${v.publicKey.slice(0, 14)}...${v.publicKey.slice(-8)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="explorer-cards explorer-mobile">
            {enrichedValidators.map((v) => (
              <div key={v.nodeID} className="explorer-card">
                <div className="explorer-card__head">
                  <span className="explorer-mono" style={{ fontSize: '0.7rem' }}>
                    {v.nodeID.length > 20 ? `${v.nodeID.slice(0, 14)}...${v.nodeID.slice(-6)}` : v.nodeID}
                  </span>
                  {v.onChain ? (
                    <span className={`explorer-badge ${statusBadgeClass(v.onChain.statusLabel)}`}>
                      {v.onChain.statusLabel}
                    </span>
                  ) : (
                    <span className="explorer-badge explorer-badge--active">Active</span>
                  )}
                </div>
                <div className="explorer-card__rows">
                  <div className="explorer-card__row">
                    <span>Weight</span>
                    <span className="explorer-badge explorer-badge--tx">{v.onChain?.weight ?? v.weight}</span>
                  </div>
                  <div className="explorer-card__row">
                    <span>Balance</span>
                    <span>{(Number(v.balance) / 1e9).toLocaleString(undefined, { maximumFractionDigits: 4 })} AVAX</span>
                  </div>
                  <div className="explorer-card__row">
                    <span>Start</span>
                    <span>{new Date((v.onChain?.startTime || v.startTime) * 1000).toLocaleDateString()}</span>
                  </div>
                  <div className="explorer-card__row">
                    <span>Validation ID</span>
                    <span className="explorer-mono" style={{ fontSize: '0.7rem' }}>{v.validationID ? `${v.validationID.slice(0, 10)}...${v.validationID.slice(-4)}` : '—'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
