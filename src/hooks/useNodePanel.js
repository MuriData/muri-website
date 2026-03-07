import { useAccount, useReadContracts } from 'wagmi'
import {
  FILE_MARKET_ADDRESS,
  FILE_MARKET_ABI,
  NODE_STAKING_ADDRESS,
  NODE_STAKING_ABI,
} from '../lib/contracts'

const POLL_INTERVAL = 15_000

const stakingContract = { address: NODE_STAKING_ADDRESS, abi: NODE_STAKING_ABI }
const marketContract = { address: FILE_MARKET_ADDRESS, abi: FILE_MARKET_ABI }

// Phase 1: check if connected wallet is a valid node
function useIsNode(address) {
  const { data, isLoading } = useReadContracts({
    contracts: [
      { ...stakingContract, functionName: 'isValidNode', args: [address] },
    ],
    query: {
      enabled: !!address,
      refetchInterval: POLL_INTERVAL,
    },
  })

  const isNode = data?.[0]?.status === 'success' ? data[0].result : false
  return { isNode, isLoading }
}

// Phase 2: fetch full node data (only when isNode is true)
export function useNodePanel() {
  const { address, isConnected } = useAccount()
  const { isNode, isLoading: gateLoading } = useIsNode(address)

  const { data, isLoading: dataLoading } = useReadContracts({
    contracts: [
      { ...stakingContract, functionName: 'getNodeInfo', args: [address] },
      { ...marketContract, functionName: 'getNodeEarningsInfo', args: [address] },
      { ...marketContract, functionName: 'getNodeChallengeStatus', args: [address] },
      { ...marketContract, functionName: 'getNodeOrders', args: [address] },
      { ...marketContract, functionName: 'getClaimableRewards', args: [address] },
      { ...stakingContract, functionName: 'getMaxSlashable', args: [address] },
      { ...marketContract, functionName: 'getReporterEarningsInfo', args: [address] },
    ],
    query: {
      enabled: !!address && isNode,
      refetchInterval: POLL_INTERVAL,
    },
  })

  const get = (i) => data?.[i]?.status === 'success' ? data[i].result : undefined

  return {
    isConnected,
    isNode,
    isLoading: gateLoading || (isNode && dataLoading),
    address,
    nodeInfo: get(0),          // [stake, capacity, used, publicKey]
    earningsInfo: get(1),      // [totalEarned, withdrawn, claimable, lastClaimPeriod]
    activeChallenges: get(2),  // activeChallenges (uint256)
    nodeOrders: get(3),        // uint256[]
    claimableRewards: get(4),  // uint256
    maxSlashable: get(5),      // uint256
    reporterInfo: get(6),      // [earned, withdrawn, pending]
  }
}
