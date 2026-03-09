import { useMemo } from 'react'
import { useReadContract, useReadContracts } from 'wagmi'
import { STAKING_MANAGER_ADDRESS } from '../lib/config'
import { STAKING_MANAGER_ABI, VALIDATOR_MANAGER_ABI } from '../lib/contracts'

const POLL_INTERVAL = 30_000

const SM_CONTRACT = {
  address: STAKING_MANAGER_ADDRESS,
  abi: STAKING_MANAGER_ABI,
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
 * Read NativeTokenStakingManager settings + ValidatorManager state.
 * Two-phase: first reads staking settings (to discover the ValidatorManager address),
 * then reads base validator data from the ValidatorManager + PoS data from the staking manager.
 */
export function useValidatorManager(pChainValidators) {
  // Phase 1: Read staking manager settings (discovers ValidatorManager address)
  const { data: settingsData, isLoading: settingsLoading } = useReadContract({
    ...SM_CONTRACT,
    functionName: 'getStakingManagerSettings',
    query: { refetchInterval: POLL_INTERVAL },
  })

  const managerAddress = settingsData?.manager
  const settings = settingsData
    ? {
        minimumStakeAmount: settingsData.minimumStakeAmount,
        maximumStakeAmount: settingsData.maximumStakeAmount,
        minimumStakeDuration: Number(settingsData.minimumStakeDuration),
        minimumDelegationFeeBips: Number(settingsData.minimumDelegationFeeBips),
        maximumStakeMultiplier: Number(settingsData.maximumStakeMultiplier),
        weightToValueFactor: settingsData.weightToValueFactor,
      }
    : undefined

  // Phase 2a: Read global state from ValidatorManager (conditional on manager address)
  const VM_CONTRACT = useMemo(
    () => (managerAddress ? { address: managerAddress, abi: VALIDATOR_MANAGER_ABI } : null),
    [managerAddress]
  )

  const globalCalls = useMemo(() => {
    if (!VM_CONTRACT) return []
    return [
      { ...VM_CONTRACT, functionName: 'l1TotalWeight' },
      { ...VM_CONTRACT, functionName: 'subnetID' },
      { ...VM_CONTRACT, functionName: 'isValidatorSetInitialized' },
      { ...VM_CONTRACT, functionName: 'owner' },
    ]
  }, [VM_CONTRACT])

  const { data: globalData, isLoading: globalLoading } = useReadContracts({
    contracts: globalCalls,
    query: {
      enabled: globalCalls.length > 0,
      refetchInterval: POLL_INTERVAL,
    },
  })

  const totalWeight = globalData?.[0]?.status === 'success' ? globalData[0].result : undefined
  const subnetID = globalData?.[1]?.status === 'success' ? globalData[1].result : undefined
  const initialized = globalData?.[2]?.status === 'success' ? globalData[2].result : false
  const owner = globalData?.[3]?.status === 'success' ? globalData[3].result : undefined

  // Phase 2b: Per-validator reads — base data from ValidatorManager + PoS data from staking manager
  const validatorsWithId = useMemo(
    () => (pChainValidators || []).filter((v) => v.validationID),
    [pChainValidators]
  )

  const perValidatorCalls = useMemo(() => {
    if (!VM_CONTRACT || validatorsWithId.length === 0) return []
    const calls = []
    for (const v of validatorsWithId) {
      // Base validator data from ValidatorManager
      calls.push({ ...VM_CONTRACT, functionName: 'getValidator', args: [v.validationID] })
      // PoS staking data from StakingManager
      calls.push({ ...SM_CONTRACT, functionName: 'getStakingValidator', args: [v.validationID] })
    }
    return calls
  }, [VM_CONTRACT, validatorsWithId])

  const { data: perValData, isLoading: perValLoading } = useReadContracts({
    contracts: perValidatorCalls,
    query: {
      enabled: perValidatorCalls.length > 0,
      refetchInterval: POLL_INTERVAL,
    },
  })

  // Merge P-Chain data with on-chain data
  const enrichedValidators = useMemo(() => {
    if (!pChainValidators) return []
    return pChainValidators.map((v) => {
      if (!v.validationID || !perValData) return { ...v, onChain: null, staking: null }
      const idx = validatorsWithId.findIndex((vv) => vv.validationID === v.validationID)
      if (idx === -1) return { ...v, onChain: null, staking: null }

      const baseIdx = idx * 2
      const posIdx = idx * 2 + 1

      const base =
        perValData[baseIdx]?.status === 'success' ? perValData[baseIdx].result : null
      const pos =
        perValData[posIdx]?.status === 'success' ? perValData[posIdx].result : null

      return {
        ...v,
        onChain: base
          ? {
              status: Number(base.status),
              statusLabel: ValidatorStatus[Number(base.status)] || 'Unknown',
              startingWeight: Number(base.startingWeight),
              weight: Number(base.weight),
              sentNonce: Number(base.sentNonce),
              receivedNonce: Number(base.receivedNonce),
              startTime: Number(base.startTime),
              endTime: Number(base.endTime),
            }
          : null,
        staking: pos
          ? {
              owner: pos.owner,
              delegationFeeBips: Number(pos.delegationFeeBips),
              minStakeDuration: Number(pos.minStakeDuration),
              uptimeSeconds: Number(pos.uptimeSeconds),
            }
          : null,
      }
    })
  }, [pChainValidators, perValData, validatorsWithId])

  return {
    // Staking settings
    settings,
    managerAddress,
    // Global state (from ValidatorManager)
    totalWeight: totalWeight != null ? Number(totalWeight) : undefined,
    subnetID,
    owner,
    initialized,
    // Enriched validators
    enrichedValidators,
    isLoading: settingsLoading || globalLoading || perValLoading,
  }
}
