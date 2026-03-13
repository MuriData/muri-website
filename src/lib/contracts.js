// Generated from muri-contracts compiled ABIs (FileMarket + FileMarketExtension merged, NodeStaking)
// All functions callable through the FileMarket proxy (fallback delegation to extension)
// Contract addresses are centralized in config.js — re-exported here for convenience.

export { FILE_MARKET_ADDRESS, NODE_STAKING_ADDRESS, STAKING_MANAGER_ADDRESS, FAUCET_ADDRESS } from './config'

// ── NativeTokenStakingManager (PoS) ──
// Deployed at STAKING_MANAGER_ADDRESS. Permissionless staking with native tokens.
// Includes validator registration (payable), delegation, rewards, and PoS reads.
// The base ValidatorManager (getValidator, l1TotalWeight, etc.) lives at a
// separate address discovered via getStakingManagerSettings().manager.
export const STAKING_MANAGER_ABI = [
  // ── Reads ──
  {
    "type": "function", "name": "getStakingManagerSettings", "inputs": [],
    "outputs": [{ "name": "", "type": "tuple", "components": [
      { "name": "manager", "type": "address" },
      { "name": "minimumStakeAmount", "type": "uint256" },
      { "name": "maximumStakeAmount", "type": "uint256" },
      { "name": "minimumStakeDuration", "type": "uint64" },
      { "name": "minimumDelegationFeeBips", "type": "uint16" },
      { "name": "maximumStakeMultiplier", "type": "uint8" },
      { "name": "weightToValueFactor", "type": "uint256" },
      { "name": "rewardCalculator", "type": "address" },
      { "name": "uptimeBlockchainID", "type": "bytes32" }
    ]}],
    "stateMutability": "view"
  },
  {
    "type": "function", "name": "getStakingValidator",
    "inputs": [{ "name": "validationID", "type": "bytes32" }],
    "outputs": [{ "name": "", "type": "tuple", "components": [
      { "name": "owner", "type": "address" },
      { "name": "delegationFeeBips", "type": "uint16" },
      { "name": "minStakeDuration", "type": "uint64" },
      { "name": "uptimeSeconds", "type": "uint64" }
    ]}],
    "stateMutability": "view"
  },
  {
    "type": "function", "name": "getDelegatorInfo",
    "inputs": [{ "name": "delegationID", "type": "bytes32" }],
    "outputs": [{ "name": "", "type": "tuple", "components": [
      { "name": "status", "type": "uint8" },
      { "name": "owner", "type": "address" },
      { "name": "validationID", "type": "bytes32" },
      { "name": "weight", "type": "uint64" },
      { "name": "startTime", "type": "uint64" },
      { "name": "startingNonce", "type": "uint64" },
      { "name": "endingNonce", "type": "uint64" }
    ]}],
    "stateMutability": "view"
  },
  {
    "type": "function", "name": "weightToValue",
    "inputs": [{ "name": "weight", "type": "uint64" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function", "name": "valueToWeight",
    "inputs": [{ "name": "value", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "uint64" }],
    "stateMutability": "view"
  },
  // ── Writes ──
  {
    "type": "function", "name": "initiateValidatorRegistration",
    "inputs": [
      { "name": "nodeID", "type": "bytes" },
      { "name": "blsPublicKey", "type": "bytes" },
      { "name": "remainingBalanceOwner", "type": "tuple", "components": [
        { "name": "threshold", "type": "uint32" },
        { "name": "addresses", "type": "address[]" }
      ]},
      { "name": "disableOwner", "type": "tuple", "components": [
        { "name": "threshold", "type": "uint32" },
        { "name": "addresses", "type": "address[]" }
      ]},
      { "name": "delegationFeeBips", "type": "uint16" },
      { "name": "minStakeDuration", "type": "uint64" },
      { "name": "rewardRecipient", "type": "address" }
    ],
    "outputs": [{ "name": "", "type": "bytes32" }],
    "stateMutability": "payable"
  },
  {
    "type": "function", "name": "completeValidatorRegistration",
    "inputs": [{ "name": "messageIndex", "type": "uint32" }],
    "outputs": [{ "name": "", "type": "bytes32" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", "name": "initiateValidatorRemoval",
    "inputs": [
      { "name": "validationID", "type": "bytes32" },
      { "name": "includeUptimeProof", "type": "bool" },
      { "name": "messageIndex", "type": "uint32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", "name": "forceInitiateValidatorRemoval",
    "inputs": [
      { "name": "validationID", "type": "bytes32" },
      { "name": "includeUptimeProof", "type": "bool" },
      { "name": "messageIndex", "type": "uint32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", "name": "completeValidatorRemoval",
    "inputs": [{ "name": "messageIndex", "type": "uint32" }],
    "outputs": [{ "name": "", "type": "bytes32" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", "name": "initiateDelegatorRegistration",
    "inputs": [
      { "name": "validationID", "type": "bytes32" },
      { "name": "rewardRecipient", "type": "address" }
    ],
    "outputs": [{ "name": "", "type": "bytes32" }],
    "stateMutability": "payable"
  },
  {
    "type": "function", "name": "completeDelegatorRegistration",
    "inputs": [
      { "name": "delegationID", "type": "bytes32" },
      { "name": "messageIndex", "type": "uint32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", "name": "initiateDelegatorRemoval",
    "inputs": [
      { "name": "delegationID", "type": "bytes32" },
      { "name": "includeUptimeProof", "type": "bool" },
      { "name": "messageIndex", "type": "uint32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", "name": "forceInitiateDelegatorRemoval",
    "inputs": [
      { "name": "delegationID", "type": "bytes32" },
      { "name": "includeUptimeProof", "type": "bool" },
      { "name": "messageIndex", "type": "uint32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", "name": "completeDelegatorRemoval",
    "inputs": [
      { "name": "delegationID", "type": "bytes32" },
      { "name": "messageIndex", "type": "uint32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", "name": "claimDelegationFees",
    "inputs": [{ "name": "validationID", "type": "bytes32" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", "name": "submitUptimeProof",
    "inputs": [
      { "name": "validationID", "type": "bytes32" },
      { "name": "messageIndex", "type": "uint32" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
]

// ── Base ValidatorManager ──
// Address discovered at runtime via getStakingManagerSettings().manager.
// Holds the L1 validator set state: validator records, total weight, subnet ID.
export const VALIDATOR_MANAGER_ABI = [
  {
    "type": "function", "name": "getValidator",
    "inputs": [{ "name": "validationID", "type": "bytes32" }],
    "outputs": [{ "name": "", "type": "tuple", "components": [
      { "name": "status", "type": "uint8" },
      { "name": "nodeID", "type": "bytes" },
      { "name": "startingWeight", "type": "uint64" },
      { "name": "sentNonce", "type": "uint64" },
      { "name": "receivedNonce", "type": "uint64" },
      { "name": "weight", "type": "uint64" },
      { "name": "startTime", "type": "uint64" },
      { "name": "endTime", "type": "uint64" }
    ]}],
    "stateMutability": "view"
  },
  {
    "type": "function", "name": "l1TotalWeight",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint64" }],
    "stateMutability": "view"
  },
  {
    "type": "function", "name": "subnetID",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes32" }],
    "stateMutability": "view"
  },
  {
    "type": "function", "name": "isValidatorSetInitialized",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function", "name": "getNodeValidationID",
    "inputs": [{ "name": "nodeID", "type": "bytes" }],
    "outputs": [{ "name": "", "type": "bytes32" }],
    "stateMutability": "view"
  },
  {
    "type": "function", "name": "owner",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
]

export const FILE_MARKET_ABI = [
  {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "function",
    "name": "CANCEL_PENALTY_MAX_BPS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "CancellationPenaltyDistributed",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "penaltyAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "nodeCount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "newCount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "newBps",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ERC1967InvalidImplementation",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967NonPayable",
    "inputs": []
  },
  {
    "type": "event",
    "name": "ExpiredSlotsProcessed",
    "inputs": [
      {
        "name": "processedCount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "reporter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "FailedCall",
    "inputs": []
  },
  {
    "type": "event",
    "name": "ForcedOrderExits",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "orderIds",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "totalFreed",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
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
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "InvalidInitialization",
    "inputs": []
  },
  {
    "type": "event",
    "name": "KeyLeakReported",
    "inputs": [
      {
        "name": "node",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "reporter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "function",
    "name": "MAX_CHALLENGE_SLOTS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "NodeQuit",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "node",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "reason",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "NotInitializing",
    "inputs": []
  },
  {
    "type": "event",
    "name": "OnDemandChallengeExpired",
    "inputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "node",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "node",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "challenger",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "deadlineBlock",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "node",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "commitment",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
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
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "refundAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "node",
        "type": "address",
        "indexed": true,
        "internalType": "address"
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
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "numChunks",
        "type": "uint32",
        "indexed": false,
        "internalType": "uint32"
      },
      {
        "name": "periods",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      },
      {
        "name": "replicas",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
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
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "currentFilled",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      },
      {
        "name": "desiredReplicas",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
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
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "newMultiplier",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "rewardAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "slashedAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "newBps",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "periods",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "allowed",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
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
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "orderId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "challengedNode",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "deadlineBlock",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "failedNode",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "prover",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "commitment",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
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
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "function",
    "name": "UPGRADE_INTERFACE_VERSION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "error",
    "name": "UUPSUnauthorizedCallContext",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UUPSUnsupportedProxiableUUID",
    "inputs": [
      {
        "name": "slot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
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
    "name": "activeOrders",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "challengeNode",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_node",
        "type": "address",
        "internalType": "address"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "challengedNode",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "deadlineBlock",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "randomness",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "bool",
        "internalType": "bool"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_extension",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "currentEpoch",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_proof",
        "type": "uint256[4]",
        "internalType": "uint256[4]"
      },
      {
        "name": "_commitment",
        "type": "bytes32",
        "internalType": "bytes32"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "fallback",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "fspVerifier",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IFspVerifier"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "limit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "orderIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "total",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllSlotInfo",
    "inputs": [],
    "outputs": [
      {
        "name": "orderIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "challengedNodes",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "randomnesses",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "deadlineBlocks",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "isExpired",
        "type": "bool[]",
        "internalType": "bool[]"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "limit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "orderIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "total",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "claimable",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalEscrowHeld",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalRewardsPaid",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "averageOrderValue",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalStakeValue",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "activeOrdersCount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalEscrowLocked",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalNodes",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalCapacityStaked",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalCapacityUsed",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "activeChallengeSlots",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "currentPeriod_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "currentBlock_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "challengeableOrdersCount",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "activeChallenges",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "totalEarned",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "withdrawn",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "claimable",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "lastClaimPeriod",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_orderId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "owner_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "uri_",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "root_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "numChunks_",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "periods_",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "replicas_",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "filled_",
        "type": "uint8",
        "internalType": "uint8"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "totalEscrow",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "paidToNodes",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "remainingEscrow",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "escrow_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "withdrawn_",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "startPeriod_",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "expired_",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "nodes_",
        "type": "address[]",
        "internalType": "address[]"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOrderPrice",
    "inputs": [
      {
        "name": "_orderId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "idleSlotsCount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "expiredSlotsCount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "currentBlockNumber",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "challengeWindowBlocks",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "challengeableOrdersCount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalSlotsCount",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "orderIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "owners",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "numChunks",
        "type": "uint32[]",
        "internalType": "uint32[]"
      },
      {
        "name": "periods",
        "type": "uint16[]",
        "internalType": "uint16[]"
      },
      {
        "name": "replicas",
        "type": "uint8[]",
        "internalType": "uint8[]"
      },
      {
        "name": "filled",
        "type": "uint8[]",
        "internalType": "uint8[]"
      },
      {
        "name": "escrows",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "isActive",
        "type": "bool[]",
        "internalType": "bool[]"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "earned",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "withdrawn",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "pending",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalBurned",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalRewards",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "currentBps",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalClientComp",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "challengedNode",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "randomness",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "deadlineBlock",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "isExpired",
        "type": "bool",
        "internalType": "bool"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_nodeStaking",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_poiVerifier",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_fspVerifier",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_keyleakVerifier",
        "type": "address",
        "internalType": "address"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
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
        "type": "address",
        "internalType": "contract IKeyLeakVerifier"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "contract NodeStaking"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "deadlineBlock",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "randomness",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "challenger",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "fileRoot",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "filled",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "replicas",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "numChunks",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "periods",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "startPeriod",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "fileRoot",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "escrow",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "placeOrder",
    "inputs": [
      {
        "name": "_fileRoot",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_fileUri",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_numChunks",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "_periods",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "_replicas",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "_pricePerChunkPerPeriod",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_fspProof",
        "type": "uint256[4]",
        "internalType": "uint256[4]"
      }
    ],
    "outputs": [
      {
        "name": "orderId",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "contract IPoiVerifier"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_node",
        "type": "address",
        "internalType": "address"
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
    "name": "proofFailureSlashMultiplier",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "bytes32",
        "internalType": "bytes32"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "reportKeyLeak",
    "inputs": [
      {
        "name": "_node",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_proof",
        "type": "bytes",
        "internalType": "bytes"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_allowed",
        "type": "bool",
        "internalType": "bool"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_slashAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_reason",
        "type": "string",
        "internalType": "string"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_proof",
        "type": "uint256[4]",
        "internalType": "uint256[4]"
      },
      {
        "name": "_commitment",
        "type": "bytes32",
        "internalType": "bytes32"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_proof",
        "type": "uint256[4]",
        "internalType": "uint256[4]"
      },
      {
        "name": "_commitment",
        "type": "bytes32",
        "internalType": "bytes32"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
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
  }
]

export const NODE_STAKING_ABI = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "BURN_ADDRESS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address payable"
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
        "type": "uint64",
        "internalType": "uint64"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "string",
        "internalType": "string"
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
        "type": "uint64",
        "internalType": "uint64"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "newUsed",
        "type": "uint64",
        "internalType": "uint64"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "maxSlashable",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalCapacityStaked",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalCapacityUsed",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "stake",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "capacity",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "used",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "publicKey",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "limit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "addresses",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "total",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "requiredChunks",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
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
        "type": "uint64",
        "internalType": "uint64"
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
        "type": "address",
        "internalType": "address"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
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
        "type": "address",
        "internalType": "address"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "stake",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "capacity",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "used",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "publicKey",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "bytes32",
        "internalType": "bytes32"
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "newCapacity",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "willForceExit",
        "type": "bool",
        "internalType": "bool"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "forcedOrderExit",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "totalSlashed",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "_publicKey",
        "type": "uint256",
        "internalType": "uint256"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "newUsed",
        "type": "uint64",
        "internalType": "uint64"
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
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "orderIds",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "additionalSlash",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": false,
        "internalType": "uint64"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "releasedStake",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "newCapacity",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "additionalStake",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "newCapacity",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "slashAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "newCapacity",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "forcedOrderExit",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "stake",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "capacity",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
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
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "stakeReturned",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
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
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AddressEmptyCode",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967InvalidImplementation",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1967NonPayable",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FailedCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidInitialization",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotInitializing",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UUPSUnauthorizedCallContext",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UUPSUnsupportedProxiableUUID",
    "inputs": [
      {
        "name": "slot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  }
]

// ── MuriFaucet ──
// Simple testnet faucet — dispenses native tokens with a cooldown per address.
export const FAUCET_ABI = [
  {
    "type": "function",
    "name": "claim",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "canClaim",
    "inputs": [{ "name": "account", "type": "address" }],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "claimAmount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "cooldown",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lastClaim",
    "inputs": [{ "name": "", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "Claimed",
    "inputs": [
      { "name": "recipient", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": false }
    ]
  }
]
