---
title: Introduction
description: Learn what MuriData is, why it exists, and how it works
order: 1
---

# Introduction

Verifiable storage or hot retrieval? MuriData wants both. It is a decentralized storage marketplace that replaces trust with math. Zero-knowledge proofs continuously verify that storage providers hold your data, without ever revealing the data itself.

No heavy work. No dependence on special hardware. MuriData allows even a laptop to store and earn.

## Why MuriData

When you store a file with a cloud provider, you trust them to keep it safe. But trust breaks down at scale — providers can lose data, lie about availability, or silently drop files nobody has accessed in months. You would never know until it is too late.

MuriData removes that uncertainty. The protocol uses zero-knowledge proofs to **mathematically guarantee** that storage providers still hold your data. Every claim is proven on-chain; no trust required, just math.

The protocol is designed to hold many participants, scaling efficiently while strengthening both the economy and security of the network.

## How It Works

Here is how your data stays safe — from upload to ongoing verification.

### Upload

You send a file. It is split into small chunks and organized into a Merkle tree — a cryptographic structure that makes every piece independently verifiable. An order is placed on the marketplace smart contract, and your payment is locked in escrow.

### Store

Storage providers browse available orders and claim yours. They download the file, pin it to IPFS, and put up collateral as a guarantee. No GPUs or special hardware needed — anyone with spare disk space can participate. Your file can be replicated across multiple independent nodes for extra safety.

### Prove

The protocol continuously picks random nodes and challenges them: "Prove you still have this file." The challenged node generates a zero-knowledge proof — a compact cryptographic answer that can only be produced if the node actually holds the data. This proof is verified on-chain automatically. Nodes have a short window to respond, keeping the network honest around the clock.

### Settle

Honest nodes earn periodic MURI rewards for their service. Nodes that fail a challenge get their collateral slashed — the penalty is proportional to the value they were entrusted with. Slashed funds go back to affected clients and to community members who help monitor the network. Good behavior pays; bad behavior costs.

## MuriCoin

MuriCoin (MURI) powers every layer of the protocol. Clients pay in MURI to store data. Storage nodes stake MURI as collateral and earn periodic rewards for honest service. Failed challenges trigger slashing — redistributed to reporters and affected clients. The more you stake, the more you earn — but the more you lose if you cheat.

## The Stack

MuriData is built from four open-source components:

- **Smart Contracts** — The on-chain marketplace. Handles orders, payments, staking, challenges, and settlement. Written in Solidity, deployed on Avalanche.
- **ZK Proof System** — The cryptographic engine. Generates and verifies proofs that nodes hold the data they claim. Built with gnark, a Go-based framework for zero-knowledge circuits.
- **Storage Node** — The software that storage providers run. It watches the chain for orders, stores files via IPFS, and automatically responds to challenges with proofs. Designed to run on modest hardware.
- **ZK Artifacts** — Pre-built cryptographic keys and verifier contracts shared between the smart contracts and storage nodes, so the whole system speaks the same proof language.

Together, these pieces create a closed loop: clients pay to store, nodes stake to serve, proofs keep everyone honest, and the chain settles everything transparently.

## Next Steps

- [Quickstart Guide](/docs/getting-started/quickstart) — Set up a storage node and start earning
- [Architecture Overview](/docs/architecture/overview) — Deep dive into the system design
