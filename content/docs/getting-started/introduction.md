---
title: Introduction
description: Learn what MuriData is and how it works
order: 1
---

# Introduction

MuriData is a decentralized storage marketplace built on Avalanche. It uses zero-knowledge proofs to verify that storage providers are honestly holding your data — without revealing the data itself.

## How It Works

The protocol operates through three main components:

1. **Smart Contracts** — Handle payments, staking, and challenge resolution on-chain
2. **Storage Nodes** — Store files and respond to cryptographic challenges
3. **ZK Proof System** — Generates Proof of Integrity (PoI) to verify storage

## Key Features

- **Cryptographic Verification** — Every storage claim is backed by a Groth16 zero-knowledge proof
- **Economic Security** — Nodes stake collateral that gets slashed for misbehavior
- **Decentralized** — No single point of failure, files are replicated across independent nodes
- **Cost Effective** — Market-driven pricing with transparent on-chain settlement

## Architecture Overview

```
Client → FileMarket Contract → Storage Nodes → PoI Challenges → On-chain Verification
```

The client uploads a file and places an order through the `FileMarket` contract. Storage nodes execute the order, pin the file via IPFS, and build a Merkle tree over the file chunks. When challenged, the node generates a PoI proof opening 8 random leaves in the Merkle tree, which is verified on-chain by the Groth16 verifier.

## Next Steps

- [Quickstart Guide](/docs/getting-started/quickstart) — Get up and running in minutes
- [Architecture Overview](/docs/architecture/overview) — Deep dive into the system design
