---
title: Introducing MuriData
date: 2026-03-01
author: MuriData Team
tags: [announcement, protocol]
description: Announcing MuriData — a decentralized storage marketplace with zero-knowledge proof of integrity.
---

# Introducing MuriData

We're excited to announce MuriData, a decentralized storage marketplace that uses zero-knowledge proofs to guarantee data integrity on-chain.

## The Problem

Existing decentralized storage solutions face a fundamental trust problem: how do you verify that a storage provider is actually holding your data? Most solutions rely on periodic sampling or reputation systems, which leave room for cheating.

## Our Approach

MuriData solves this with **Proof of Integrity (PoI)** — a Groth16 zero-knowledge proof that cryptographically verifies a storage node possesses the data it claims to store, without revealing the data itself.

### How PoI Works

When challenged, a storage node must prove it holds a file by:

1. Opening 8 randomly-selected chunks from the file's Merkle tree
2. Generating a Groth16 proof binding the openings to its registered identity
3. Submitting the proof on-chain within a 50-block window (~100 seconds)

The randomness is derived from on-chain data, making it unpredictable. The multi-opening design means a node must hold the entire file — it can't just store a few popular chunks.

## What's Next

We're currently running on the Avalanche Fuji testnet with our MVP implementation:

- **232 smart contract tests** passing across 8 test suites
- **~80K constraint** PoI circuit with 8 parallel openings
- **5 concurrent challenge slots** for parallel verification
- **Full storage node daemon** with automatic challenge response

Stay tuned for our mainnet launch and additional protocol features including archive sealing and enhanced storage guarantees.

## Get Involved

- Check out our [documentation](/docs/getting-started/introduction)
- Follow us on Twitter for updates
- Join our Discord community
