// Generated from muri-contracts compiled ABIs (FileMarket + FileMarketExtension merged, NodeStaking)
// All functions callable through the FileMarket proxy (fallback delegation to extension)
// Deployed proxy addresses (ERC1967) on MuriData Testnet (chain 44946)

export const FILE_MARKET_ADDRESS = '0xf269a406a2be691cb038203ff6bdcfc5e13acdc6'
export const NODE_STAKING_ADDRESS = '0x171169313a60457529c04408a96772a50993b6a4'

export const FILE_MARKET_ABI = [
  {
    "type": "function",
    "name": "CANCEL_PENALTY_MAX_BPS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "CANCEL_PENALTY_MIN_BPS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "CHALLENGE_WINDOW_BLOCKS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_CHALLENGE_SLOTS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_CLIENT_COMPENSATION_BPS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_FORCED_EXITS_PER_SWEEP",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_PROOF_FAILURE_SLASH_MULTIPLIER",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_REPORTER_REWARD_BPS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_SWEEP_PER_CALL",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MIN_CHALLENGE_SLOTS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MIN_PROOF_FAILURE_SLASH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "UPGRADE_INTERFACE_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "activeOrders",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "aggregateActiveEscrow",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "aggregateActiveWithdrawn",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "cancelOrder",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "challengeSlots",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "orderId",
        "type": "uint256"
      },
      {
        "name": "challengedNode",
        "type": "address"
      },
      {
        "name": "deadlineBlock",
        "type": "uint64"
      },
      {
        "name": "randomness",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "challengeSlotsInitialized",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "challengeStartBlock",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "challengeableOrders",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "claimReporterRewards",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimRewards",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "cleanupCursor",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "clientCompensationBps",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "completeExpiredOrder",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "currentEpoch",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "currentPeriod",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "executeOrder",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256"
      },
      {
        "name": "_proof",
        "type": "uint256[8]"
      },
      {
        "name": "_commitment",
        "type": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "extension",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "fspVerifier",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "genesisTs",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getActiveOrdersCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getActiveOrdersPage",
    "inputs": [
      {
        "name": "offset",
        "type": "uint256"
      },
      {
        "name": "limit",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "orderIds",
        "type": "uint256[]"
      },
      {
        "name": "total",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getChallengeableOrdersCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getChallengeableOrdersPage",
    "inputs": [
      {
        "name": "offset",
        "type": "uint256"
      },
      {
        "name": "limit",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "orderIds",
        "type": "uint256[]"
      },
      {
        "name": "total",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getClaimableRewards",
    "inputs": [
      {
        "name": "_node",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "claimable",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNodeOrders",
    "inputs": [
      {
        "name": "_node",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOrderNodes",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getReporterEarningsInfo",
    "inputs": [
      {
        "name": "_reporter",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "earned",
        "type": "uint256"
      },
      {
        "name": "withdrawn",
        "type": "uint256"
      },
      {
        "name": "pending",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSlashRedistributionStats",
    "inputs": [],
    "outputs": [
      {
        "name": "totalReceived",
        "type": "uint256"
      },
      {
        "name": "totalBurned",
        "type": "uint256"
      },
      {
        "name": "totalRewards",
        "type": "uint256"
      },
      {
        "name": "currentBps",
        "type": "uint256"
      },
      {
        "name": "totalClientComp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "globalSeedRandomness",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasUnresolvedProofObligation",
    "inputs": [
      {
        "name": "_node",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initialize",
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_nodeStaking",
        "type": "address"
      },
      {
        "name": "_poiVerifier",
        "type": "address"
      },
      {
        "name": "_fspVerifier",
        "type": "address"
      },
      {
        "name": "_keyleakVerifier",
        "type": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isChallengeable",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isOrderExpired",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "keyleakVerifier",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lifetimeEscrowDeposited",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lifetimeRewardsPaid",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextOrderId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nodeActiveChallengeCount",
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nodeEarnings",
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nodeLastClaimPeriod",
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nodeOrderEarnings",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nodeOrderStartTimestamp",
    "inputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nodePendingRewards",
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nodeStaking",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nodeToOrders",
    "inputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nodeWithdrawn",
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "numChallengeSlots",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "onDemandChallenges",
    "inputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "deadlineBlock",
        "type": "uint64"
      },
      {
        "name": "randomness",
        "type": "uint256"
      },
      {
        "name": "challenger",
        "type": "address"
      },
      {
        "name": "fileRoot",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "orderActiveChallengeCount",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "orderEscrowWithdrawn",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "orderIndexInActive",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "orderIndexInChallengeable",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "orderToNodes",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "orders",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "file",
        "type": "tuple",
        "components": [
          {
            "name": "root",
            "type": "uint256"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      },
      {
        "name": "numChunks",
        "type": "uint32"
      },
      {
        "name": "periods",
        "type": "uint16"
      },
      {
        "name": "replicas",
        "type": "uint8"
      },
      {
        "name": "price",
        "type": "uint256"
      },
      {
        "name": "filled",
        "type": "uint8"
      },
      {
        "name": "startPeriod",
        "type": "uint64"
      },
      {
        "name": "escrow",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pendingRefunds",
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "placeOrder",
    "inputs": [
      {
        "name": "_file",
        "type": "tuple",
        "components": [
          {
            "name": "root",
            "type": "uint256"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      },
      {
        "name": "_numChunks",
        "type": "uint32"
      },
      {
        "name": "_periods",
        "type": "uint16"
      },
      {
        "name": "_replicas",
        "type": "uint8"
      },
      {
        "name": "_pricePerChunkPerPeriod",
        "type": "uint256"
      },
      {
        "name": "_fspProof",
        "type": "uint256[8]"
      }
    ],
    "outputs": [
      {
        "name": "orderId",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "poiVerifier",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proofFailureSlashMultiplier",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proxiableUUID",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "quitOrder",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "reporterEarnings",
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "reporterPendingRewards",
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "reporterRewardBps",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "reporterWithdrawn",
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setChallengeStartBlock",
    "inputs": [
      {
        "name": "_block",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setClientCompensationBps",
    "inputs": [
      {
        "name": "_newBps",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setProofFailureSlashMultiplier",
    "inputs": [
      {
        "name": "_newMultiplier",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setReporterRewardBps",
    "inputs": [
      {
        "name": "_newBps",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setSlashAuthority",
    "inputs": [
      {
        "name": "_authority",
        "type": "address"
      },
      {
        "name": "_allowed",
        "type": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "slashAuthorities",
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "slashNode",
    "inputs": [
      {
        "name": "_node",
        "type": "address"
      },
      {
        "name": "_slashAmount",
        "type": "uint256"
      },
      {
        "name": "_reason",
        "type": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "sweepCursor",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalBurnedFromSlash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalCancellationPenalties",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalClientCompensation",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalReporterRewards",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSlashedReceived",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "upgradeToAndCall",
    "inputs": [
      {
        "name": "newImplementation",
        "type": "address"
      },
      {
        "name": "data",
        "type": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "withdrawRefund",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "CancellationPenaltyDistributed",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "penaltyAmount",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "nodeCount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ChallengeSlotsScaled",
    "inputs": [
      {
        "name": "oldCount",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "newCount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ClientCompensationAccrued",
    "inputs": [
      {
        "name": "client",
        "type": "address",
        "indexed": true
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ClientCompensationBpsUpdated",
    "inputs": [
      {
        "name": "oldBps",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "newBps",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ExpiredSlotsProcessed",
    "inputs": [
      {
        "name": "processedCount",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "reporter",
        "type": "address",
        "indexed": true
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ForcedOrderExits",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "orderIds",
        "type": "uint256[]",
        "indexed": false
      },
      {
        "name": "totalFreed",
        "type": "uint64",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "name": "version",
        "type": "uint64",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "KeyLeakReported",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "reporter",
        "type": "address",
        "indexed": true
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NodeQuit",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NodeSlashed",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "reason",
        "type": "string",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OnDemandChallengeExpired",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OnDemandChallengeIssued",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "challenger",
        "type": "address",
        "indexed": false
      },
      {
        "name": "deadlineBlock",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OnDemandProofSubmitted",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "commitment",
        "type": "bytes32",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderCancelled",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "refundAmount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderCompleted",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderFulfilled",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "node",
        "type": "address",
        "indexed": true
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderPlaced",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true
      },
      {
        "name": "numChunks",
        "type": "uint32",
        "indexed": false
      },
      {
        "name": "periods",
        "type": "uint16",
        "indexed": false
      },
      {
        "name": "replicas",
        "type": "uint8",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderUnderReplicated",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "currentFilled",
        "type": "uint8",
        "indexed": false
      },
      {
        "name": "desiredReplicas",
        "type": "uint8",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProofFailureSlashMultiplierUpdated",
    "inputs": [
      {
        "name": "oldMultiplier",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "newMultiplier",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RefundQueued",
    "inputs": [
      {
        "name": "recipient",
        "type": "address",
        "indexed": true
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RefundWithdrawn",
    "inputs": [
      {
        "name": "recipient",
        "type": "address",
        "indexed": true
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ReporterRewardAccrued",
    "inputs": [
      {
        "name": "reporter",
        "type": "address",
        "indexed": true
      },
      {
        "name": "rewardAmount",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "slashedAmount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ReporterRewardBpsUpdated",
    "inputs": [
      {
        "name": "oldBps",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "newBps",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ReporterRewardsClaimed",
    "inputs": [
      {
        "name": "reporter",
        "type": "address",
        "indexed": true
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RewardsCalculated",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "periods",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RewardsClaimed",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SlashAuthorityUpdated",
    "inputs": [
      {
        "name": "authority",
        "type": "address",
        "indexed": true
      },
      {
        "name": "allowed",
        "type": "bool",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SlotChallengeIssued",
    "inputs": [
      {
        "name": "slotIndex",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "challengedNode",
        "type": "address",
        "indexed": false
      },
      {
        "name": "deadlineBlock",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SlotDeactivated",
    "inputs": [
      {
        "name": "slotIndex",
        "type": "uint256",
        "indexed": true
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SlotExpired",
    "inputs": [
      {
        "name": "slotIndex",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "failedNode",
        "type": "address",
        "indexed": true
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SlotProofSubmitted",
    "inputs": [
      {
        "name": "slotIndex",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "prover",
        "type": "address",
        "indexed": true
      },
      {
        "name": "commitment",
        "type": "bytes32",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SlotsActivated",
    "inputs": [
      {
        "name": "activatedCount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true
      }
    ],
    "anonymous": false
  },
  {
    "type": "function",
    "name": "activateSlots",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "challengeNode",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256"
      },
      {
        "name": "_node",
        "type": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAllSlotInfo",
    "inputs": [],
    "outputs": [
      {
        "name": "orderIds",
        "type": "uint256[]"
      },
      {
        "name": "challengedNodes",
        "type": "address[]"
      },
      {
        "name": "randomnesses",
        "type": "uint256[]"
      },
      {
        "name": "deadlineBlocks",
        "type": "uint256[]"
      },
      {
        "name": "isExpired",
        "type": "bool[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getFinancialStats",
    "inputs": [],
    "outputs": [
      {
        "name": "totalContractBalance",
        "type": "uint256"
      },
      {
        "name": "totalEscrowHeld",
        "type": "uint256"
      },
      {
        "name": "totalRewardsPaid",
        "type": "uint256"
      },
      {
        "name": "averageOrderValue",
        "type": "uint256"
      },
      {
        "name": "totalStakeValue",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGlobalStats",
    "inputs": [],
    "outputs": [
      {
        "name": "totalOrders",
        "type": "uint256"
      },
      {
        "name": "activeOrdersCount",
        "type": "uint256"
      },
      {
        "name": "totalEscrowLocked",
        "type": "uint256"
      },
      {
        "name": "totalNodes",
        "type": "uint256"
      },
      {
        "name": "totalCapacityStaked",
        "type": "uint256"
      },
      {
        "name": "totalCapacityUsed",
        "type": "uint256"
      },
      {
        "name": "activeChallengeSlots",
        "type": "uint256"
      },
      {
        "name": "currentPeriod_",
        "type": "uint256"
      },
      {
        "name": "currentBlock_",
        "type": "uint256"
      },
      {
        "name": "challengeableOrdersCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNodeChallengeStatus",
    "inputs": [
      {
        "name": "_node",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "activeChallenges",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNodeEarningsInfo",
    "inputs": [
      {
        "name": "_node",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "totalEarned",
        "type": "uint256"
      },
      {
        "name": "withdrawn",
        "type": "uint256"
      },
      {
        "name": "claimable",
        "type": "uint256"
      },
      {
        "name": "lastClaimPeriod",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNodeOrderEarnings",
    "inputs": [
      {
        "name": "_node",
        "type": "address"
      },
      {
        "name": "_orderId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOrderDetails",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "owner_",
        "type": "address"
      },
      {
        "name": "uri_",
        "type": "string"
      },
      {
        "name": "root_",
        "type": "uint256"
      },
      {
        "name": "numChunks_",
        "type": "uint32"
      },
      {
        "name": "periods_",
        "type": "uint16"
      },
      {
        "name": "replicas_",
        "type": "uint8"
      },
      {
        "name": "filled_",
        "type": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOrderEscrowInfo",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "totalEscrow",
        "type": "uint256"
      },
      {
        "name": "paidToNodes",
        "type": "uint256"
      },
      {
        "name": "remainingEscrow",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOrderFinancials",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "escrow_",
        "type": "uint256"
      },
      {
        "name": "withdrawn_",
        "type": "uint256"
      },
      {
        "name": "startPeriod_",
        "type": "uint64"
      },
      {
        "name": "expired_",
        "type": "bool"
      },
      {
        "name": "nodes_",
        "type": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getProofSystemStats",
    "inputs": [],
    "outputs": [
      {
        "name": "activeSlotsCount",
        "type": "uint256"
      },
      {
        "name": "idleSlotsCount",
        "type": "uint256"
      },
      {
        "name": "expiredSlotsCount",
        "type": "uint256"
      },
      {
        "name": "currentBlockNumber",
        "type": "uint256"
      },
      {
        "name": "challengeWindowBlocks",
        "type": "uint256"
      },
      {
        "name": "challengeableOrdersCount",
        "type": "uint256"
      },
      {
        "name": "totalSlotsCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRecentOrders",
    "inputs": [
      {
        "name": "count",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "orderIds",
        "type": "uint256[]"
      },
      {
        "name": "owners",
        "type": "address[]"
      },
      {
        "name": "numChunks",
        "type": "uint32[]"
      },
      {
        "name": "periods",
        "type": "uint16[]"
      },
      {
        "name": "replicas",
        "type": "uint8[]"
      },
      {
        "name": "filled",
        "type": "uint8[]"
      },
      {
        "name": "escrows",
        "type": "uint256[]"
      },
      {
        "name": "isActive",
        "type": "bool[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSlotInfo",
    "inputs": [
      {
        "name": "_slotIndex",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "orderId",
        "type": "uint256"
      },
      {
        "name": "challengedNode",
        "type": "address"
      },
      {
        "name": "randomness",
        "type": "uint256"
      },
      {
        "name": "deadlineBlock",
        "type": "uint256"
      },
      {
        "name": "isExpired",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "processExpiredOnDemandChallenge",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256"
      },
      {
        "name": "_node",
        "type": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "processExpiredSlots",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "reportKeyLeak",
    "inputs": [
      {
        "name": "_node",
        "type": "address"
      },
      {
        "name": "_proof",
        "type": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "submitOnDemandProof",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256"
      },
      {
        "name": "_proof",
        "type": "uint256[8]"
      },
      {
        "name": "_commitment",
        "type": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "submitProof",
    "inputs": [
      {
        "name": "_slotIndex",
        "type": "uint256"
      },
      {
        "name": "_proof",
        "type": "uint256[8]"
      },
      {
        "name": "_commitment",
        "type": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
]

export const NODE_STAKING_ABI = [
  {
    "type": "function",
    "name": "BURN_ADDRESS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MIN_CAPACITY",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "STAKE_PER_CHUNK",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "UPGRADE_INTERFACE_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decreaseCapacity",
    "inputs": [
      {
        "name": "_reduceCapacity",
        "type": "uint64"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "forceReduceUsed",
    "inputs": [
      {
        "name": "node",
        "type": "address"
      },
      {
        "name": "newUsed",
        "type": "uint64"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getMaxSlashable",
    "inputs": [
      {
        "name": "node",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "maxSlashable",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNetworkStats",
    "inputs": [],
    "outputs": [
      {
        "name": "totalNodes",
        "type": "uint256"
      },
      {
        "name": "totalCapacityStaked",
        "type": "uint256"
      },
      {
        "name": "totalCapacityUsed",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNodeInfo",
    "inputs": [
      {
        "name": "node",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "stake",
        "type": "uint256"
      },
      {
        "name": "capacity",
        "type": "uint64"
      },
      {
        "name": "used",
        "type": "uint64"
      },
      {
        "name": "publicKey",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getNodeListPage",
    "inputs": [
      {
        "name": "offset",
        "type": "uint256"
      },
      {
        "name": "limit",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "addresses",
        "type": "address[]"
      },
      {
        "name": "total",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "globalTotalCapacity",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "globalTotalUsed",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasCapacity",
    "inputs": [
      {
        "name": "node",
        "type": "address"
      },
      {
        "name": "requiredChunks",
        "type": "uint32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "increaseCapacity",
    "inputs": [
      {
        "name": "_additionalCapacity",
        "type": "uint64"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "initialize",
    "inputs": [
      {
        "name": "_market",
        "type": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isValidNode",
    "inputs": [
      {
        "name": "node",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "market",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nodeIndexInList",
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nodeList",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nodes",
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "stake",
        "type": "uint256"
      },
      {
        "name": "capacity",
        "type": "uint64"
      },
      {
        "name": "used",
        "type": "uint64"
      },
      {
        "name": "publicKey",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proxiableUUID",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "publicKeyOwner",
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "simulateSlash",
    "inputs": [
      {
        "name": "node",
        "type": "address"
      },
      {
        "name": "slashAmount",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "newCapacity",
        "type": "uint64"
      },
      {
        "name": "willForceExit",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "slashNode",
    "inputs": [
      {
        "name": "node",
        "type": "address"
      },
      {
        "name": "slashAmount",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "forcedOrderExit",
        "type": "bool"
      },
      {
        "name": "totalSlashed",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "stakeNode",
    "inputs": [
      {
        "name": "_capacity",
        "type": "uint64"
      },
      {
        "name": "_publicKey",
        "type": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "unstakeNode",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateNodeUsed",
    "inputs": [
      {
        "name": "node",
        "type": "address"
      },
      {
        "name": "newUsed",
        "type": "uint64"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "upgradeToAndCall",
    "inputs": [
      {
        "name": "newImplementation",
        "type": "address"
      },
      {
        "name": "data",
        "type": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "event",
    "name": "ForcedOrderExit",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "orderIds",
        "type": "uint256[]",
        "indexed": false
      },
      {
        "name": "additionalSlash",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "name": "version",
        "type": "uint64",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NodeCapacityDecreased",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "releasedStake",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "newCapacity",
        "type": "uint64",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NodeCapacityIncreased",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "additionalStake",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "newCapacity",
        "type": "uint64",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NodeSlashed",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "newCapacity",
        "type": "uint64",
        "indexed": false
      },
      {
        "name": "forcedOrderExit",
        "type": "bool",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NodeStaked",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "stake",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "capacity",
        "type": "uint64",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NodeUnstaked",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true
      },
      {
        "name": "stakeReturned",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true
      }
    ],
    "anonymous": false
  }
]
