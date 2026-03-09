import { useState, useCallback, useRef } from 'react'
import {
  isCoreAvailable,
  connectCoreWallet,
  getWarpMessageFromTxHash,
  aggregateWarpSignatures,
  submitRegisterL1ValidatorTx,
  submitSetL1ValidatorWeightTx,
} from '../lib/avalancheWallet'

/**
 * Wizard steps for all validator/delegation operations:
 *  1. form        — Fill in parameters (nodeID, BLS key, stake, delegation fee, etc.)
 *  2. initiate    — Call initiate* on L1 (EVM tx via wagmi)
 *  3. aggregate   — Extract Warp message from L1 tx, aggregate L1 validator signatures
 *  4. pchain      — Sign & submit P-Chain tx via Core wallet
 *  5. complete    — Call complete* on L1 with P-Chain ack Warp message
 *  6. done        — Success
 *
 * Operations: 'register' | 'delegate' | 'removeValidator' | 'removeDelegate'
 */

const INITIAL_STATE = {
  step: 'idle',
  operation: null,
  error: null,
  l1TxHash: null,
  warpMessage: null,
  signedWarpMessage: null,
  pChainTxHash: null,
  coreConnected: false,
  coreAddress: null,
}

export function useValidatorWizard() {
  const [state, setState] = useState(INITIAL_STATE)
  const walletClientRef = useRef(null)

  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
    walletClientRef.current = null
  }, [])

  // ── Connect Core Wallet ──
  const connectCore = useCallback(async () => {
    if (!isCoreAvailable()) {
      updateState({ error: 'Core wallet not detected. Please install the Core browser extension from https://core.app' })
      return false
    }
    try {
      updateState({ error: null })
      const { walletClient, evmAddress, pChainAddress } = await connectCoreWallet()
      walletClientRef.current = walletClient
      updateState({
        coreConnected: true,
        coreAddress: pChainAddress || evmAddress,
      })
      return true
    } catch (err) {
      updateState({ error: `Core connection failed: ${err.message}` })
      return false
    }
  }, [updateState])

  // ── Start operations ──
  const startRegister = useCallback(() => {
    setState({ ...INITIAL_STATE, step: 'form', operation: 'register' })
  }, [])

  const startDelegate = useCallback(() => {
    setState({ ...INITIAL_STATE, step: 'form', operation: 'delegate' })
  }, [])

  const startRemoveValidator = useCallback(() => {
    setState({ ...INITIAL_STATE, step: 'form', operation: 'removeValidator' })
  }, [])

  const startRemoveDelegate = useCallback(() => {
    setState({ ...INITIAL_STATE, step: 'form', operation: 'removeDelegate' })
  }, [])

  // ── L1 tx submitted (pending confirmation) ──
  const onL1TxSubmitted = useCallback(() => {
    updateState({ step: 'initiate', error: null })
  }, [updateState])

  // ── L1 tx confirmed → begin aggregation ──
  const onL1TxConfirmed = useCallback((txHash) => {
    updateState({ l1TxHash: txHash, step: 'aggregate', error: null })
  }, [updateState])

  // ── Aggregate Warp signatures ──
  const aggregateSignatures = useCallback(async () => {
    const { l1TxHash } = state
    if (!l1TxHash) {
      updateState({ error: 'No L1 transaction hash' })
      return
    }
    try {
      updateState({ error: null })
      const warpData = await getWarpMessageFromTxHash(l1TxHash)
      const signedWarpMessage = await aggregateWarpSignatures(warpData.unsignedMessage)
      updateState({
        warpMessage: warpData,
        signedWarpMessage,
        step: 'pchain',
      })
    } catch (err) {
      updateState({ error: `Warp aggregation failed: ${err.message}` })
    }
  }, [state, updateState])

  // ── Submit P-Chain transaction ──
  const submitPChainTx = useCallback(async (params = {}) => {
    const { signedWarpMessage, operation } = state
    if (!signedWarpMessage) {
      updateState({ error: 'No signed Warp message' })
      return
    }

    if (!walletClientRef.current) {
      const connected = await connectCore()
      if (!connected) return
    }

    try {
      updateState({ error: null })
      let txHash

      if (operation === 'register') {
        txHash = await submitRegisterL1ValidatorTx(walletClientRef.current, {
          signedWarpMessage,
          initialBalanceAvax: params.initialBalanceAvax || 0.1,
        })
      } else {
        // Delegation, removal operations all use SetL1ValidatorWeightTx
        txHash = await submitSetL1ValidatorWeightTx(walletClientRef.current, {
          signedWarpMessage,
        })
      }

      updateState({ pChainTxHash: txHash, step: 'complete' })
    } catch (err) {
      updateState({ error: `P-Chain transaction failed: ${err.message}` })
    }
  }, [state, updateState, connectCore])

  // ── L1 completion tx confirmed ──
  const onCompleteTxConfirmed = useCallback(() => {
    updateState({ step: 'done' })
  }, [updateState])

  // ── Manual P-Chain tx hash override ──
  const setManualPChainTxHash = useCallback((txHash) => {
    updateState({ pChainTxHash: txHash, step: 'complete' })
  }, [updateState])

  return {
    ...state,
    connectCore,
    startRegister,
    startDelegate,
    startRemoveValidator,
    startRemoveDelegate,
    onL1TxSubmitted,
    onL1TxConfirmed,
    aggregateSignatures,
    submitPChainTx,
    onCompleteTxConfirmed,
    setManualPChainTxHash,
    reset,
  }
}
