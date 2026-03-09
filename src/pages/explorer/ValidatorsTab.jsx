import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useValidatorManager, ValidatorStatus } from '../../hooks/useValidatorManager'
import { useValidatorWizard } from '../../hooks/useValidatorWizard'
import { STAKING_MANAGER_ADDRESS } from '../../lib/config'
import { STAKING_MANAGER_ABI } from '../../lib/contracts'
import { isCoreAvailable } from '../../lib/avalancheWallet'

const SM_CONTRACT = {
  address: STAKING_MANAGER_ADDRESS,
  abi: STAKING_MANAGER_ABI,
}

// ── Helpers ──
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

function formatBips(bips) {
  return (bips / 100).toFixed(2) + '%'
}

function formatDuration(seconds) {
  const days = Math.floor(seconds / 86400)
  if (days > 0) return `${days}d`
  const hours = Math.floor(seconds / 3600)
  if (hours > 0) return `${hours}h`
  return `${Math.floor(seconds / 60)}m`
}

// ── Step indicator ──
const REGISTER_STEPS = ['Form', 'Initiate on L1', 'Aggregate Warp', 'P-Chain Tx', 'Complete on L1', 'Done']
const DELEGATE_STEPS = ['Form', 'Initiate on L1', 'Aggregate Warp', 'P-Chain Tx', 'Complete on L1', 'Done']
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

// ── Shared Warp/P-Chain/Complete Steps ──
function WarpSteps({ wizard, completeFunc, completeFuncName, completeArgs, completePending, completeConfirming, completeError, completeSuccess, formExtra }) {
  // When L1 complete tx confirms, advance wizard
  if (completeSuccess && wizard.step === 'complete') {
    wizard.onCompleteTxConfirmed()
  }

  return (
    <>
      {/* Aggregate Warp signatures */}
      {wizard.step === 'aggregate' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">
            L1 transaction confirmed. Aggregating BLS signatures from L1 validators.
          </p>
          <p className="vm-wizard__hash">L1 Tx: {wizard.l1TxHash?.slice(0, 14)}...{wizard.l1TxHash?.slice(-10)}</p>
          <button className="vm-action-submit" onClick={wizard.aggregateSignatures}>
            Aggregate Warp Signatures
          </button>
          {wizard.error && <p className="vm-action-error">{wizard.error}</p>}
        </div>
      )}

      {/* P-Chain tx */}
      {wizard.step === 'pchain' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">
            Warp signatures aggregated. Sign and submit the P-Chain transaction via Core wallet.
          </p>
          {formExtra}
          <button
            className="vm-action-submit"
            onClick={() => wizard.submitPChainTx({ initialBalanceAvax: 0.1 })}
          >
            Sign & Submit to P-Chain
          </button>
          {wizard.error && <p className="vm-action-error">{wizard.error}</p>}
        </div>
      )}

      {/* Complete on L1 */}
      {wizard.step === 'complete' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">
            P-Chain transaction confirmed. Complete the operation on the L1.
          </p>
          {wizard.pChainTxHash && (
            <p className="vm-wizard__hash">P-Chain Tx: {wizard.pChainTxHash}</p>
          )}
          <button
            className="vm-action-submit"
            disabled={completePending || completeConfirming}
            onClick={() => completeFunc({
              ...SM_CONTRACT,
              functionName: completeFuncName,
              args: completeArgs,
            })}
          >
            {completePending ? 'Confirm in wallet...' : completeConfirming ? 'Confirming...' : 'Complete on L1'}
          </button>
          {completeError && <p className="vm-action-error">{completeError.shortMessage || completeError.message}</p>}
        </div>
      )}

      {/* Done */}
      {wizard.step === 'done' && (
        <div className="vm-wizard__body">
          <p className="vm-action-success vm-wizard__success">
            Operation completed successfully!
          </p>
          <button className="vm-action-cancel" onClick={wizard.reset}>Close</button>
        </div>
      )}
    </>
  )
}

