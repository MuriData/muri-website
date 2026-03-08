import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { FILE_MARKET_ADDRESS, FILE_MARKET_ABI } from '../lib/contracts'

const market = { address: FILE_MARKET_ADDRESS, abi: FILE_MARKET_ABI }

export function useStorageActions() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function placeOrder({ root, uri, numChunks, periods, replicas, pricePerChunkPerPeriod, fspProof }) {
    const escrow = BigInt(numChunks) * BigInt(periods) * BigInt(replicas) * BigInt(pricePerChunkPerPeriod)
    writeContract({
      ...market,
      functionName: 'placeOrder',
      args: [
        { root: BigInt(root), uri },
        numChunks,
        periods,
        replicas,
        BigInt(pricePerChunkPerPeriod),
        fspProof.map((x) => BigInt(x)),
      ],
      value: escrow,
    })
  }

  function cancelOrder(orderId) {
    writeContract({
      ...market,
      functionName: 'cancelOrder',
      args: [BigInt(orderId)],
    })
  }

  function completeExpiredOrder(orderId) {
    writeContract({
      ...market,
      functionName: 'completeExpiredOrder',
      args: [BigInt(orderId)],
    })
  }

  function withdrawRefund() {
    writeContract({
      ...market,
      functionName: 'withdrawRefund',
    })
  }

  return {
    placeOrder,
    cancelOrder,
    completeExpiredOrder,
    withdrawRefund,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  }
}
