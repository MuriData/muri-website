// Deployed proxy addresses (ERC1967) on MuriData Testnet (chain 44946)
// All FileMarket + FileMarketExtension functions callable through the FileMarket proxy (fallback delegation)

export const FILE_MARKET_ADDRESS = '0xf269a406a2be691cb038203ff6bdcfc5e13acdc6'
export const NODE_STAKING_ADDRESS = '0x171169313a60457529c04408a96772a50993b6a4'

// Combined ABI: FileMarket (orders, accounting) + FileMarketExtension (views, challenges)
// Only view functions needed for dashboard
export const FILE_MARKET_ABI = [
  // ── Global aggregation views (Extension) ──
  {
    type: 'function',
    name: 'getGlobalStats',
    inputs: [],
    outputs: [
      { name: 'totalOrders', type: 'uint256' },
      { name: 'activeOrdersCount', type: 'uint256' },
      { name: 'totalEscrowLocked', type: 'uint256' },
      { name: 'totalNodes', type: 'uint256' },
      { name: 'totalCapacityStaked', type: 'uint256' },
      { name: 'totalCapacityUsed', type: 'uint256' },
      { name: 'activeChallengeSlots', type: 'uint256' },
      { name: 'currentPeriod_', type: 'uint256' },
      { name: 'currentBlock_', type: 'uint256' },
      { name: 'challengeableOrdersCount', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getFinancialStats',
    inputs: [],
    outputs: [
      { name: 'totalContractBalance', type: 'uint256' },
      { name: 'totalEscrowHeld', type: 'uint256' },
      { name: 'totalRewardsPaid', type: 'uint256' },
      { name: 'averageOrderValue', type: 'uint256' },
      { name: 'totalStakeValue', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getProofSystemStats',
    inputs: [],
    outputs: [
      { name: 'activeSlotsCount', type: 'uint256' },
      { name: 'idleSlotsCount', type: 'uint256' },
      { name: 'expiredSlotsCount', type: 'uint256' },
      { name: 'currentBlockNumber', type: 'uint256' },
      { name: 'challengeWindowBlocks', type: 'uint256' },
      { name: 'challengeableOrdersCount', type: 'uint256' },
      { name: 'totalSlotsCount', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllSlotInfo',
    inputs: [],
    outputs: [
      { name: 'orderIds', type: 'uint256[]' },
      { name: 'challengedNodes', type: 'address[]' },
      { name: 'randomnesses', type: 'uint256[]' },
      { name: 'deadlineBlocks', type: 'uint256[]' },
      { name: 'isExpired', type: 'bool[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRecentOrders',
    inputs: [{ name: 'count', type: 'uint256' }],
    outputs: [
      { name: 'orderIds', type: 'uint256[]' },
      { name: 'owners', type: 'address[]' },
      { name: 'numChunks', type: 'uint32[]' },
      { name: 'periods', type: 'uint16[]' },
      { name: 'replicas', type: 'uint8[]' },
      { name: 'filled', type: 'uint8[]' },
      { name: 'escrows', type: 'uint256[]' },
      { name: 'isActive', type: 'bool[]' },
    ],
    stateMutability: 'view',
  },
  // ── Accounting views (FileMarket) ──
  {
    type: 'function',
    name: 'getSlashRedistributionStats',
    inputs: [],
    outputs: [
      { name: 'totalReceived', type: 'uint256' },
      { name: 'totalBurned', type: 'uint256' },
      { name: 'totalRewards', type: 'uint256' },
      { name: 'currentBps', type: 'uint256' },
      { name: 'totalClientComp', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  // ── Per-entity views ──
  {
    type: 'function',
    name: 'getNodeEarningsInfo',
    inputs: [{ name: '_node', type: 'address' }],
    outputs: [
      { name: 'totalEarned', type: 'uint256' },
      { name: 'withdrawn', type: 'uint256' },
      { name: 'claimable', type: 'uint256' },
      { name: 'lastClaimPeriod', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNodeChallengeStatus',
    inputs: [{ name: '_node', type: 'address' }],
    outputs: [{ name: 'activeChallenges', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getOrderDetails',
    inputs: [{ name: '_orderId', type: 'uint256' }],
    outputs: [
      { name: 'owner_', type: 'address' },
      { name: 'uri_', type: 'string' },
      { name: 'root_', type: 'uint256' },
      { name: 'numChunks_', type: 'uint32' },
      { name: 'periods_', type: 'uint16' },
      { name: 'replicas_', type: 'uint8' },
      { name: 'filled_', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getOrderFinancials',
    inputs: [{ name: '_orderId', type: 'uint256' }],
    outputs: [
      { name: 'escrow_', type: 'uint256' },
      { name: 'withdrawn_', type: 'uint256' },
      { name: 'startPeriod_', type: 'uint64' },
      { name: 'expired_', type: 'bool' },
      { name: 'nodes_', type: 'address[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getActiveOrders',
    inputs: [],
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getActiveOrdersCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNodeOrders',
    inputs: [{ name: '_node', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'currentPeriod',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'currentEpoch',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getClaimableRewards',
    inputs: [{ name: '_node', type: 'address' }],
    outputs: [{ name: 'claimable', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getOrderEscrowInfo',
    inputs: [{ name: '_orderId', type: 'uint256' }],
    outputs: [
      { name: 'totalEscrow', type: 'uint256' },
      { name: 'paidToNodes', type: 'uint256' },
      { name: 'remainingEscrow', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getReporterEarningsInfo',
    inputs: [{ name: '_reporter', type: 'address' }],
    outputs: [
      { name: 'earned', type: 'uint256' },
      { name: 'withdrawn', type: 'uint256' },
      { name: 'pending', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNodeOrderEarnings',
    inputs: [
      { name: '_node', type: 'address' },
      { name: '_orderId', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getActiveOrdersPage',
    inputs: [
      { name: 'offset', type: 'uint256' },
      { name: 'limit', type: 'uint256' },
    ],
    outputs: [
      { name: 'orderIds', type: 'uint256[]' },
      { name: 'total', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getChallengeableOrdersPage',
    inputs: [
      { name: 'offset', type: 'uint256' },
      { name: 'limit', type: 'uint256' },
    ],
    outputs: [
      { name: 'orderIds', type: 'uint256[]' },
      { name: 'total', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
]

export const NODE_STAKING_ABI = [
  {
    type: 'function',
    name: 'getNetworkStats',
    inputs: [],
    outputs: [
      { name: 'totalNodes', type: 'uint256' },
      { name: 'totalCapacityStaked', type: 'uint256' },
      { name: 'totalCapacityUsed', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNodeInfo',
    inputs: [{ name: 'node', type: 'address' }],
    outputs: [
      { name: 'stake', type: 'uint256' },
      { name: 'capacity', type: 'uint64' },
      { name: 'used', type: 'uint64' },
      { name: 'publicKey', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isValidNode',
    inputs: [{ name: 'node', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMaxSlashable',
    inputs: [{ name: 'node', type: 'address' }],
    outputs: [{ name: 'maxSlashable', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nodeList',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'globalTotalCapacity',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'globalTotalUsed',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNodeListPage',
    inputs: [
      { name: 'offset', type: 'uint256' },
      { name: 'limit', type: 'uint256' },
    ],
    outputs: [
      { name: 'addresses', type: 'address[]' },
      { name: 'total', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
]