// ── Stake Validator Wizard ──
function StakeWizard({ wizard, settings }) {
  const { address } = useAccount()
  const [formData, setFormData] = useState({
    nodeID: '',
    blsPublicKey: '',
    stakeAmount: '',
    delegationFee: '2',
    minStakeDuration: '14',
    rewardRecipient: '',
    initialBalance: '0.1',
  })

  const { writeContract, data: initHash, isPending: initPending, error: initError } = useWriteContract()
  const { isLoading: initConfirming, isSuccess: initSuccess } = useWaitForTransactionReceipt({ hash: initHash })

  const { writeContract: writeComplete, data: completeHash, isPending: completePending, error: completeError } = useWriteContract()
  const { isLoading: completeConfirming, isSuccess: completeSuccess } = useWaitForTransactionReceipt({ hash: completeHash })

  if (initSuccess && wizard.step === 'initiate' && initHash) {
    wizard.onL1TxConfirmed(initHash)
  }

  const stakeWei = formData.stakeAmount ? parseEther(formData.stakeAmount) : 0n
  const delegationFeeBips = Math.round(Number(formData.delegationFee) * 100)
  const minStakeDurationSec = BigInt(Math.round(Number(formData.minStakeDuration) * 86400))
  const recipient = formData.rewardRecipient || address

  const minStake = settings?.minimumStakeAmount
  const maxStake = settings?.maximumStakeAmount
  const stakeValid = stakeWei > 0n && (!minStake || stakeWei >= minStake) && (!maxStake || stakeWei <= maxStake)
  const minFeeBips = settings?.minimumDelegationFeeBips ?? 0
  const feeValid = delegationFeeBips >= minFeeBips && delegationFeeBips <= 10000

  const canSubmit = formData.nodeID && formData.blsPublicKey && stakeValid && feeValid && !initPending && !initConfirming

  return (
    <div className="vm-wizard">
      <div className="vm-wizard__header">
        <h3>Stake as Validator</h3>
        <button className="vm-action-cancel" onClick={wizard.reset}>&times;</button>
      </div>

      <StepIndicator steps={REGISTER_STEPS} currentStep={wizard.step} />

      {/* Form */}
      {wizard.step === 'form' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">
            Stake native tokens to register as a validator. Your node must be running with the specified Node ID and BLS key.
          </p>
          <div className="vm-action-form">
            <label className="vm-form-label">Node ID <span>(from avalanche node id)</span></label>
            <input placeholder="NodeID-..." value={formData.nodeID} onChange={(e) => setFormData({ ...formData, nodeID: e.target.value })} />

            <label className="vm-form-label">BLS Public Key <span>(48 bytes, 0x prefix)</span></label>
            <input placeholder="0x..." value={formData.blsPublicKey} onChange={(e) => setFormData({ ...formData, blsPublicKey: e.target.value })} />

            <label className="vm-form-label">
              Stake Amount (MURI)
              {settings && <span> (min: {formatEther(settings.minimumStakeAmount)}, max: {formatEther(settings.maximumStakeAmount)})</span>}
            </label>
            <input type="number" step="any" min="0" placeholder="e.g. 1.0" value={formData.stakeAmount} onChange={(e) => setFormData({ ...formData, stakeAmount: e.target.value })} />

            <label className="vm-form-label">
              Delegation Fee (%)
              {settings && <span> (min: {formatBips(settings.minimumDelegationFeeBips)})</span>}
            </label>
            <input type="number" step="0.01" min="0" max="100" placeholder="2" value={formData.delegationFee} onChange={(e) => setFormData({ ...formData, delegationFee: e.target.value })} />

            <label className="vm-form-label">Min Stake Duration (days)</label>
            <input type="number" step="1" min="1" placeholder="14" value={formData.minStakeDuration} onChange={(e) => setFormData({ ...formData, minStakeDuration: e.target.value })} />

            <label className="vm-form-label">Reward Recipient <span>(defaults to your address)</span></label>
            <input placeholder={address || '0x...'} value={formData.rewardRecipient} onChange={(e) => setFormData({ ...formData, rewardRecipient: e.target.value })} />

            <label className="vm-form-label">Initial P-Chain Balance (AVAX)</label>
            <input type="number" step="0.01" placeholder="0.1" value={formData.initialBalance} onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })} />

            <div className="vm-form-summary">
              <span>Stake: {formData.stakeAmount || '0'} MURI</span>
              <span>Fee: {formData.delegationFee || '0'}%</span>
              <span>Duration: {formData.minStakeDuration || '0'} days</span>
            </div>

            <button
              className="vm-action-submit"
              disabled={!canSubmit}
              onClick={() => {
                wizard.connectCore()
                writeContract({
                  ...SM_CONTRACT,
                  functionName: 'initiateValidatorRegistration',
                  args: [
                    formData.nodeID,
                    formData.blsPublicKey,
                    { threshold: 1, addresses: [address] },
                    { threshold: 1, addresses: [address] },
                    delegationFeeBips,
                    minStakeDurationSec,
                    recipient,
                  ],
                  value: stakeWei,
                })
                wizard.onL1TxSubmitted()
              }}
            >
              Initiate Registration ({formData.stakeAmount || '0'} MURI)
            </button>
          </div>
        </div>
      )}

      {/* Initiate waiting */}
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

      <WarpSteps
        wizard={wizard}
        completeFunc={writeComplete}
        completeFuncName="completeValidatorRegistration"
        completeArgs={[0]}
        completePending={completePending}
        completeConfirming={completeConfirming}
        completeError={completeError}
        completeSuccess={completeSuccess}
        formExtra={<p className="vm-wizard__detail">Initial Balance: {formData.initialBalance} AVAX</p>}
      />
    </div>
  )
}

