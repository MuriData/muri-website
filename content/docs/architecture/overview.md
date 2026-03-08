---
title: Architecture Overview
description: Deep dive into MuriData's system architecture, repositories, and technical stack
order: 1
---

# Architecture Overview

MuriData is a strictly decentralized, trustless architecture composed of multiple interacting software layers. To ensure modularity and separation of concerns, the system is split into five independent subprojects within a GitHub organization.

Here is a comprehensive breakdown of each layer.

---

## Smart Contracts (`muri-contracts`)

The on-chain settlement layer acting as the network's brain, deployed on a dedicated EVM-compatible Avalanche L1 chain. Written in Solidity and managed via Foundry.

### Modular Inheritance Chain
The core logic resides in a deep inheritance chain centered around the `FileMarket.sol` contract:
```text
Market.sol (Entrypoint)
  └─ MarketViews.sol (Read-only dashboards)
       └─ MarketAccounting.sol (Rewards and slashing)
            └─ MarketChallenge.sol (Parallel PoI challenge slots)
                 └─ MarketOrders.sol (Order lifecycle)
                      └─ MarketAdmin.sol (Admin limits)
                           └─ MarketStorage.sol (Shared state)
```

### Key Components:
- **`NodeStaking.sol`**: Manages collateralized staking. Nodes must deposit MURI tokens to gain writable storage capacity. Features robust reentrancy protection.
- **Challenge System**: An event-driven mechanism featuring N=5 independent challenge slots. It uses `block.number` deadlines instead of timestamps. Proof nonces dictate the randomness for the next slot.
- **`poi_verifier.sol`**: An auto-generated Groth16 zero-knowledge verifier validating proofs submitted by nodes.

---

## Zero-Knowledge Proofs (`muri-zkproof`)

The cryptographic verification layer written in Go leveraging the [gnark](https://github.com/Consensys/gnark) library. It compiles circuits into Groth16 keys over the BN254 curve.

### PoI (Proof of Integrity) Circuit
The MVP relies heavily on the PoI circuit. It proves a node knows exactly **8 randomly-selected chunks** inside a file's Merkle tree that hash to a given commitment, without revealing the chunk contents. 

- **Multi-Opening Design**: It opens 8 leaves in parallel without conditional logic, ensuring constant gas verification on-chain.
- **Parallel Sparse Merkle Trees**: The Go code builds the SMTs concurrently, scaling with CPU cores for drastically improved hashing speeds.
- **Checkpointed Persistence**: SMTs are saved using a graduated checkpoint scheme (e.g., levels 4, 9, 15, 20), balancing file IO overhead against fast in-memory reconstruction.

---

## Node Daemon (`muri-node`)

The storage provider daemon written in Go. Storage providers run this daemon to interface with the blockchain, manage local IPFS routing, and generate zk-proofs.

### The Three Loops
The daemon operates three highly concurrent, asynchronous loops:

1. **Challenge Loop**: Subscribes to smart contract events looking for challenges targeting the node's EVM address. If challenged, it dispatches workers to retrieve the file from IPFS, build the ZK Proof locally, and submit the payload back to the EVM contract.
2. **Order Loop**: Monitors the FileMarket for pending, under-replicated orders. It verifies the file integrity (fetching from IPFS, building an SMT, and comparing the root hash with the chain data) before consuming capacity to claim it.
3. **Maintenance Loop**: A background task executing passive behavior, including claiming outstanding token rewards and garbage-collecting unpinned IPFS files from expired or cancelled orders.

### Cryptographic Domains
Nodes utilize two distinct keys for security:
- **EVM Private Key (secp256k1)**: Used to sign and send L1 transactions (e.g., executing orders, submitting proofs, staking).
- **ZK Secret Key (BN254 Scalar)**: Used purely inside the gnark circuit logic as proof identity. The public key equivalent is a Poseidon2 hash visible on-chain.

---

## Frontend Web App (`muri-website`)

A React 19 + Vite 7 Single Page Application. 

### Component Architecture
The application employs a strict three-tier hierarchy:
1. **Primitives**: Atomic UI elements (Panels, Buttons, Badges).
2. **Composites**: Pre-assembled clusters (e.g., a FeatureCard merging a Badge and a Divider).
3. **Sections**: Full-width page blocks (Hero, Features grid, Dashboard).

### Design Aesthetics
- Extensively uses a **Token-Driven Design System**. ~50 CSS custom properties (colors, layout) are orchestrated in `src/styles/tokens.css`.
- Does **not** rely on utility frameworks like Tailwind or CSS-in-JS.
- Dynamic color palette primarily featuring Canvas, Surface, Mint, and Teal.
- Uses the **Quicksand** font over a fully responsive 12-column CSS Grid.