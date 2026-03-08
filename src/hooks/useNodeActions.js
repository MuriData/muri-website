import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import {
  FILE_MARKET_ADDRESS,
  FILE_MARKET_ABI,
  NODE_STAKING_ADDRESS,
  NODE_STAKING_ABI,
} from '../lib/contracts'

const market = { address: FILE_MARKET_ADDRESS, abi: FILE_MARKET_ABI }
const staking = { address: NODE_STAKING_ADDRESS, abi: NODE_STAKING_ABI }

// Each action gets its own hook instance so multiple actions don't clobber each other's state

export function useStakeNode() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function stake(capacity, publicKey, stakeValue) {
    writeContract({
      ...staking,
      functionName: 'stakeNode',
      args: [BigInt(capacity), BigInt(publicKey)],
      value: BigInt(stakeValue),
    })
  }

  return { stake, hash, isPending, isConfirming, isSuccess, error, reset }
}

export function useIncreaseCapacity() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function increase(additionalCapacity, additionalStake) {
    writeContract({
      ...staking,
      functionName: 'increaseCapacity',
      args: [BigInt(additionalCapacity)],
      value: BigInt(additionalStake),
    })
  }

  return { increase, hash, isPending, isConfirming, isSuccess, error, reset }
}

export function useDecreaseCapacity() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function decrease(reduceCapacity) {
    writeContract({
      ...staking,
      functionName: 'decreaseCapacity',
      args: [BigInt(reduceCapacity)],
    })
  }

  return { decrease, hash, isPending, isConfirming, isSuccess, error, reset }
}

export function useUnstakeNode() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function unstake() {
    writeContract({
      ...staking,
      functionName: 'unstakeNode',
    })
  }

  return { unstake, hash, isPending, isConfirming, isSuccess, error, reset }
}

export function useClaimRewards() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function claim() {
    writeContract({
      ...market,
      functionName: 'claimRewards',
    })
  }

  return { claim, hash, isPending, isConfirming, isSuccess, error, reset }
}

export function useClaimReporterRewards() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function claim() {
    writeContract({
      ...market,
      functionName: 'claimReporterRewards',
    })
  }

  return { claim, hash, isPending, isConfirming, isSuccess, error, reset }
}

export function useQuitOrder() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function quit(orderId) {
    writeContract({
      ...market,
      functionName: 'quitOrder',
      args: [BigInt(orderId)],
    })
  }

  return { quit, hash, isPending, isConfirming, isSuccess, error, reset }
}