// ── Delegate Wizard ──
function DelegateWizard({ wizard, enrichedValidators }) {
  const { address } = useAccount()
  const [formData, setFormData] = useState({
    validationID: '',
    delegateAmount: '',
    rewardRecipient: '',
  })

  const { writeContract, data: initHash, isPending: initPending, error: initError } = useWriteContract()
  const { isLoading: initConfirming, isSuccess: initSuccess } = useWaitForTransactionReceipt({ hash: initHash })

  const { writeContract: writeComplete, data: completeHash, isPending: completePending, error: completeError } = useWriteContract()
  const { isLoading: completeConfirming, isSuccess: completeSuccess } = useWaitForTransactionReceipt({ hash: completeHash })

  if (initSuccess && wizard.step === 'initiate' && initHash) {
    wizard.onL1TxConfirmed(initHash)
  }

  const delegateWei = formData.delegateAmount ? parseEther(formData.delegateAmount) : 0n
  const recipient = formData.rewardRecipient || address
  const activeValidators = enrichedValidators.filter((v) => v.onChain?.statusLabel === 'Active')
  const canSubmit = formData.validationID && delegateWei > 0n && !initPending && !initConfirming

  return (
    <div className="vm-wizard">
      <div className="vm-wizard__header">
        <h3>Delegate to Validator</h3>
        <button className="vm-action-cancel" onClick={wizard.reset}>&times;</button>
      </div>

      <StepIndicator steps={DELEGATE_STEPS} currentStep={wizard.step} />

      {/* Form */}
      {wizard.step === 'form' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">
            Delegate native tokens to an active validator to earn rewards.
          </p>
          <div className="vm-action-form">
            <label className="vm-form-label">Select Validator</label>
            <select value={formData.validationID} onChange={(e) => setFormData({ ...formData, validationID: e.target.value })}>
              <option value="">Select validator...</option>
              {activeValidators.map((v) => (
                <option key={v.validationID} value={v.validationID}>
                  {v.nodeID.length > 24 ? `${v.nodeID.slice(0, 16)}...${v.nodeID.slice(-8)}` : v.nodeID}
                  {v.staking ? ` (fee: ${formatBips(v.staking.delegationFeeBips)})` : ''}
                </option>
              ))}
            </select>

            <label className="vm-form-label">Delegation Amount (MURI)</label>
            <input type="number" step="any" min="0" placeholder="e.g. 0.5" value={formData.delegateAmount} onChange={(e) => setFormData({ ...formData, delegateAmount: e.target.value })} />

            <label className="vm-form-label">Reward Recipient <span>(defaults to your address)</span></label>
            <input placeholder={address || '0x...'} value={formData.rewardRecipient} onChange={(e) => setFormData({ ...formData, rewardRecipient: e.target.value })} />

            <button
              className="vm-action-submit"
              disabled={!canSubmit}
              onClick={() => {
                wizard.connectCore()
                writeContract({
                  ...SM_CONTRACT,
                  functionName: 'initiateDelegatorRegistration',
                  args: [formData.validationID, recipient],
                  value: delegateWei,
                })
                wizard.onL1TxSubmitted()
              }}
            >
              Initiate Delegation ({formData.delegateAmount || '0'} MURI)
            </button>
          </div>
        </div>
      )}

      {/* Initiate waiting */}
      {wizard.step === 'initiate' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">
            {initPending ? 'Confirm the transaction in your wallet...' :
             initConfirming ? 'Waiting for L1 transaction confirmation...' :
             initError ? 'Transaction failed.' :
             'Submitting initiateDelegatorRegistration to L1...'}
          </p>
          {initHash && <p className="vm-wizard__hash">Tx: {initHash.slice(0, 14)}...{initHash.slice(-10)}</p>}
          {initError && <p className="vm-action-error">{initError.shortMessage || initError.message}</p>}
        </div>
      )}

      <WarpSteps
        wizard={wizard}
        completeFunc={writeComplete}
        completeFuncName="completeDelegatorRegistration"
        completeArgs={[formData.validationID, 0]}
        completePending={completePending}
        completeConfirming={completeConfirming}
        completeError={completeError}
        completeSuccess={completeSuccess}
      />
    </div>
  )
}

