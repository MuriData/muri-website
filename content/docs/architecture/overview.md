---
title: Architecture Overview
description: Deep dive into MuriData's system architecture
order: 1
---

# Architecture Overview

MuriData's architecture consists of three layers: the smart contract layer, the storage layer, and the proof layer.

## Smart Contract Layer

Two primary contracts manage the protocol:

### FileMarket

The `FileMarket` contract handles the storage marketplace:

- **Order Management** — Clients place orders with escrow, nodes execute them
- **Challenge System** — 5 parallel challenge slots verify node storage
- **Reward Distribution** — Period-based (7-day) reward accrual per node-order pair
- **Slashing** — Value-proportional penalties for failed challenges

### NodeStaking

The `NodeStaking` contract manages node registration:

- **Collateral** — Nodes stake AVAX proportional to their storage capacity
- **Capacity Tracking** — Used vs. available chunk-level accounting
- **ZK Key Registration** — Each node registers a Poseidon2-derived public key

## Proof Layer

The PoI (Proof of Integrity) circuit proves data possession:

```
Data → 16 KB chunks → Poseidon2 Merkle Tree
                            ↓
        8 deterministic leaf selections (bit-sliced randomness)
                            ↓
        Per-leaf Merkle proof verification
                            ↓
        aggMsg = H(leafHash[0], ..., leafHash[7], randomness)
                            ↓
        commitment = H(secretKey, aggMsg, randomness, publicKey)
                            ↓
        Groth16 proof → On-chain verification
```

### Public Inputs

| Input | Description |
|-------|-------------|
| `commitment` | Hash binding the proof to the prover's identity |
| `randomness` | Challenge seed determining which leaves to open |
| `publicKey` | Prover's registered ZK public key |
| `fileRootHash` | Merkle root of the file's chunk tree |

## Challenge Flow

1. A challenge slot targets a specific `(node, order)` pair
2. The node has `CHALLENGE_WINDOW_BLOCKS` (50 blocks, ~100s) to respond
3. The node fetches the file, builds/loads the SMT, generates a PoI proof
4. The on-chain verifier validates the Groth16 proof
5. Success advances the slot; failure triggers value-proportional slashing
