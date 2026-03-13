import { useWriteContract, useWaitForTransactionReceipt, useReadContracts, useAccount } from 'wagmi'
import { FAUCET_ABI, FAUCET_ADDRESS } from '../lib/contracts'

const faucet = { address: FAUCET_ADDRESS, abi: FAUCET_ABI }

export function useFaucet() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const { data: readData, refetch } = useReadContracts({
    contracts: [
      { ...faucet, functionName: 'canClaim', args: [address] },
      { ...faucet, functionName: 'claimAmount' },
      { ...faucet, functionName: 'cooldown' },
      { ...faucet, functionName: 'lastClaim', args: [address] },
    ],
    query: { enabled: !!address },
  })

  const canClaim = readData?.[0]?.result ?? true
  const claimAmount = readData?.[1]?.result ?? 0n
  const cooldown = readData?.[2]?.result ?? 0n
  const lastClaim = readData?.[3]?.result ?? 0n

  function claim() {
    writeContract({ ...faucet, functionName: 'claim' })
  }

  return { claim, hash, isPending, isConfirming, isSuccess, error, reset, canClaim, claimAmount, cooldown, lastClaim, refetch }
}