// ── Remove Validator Wizard ──
function RemoveValidatorWizard({ wizard, enrichedValidators }) {
  const { address } = useAccount()
  const [selectedValidator, setSelectedValidator] = useState('')
  const [includeUptime, setIncludeUptime] = useState(true)

  const { writeContract, data: initHash, isPending: initPending, error: initError } = useWriteContract()
  const { isLoading: initConfirming, isSuccess: initSuccess } = useWaitForTransactionReceipt({ hash: initHash })

  const { writeContract: writeComplete, data: completeHash, isPending: completePending, error: completeError } = useWriteContract()
  const { isLoading: completeConfirming, isSuccess: completeSuccess } = useWaitForTransactionReceipt({ hash: completeHash })

  if (initSuccess && wizard.step === 'initiate' && initHash) {
    wizard.onL1TxConfirmed(initHash)
  }

  // Show validators owned by current wallet
  const ownedValidators = enrichedValidators.filter(
    (v) => v.onChain?.statusLabel === 'Active' && v.staking?.owner?.toLowerCase() === address?.toLowerCase()
  )

  return (
    <div className="vm-wizard">
      <div className="vm-wizard__header">
        <h3>Remove Validator</h3>
        <button className="vm-action-cancel" onClick={wizard.reset}>&times;</button>
      </div>

      <StepIndicator steps={REMOVE_STEPS} currentStep={wizard.step} />

      {wizard.step === 'form' && (
        <div className="vm-wizard__body">
          <p className="vm-wizard__desc">Select your validator to remove from the L1.</p>
          {ownedValidators.length === 0 ? (
            <p className="vm-wizard__desc" style={{ color: 'var(--color-text-secondary)' }}>
              No active validators owned by your wallet.
            </p>
          ) : (
            <div className="vm-action-form">
              <label className="vm-form-label">Validator</label>
              <select value={selectedValidator} onChange={(e) => setSelectedValidator(e.target.value)}>
                <option value="">Select validator...</option>
                {ownedValidators.map((v) => (
                  <option key={v.validationID} value={v.validationID}>
                    {v.nodeID.length > 24 ? `${v.nodeID.slice(0, 16)}...${v.nodeID.slice(-8)}` : v.nodeID} (w: {v.onChain?.weight ?? v.weight})
                  </option>
                ))}
              </select>

              <label className="vm-form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={includeUptime} onChange={(e) => setIncludeUptime(e.target.checked)} />
                Include uptime proof (required for rewards)
              </label>

              <button
                className="vm-action-submit"
                disabled={!selectedValidator}
                onClick={() => {
                  wizard.connectCore()
                  writeContract({
                    ...SM_CONTRACT,
                    functionName: 'forceInitiateValidatorRemoval',
                    args: [selectedValidator, includeUptime, 0],
                  })
                  wizard.onL1TxSubmitted()
                }}
              >
                Initiate Removal
              </button>
            </div>
          )}
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

      <WarpSteps
        wizard={wizard}
        completeFunc={writeComplete}
        completeFuncName="completeValidatorRemoval"
        completeArgs={[0]}
        completePending={completePending}
        completeConfirming={completeConfirming}
        completeError={completeError}
        completeSuccess={completeSuccess}
      />
    </div>
  )
}

// ── Main ValidatorsTab ──
export default function ValidatorsTab({ validators, valsLoading, valsError }) {
  const { isConnected } = useAccount()
  const wizard = useValidatorWizard()

  const {
    totalWeight,
    subnetID,
    initialized,
    settings,
    enrichedValidators,
    isLoading: vmLoading,
  } = useValidatorManager(validators)

  const activeCount = enrichedValidators.filter((v) => v.onChain?.statusLabel === 'Active').length
  const pendingCount = enrichedValidators.filter(
    (v) => v.onChain?.statusLabel === 'PendingAdded' || v.onChain?.statusLabel === 'PendingRemoved'
  ).length

  const hasCoreWallet = isCoreAvailable()

  return (
    <>
      {/* Network Stats Bar */}
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
        {settings && (
          <>
            <div className="vm-network-bar__stat">
              <span className="vm-network-bar__label">Min Stake</span>
              <span className="vm-network-bar__value">{formatEther(settings.minimumStakeAmount)} MURI</span>
            </div>
            <div className="vm-network-bar__stat">
              <span className="vm-network-bar__label">Max Stake</span>
              <span className="vm-network-bar__value">{formatEther(settings.maximumStakeAmount)} MURI</span>
            </div>
            <div className="vm-network-bar__stat">
              <span className="vm-network-bar__label">Min Duration</span>
              <span className="vm-network-bar__value">{formatDuration(settings.minimumStakeDuration)}</span>
            </div>
          </>
        )}
        <div className="vm-network-bar__stat">
          <span className="vm-network-bar__label">Initialized</span>
          <span className="vm-network-bar__value">{initialized ? 'Yes' : 'No'}</span>
        </div>
        {subnetID && (
          <div className="vm-network-bar__stat vm-network-bar__stat--wide">
            <span className="vm-network-bar__label">Subnet ID</span>
            <span className="vm-network-bar__value explorer-mono">{subnetID.slice(0, 14)}...{subnetID.slice(-10)}</span>
          </div>
        )}
      </div>

      {/* Action Panel — visible to all connected wallets (permissionless PoS) */}
      {isConnected && wizard.step === 'idle' && (
        <div className="vm-owner-panel">
          <h3 className="vm-owner-panel__title">
            Staking Actions
            {!hasCoreWallet && <span className="vm-core-warning"> (Core wallet required for P-Chain operations)</span>}
          </h3>
          <div className="vm-owner-panel__buttons">
            <button className="vm-action-btn" onClick={wizard.startRegister}>
              Stake as Validator
            </button>
            <button
              className="vm-action-btn"
              disabled={activeCount === 0}
              onClick={wizard.startDelegate}
            >
              Delegate to Validator
            </button>
            <button
              className="vm-action-btn"
              onClick={wizard.startRemoveValidator}
            >
              Remove My Validator
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
        <StakeWizard wizard={wizard} settings={settings} />
      )}
      {wizard.step !== 'idle' && wizard.operation === 'delegate' && (
        <DelegateWizard wizard={wizard} enrichedValidators={enrichedValidators} />
      )}
      {wizard.step !== 'idle' && wizard.operation === 'removeValidator' && (
        <RemoveValidatorWizard wizard={wizard} enrichedValidators={enrichedValidators} />
      )}

      {/* Validator list */}
      <div className="vm-validator-list">
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
                    <th>Del. Fee</th>
                    <th>Owner</th>
                    <th>Start</th>
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
                      <td>{v.staking ? formatBips(v.staking.delegationFeeBips) : '—'}</td>
                      <td className="explorer-mono">
                        {v.staking?.owner ? `${v.staking.owner.slice(0, 8)}...${v.staking.owner.slice(-6)}` : '—'}
                      </td>
                      <td>{v.onChain?.startTime ? new Date(v.onChain.startTime * 1000).toLocaleDateString() : new Date(v.startTime * 1000).toLocaleDateString()}</td>
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
                      <span>Del. Fee</span>
                      <span>{v.staking ? formatBips(v.staking.delegationFeeBips) : '—'}</span>
                    </div>
                    <div className="explorer-card__row">
                      <span>Owner</span>
                      <span className="explorer-mono" style={{ fontSize: '0.7rem' }}>
                        {v.staking?.owner ? `${v.staking.owner.slice(0, 8)}...${v.staking.owner.slice(-4)}` : '—'}
                      </span>
                    </div>
                    <div className="explorer-card__row">
                      <span>Start</span>
                      <span>{new Date((v.onChain?.startTime || v.startTime) * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
