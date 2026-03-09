import { useMemo } from 'react'
import { useReadContracts, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { VALIDATOR_MANAGER_ADDRESS, VALIDATOR_MANAGER_ABI } from '../lib/contracts'

const POLL_INTERVAL = 30_000

const VM_CONTRACT = {
  address: VALIDATOR_MANAGER_ADDRESS,
  abi: VALIDATOR_MANAGER_ABI,
}

// ValidatorStatus enum from ACP-99
export const ValidatorStatus = {
  0: 'Unknown',
  1: 'PendingAdded',
  2: 'Active',
  3: 'PendingRemoved',
  4: 'Completed',
  5: 'Invalidated',
}

/**
 * Read global ValidatorManager state: totalWeight, subnetID, owner, initialized, churn.
 * Also fetches on-chain validator details for each P-Chain validator by validationID.
 */
export function useValidatorManager(pChainValidators) {
  const { address } = useAccount()

  // Phase 1: Global reads (always active)
  const globalCalls = [
    { ...VM_CONTRACT, functionName: 'l1TotalWeight' },
    { ...VM_CONTRACT, functionName: 'subnetID' },
    { ...VM_CONTRACT, functionName: 'owner' },
    { ...VM_CONTRACT, functionName: 'isValidatorSetInitialized' },
    { ...VM_CONTRACT, functionName: 'getChurnTracker' },
  ]

  const { data: globalData, isLoading: globalLoading } = useReadContracts({
    contracts: globalCalls,
    query: { refetchInterval: POLL_INTERVAL },
  })

  const totalWeight = globalData?.[0]?.status === 'success' ? globalData[0].result : undefined
  const subnetID = globalData?.[1]?.status === 'success' ? globalData[1].result : undefined
  const owner = globalData?.[2]?.status === 'success' ? globalData[2].result : undefined
  const initialized = globalData?.[3]?.status === 'success' ? globalData[3].result : false
  const churnTracker = globalData?.[4]?.status === 'success' ? globalData[4].result : undefined

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase()

  // Phase 2: Per-validator reads (keyed by validationID from P-Chain data)
  const validatorCalls = useMemo(() => {
    if (!pChainValidators || pChainValidators.length === 0) return []
    return pChainValidators
      .filter((v) => v.validationID)
      .map((v) => ({
        ...VM_CONTRACT,
        functionName: 'getValidator',
        args: [v.validationID],
      }))
  }, [pChainValidators])

  const { data: valData, isLoading: valLoading } = useReadContracts({
    contracts: validatorCalls,
    query: {
      enabled: validatorCalls.length > 0,
      refetchInterval: POLL_INTERVAL,
    },
  })

  // Merge P-Chain data with on-chain ValidatorManager data
  const enrichedValidators = useMemo(() => {
    if (!pChainValidators) return []
    const validatorsWithId = pChainValidators.filter((v) => v.validationID)

    return pChainValidators.map((v) => {
      if (!v.validationID || !valData) return { ...v, onChain: null }
      const idx = validatorsWithId.findIndex((vv) => vv.validationID === v.validationID)
      if (idx === -1 || !valData[idx] || valData[idx].status !== 'success') {
        return { ...v, onChain: null }
      }
      const r = valData[idx].result
      return {
        ...v,
        onChain: {
          status: Number(r.status),
          statusLabel: ValidatorStatus[Number(r.status)] || 'Unknown',
          startingWeight: Number(r.startingWeight),
          weight: Number(r.weight),
          sentNonce: Number(r.sentNonce),
          receivedNonce: Number(r.receivedNonce),
          startTime: Number(r.startTime),
          endTime: Number(r.endTime),
        },
      }
    })
  }, [pChainValidators, valData])

  return {
    // Global state
    totalWeight: totalWeight != null ? Number(totalWeight) : undefined,
    subnetID,
    owner,
    isOwner,
    initialized,
    churnTracker: churnTracker
      ? {
          churnAmount: Number(churnTracker.churnAmount),
          startedAt: Number(churnTracker.startedAt),
          initialWeight: Number(churnTracker.initialWeight),
        }
      : undefined,
    // Enriched validators
    enrichedValidators,
    isLoading: globalLoading || valLoading,
  }
}

/**
 * Write actions for the ValidatorManager (onlyOwner).
 */
export function useValidatorManagerActions() {
  // Initiate validator registration
  const {
    writeContract: writeInitReg,
    data: initRegHash,
    isPending: initRegPending,
    error: initRegError,
    reset: resetInitReg,
  } = useWriteContract()
  const { isLoading: initRegConfirming, isSuccess: initRegSuccess } =
    useWaitForTransactionReceipt({ hash: initRegHash })

  function initiateRegistration({ nodeID, blsPublicKey, expiry, pChainOwner, weight }) {
    writeInitReg({
      ...VM_CONTRACT,
      functionName: 'initiateValidatorRegistration',
      args: [
        nodeID,
        blsPublicKey,
        BigInt(expiry),
        pChainOwner || { threshold: 0, addresses: [] },
        pChainOwner || { threshold: 0, addresses: [] },
        BigInt(weight),
      ],
    })
  }

  // Complete validator registration
  const {
    writeContract: writeCompleteReg,
    data: completeRegHash,
    isPending: completeRegPending,
    error: completeRegError,
    reset: resetCompleteReg,
  } = useWriteContract()
  const { isLoading: completeRegConfirming, isSuccess: completeRegSuccess } =
    useWaitForTransactionReceipt({ hash: completeRegHash })

  function completeRegistration(messageIndex) {
    writeCompleteReg({
      ...VM_CONTRACT,
      functionName: 'completeValidatorRegistration',
      args: [messageIndex],
    })
  }

  // Initiate validator removal
  const {
    writeContract: writeInitRemove,
    data: initRemoveHash,
    isPending: initRemovePending,
    error: initRemoveError,
    reset: resetInitRemove,
  } = useWriteContract()
  const { isLoading: initRemoveConfirming, isSuccess: initRemoveSuccess } =
    useWaitForTransactionReceipt({ hash: initRemoveHash })

  function initiateRemoval(validationID) {
    writeInitRemove({
      ...VM_CONTRACT,
      functionName: 'initiateValidatorRemoval',
      args: [validationID],
    })
  }

  // Complete validator removal
  const {
    writeContract: writeCompleteRemove,
    data: completeRemoveHash,
    isPending: completeRemovePending,
    error: completeRemoveError,
    reset: resetCompleteRemove,
  } = useWriteContract()
  const { isLoading: completeRemoveConfirming, isSuccess: completeRemoveSuccess } =
    useWaitForTransactionReceipt({ hash: completeRemoveHash })

  function completeRemoval(messageIndex) {
    writeCompleteRemove({
      ...VM_CONTRACT,
      functionName: 'completeValidatorRemoval',
      args: [messageIndex],
    })
  }

  // Initiate weight update
  const {
    writeContract: writeInitWeight,
    data: initWeightHash,
    isPending: initWeightPending,
    error: initWeightError,
    reset: resetInitWeight,
  } = useWriteContract()
  const { isLoading: initWeightConfirming, isSuccess: initWeightSuccess } =
    useWaitForTransactionReceipt({ hash: initWeightHash })

  function initiateWeightUpdate(validationID, newWeight) {
    writeInitWeight({
      ...VM_CONTRACT,
      functionName: 'initiateValidatorWeightUpdate',
      args: [validationID, BigInt(newWeight)],
    })
  }

  // Complete weight update
  const {
    writeContract: writeCompleteWeight,
    data: completeWeightHash,
    isPending: completeWeightPending,
    error: completeWeightError,
    reset: resetCompleteWeight,
  } = useWriteContract()
  const { isLoading: completeWeightConfirming, isSuccess: completeWeightSuccess } =
    useWaitForTransactionReceipt({ hash: completeWeightHash })

  function completeWeightUpdate(messageIndex) {
    writeCompleteWeight({
      ...VM_CONTRACT,
      functionName: 'completeValidatorWeightUpdate',
      args: [messageIndex],
    })
  }

  return {
    initiateRegistration,
    initReg: { hash: initRegHash, isPending: initRegPending, isConfirming: initRegConfirming, isSuccess: initRegSuccess, error: initRegError, reset: resetInitReg },

    completeRegistration,
    completeReg: { hash: completeRegHash, isPending: completeRegPending, isConfirming: completeRegConfirming, isSuccess: completeRegSuccess, error: completeRegError, reset: resetCompleteReg },

    initiateRemoval,
    initRemove: { hash: initRemoveHash, isPending: initRemovePending, isConfirming: initRemoveConfirming, isSuccess: initRemoveSuccess, error: initRemoveError, reset: resetInitRemove },

    completeRemoval,
    completeRemove: { hash: completeRemoveHash, isPending: completeRemovePending, isConfirming: completeRemoveConfirming, isSuccess: completeRemoveSuccess, error: completeRemoveError, reset: resetCompleteRemove },

    initiateWeightUpdate,
    initWeight: { hash: initWeightHash, isPending: initWeightPending, isConfirming: initWeightConfirming, isSuccess: initWeightSuccess, error: initWeightError, reset: resetInitWeight },

    completeWeightUpdate,
    completeWeight: { hash: completeWeightHash, isPending: completeWeightPending, isConfirming: completeWeightConfirming, isSuccess: completeWeightSuccess, error: completeWeightError, reset: resetCompleteWeight },
  }
}
