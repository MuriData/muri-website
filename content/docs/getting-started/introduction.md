---
title: Introduction
description: Learn what MuriData is, why it exists, and how it works
order: 1
---

# Introduction to MuriData

MuriData is a decentralized storage marketplace and zero-knowledge proof network. It provides verifiable, secure data storage on a diverse network of independent nodes, orchestrated via smart contracts on a dedicated high-performance Avalanche L1 chain.

## Core Philosophy

MuriData is built on three foundational pillars:

1. **Efficient**: No heavy lifting required. MuriData avoids dependence on expensive, specialized hardware, allowing anyone—even users with a standard laptop—to store data and earn yield.
2. **Scalable**: The protocol is designed to support a massive number of participants. Adding more nodes scales the network efficiently while simultaneously strengthening its economy and security.
3. **Verifiable**: Zero-knowledge proofs continuously verify that providers hold your data. Every claim is proven on-chain; no trust is required, just math.

## The Limit of Content-Addressable Networks

Traditional cloud storage relies heavily on trusted central authorities to guarantee data availability and integrity. If the provider suffers an outage, changes its terms, or goes out of business, your data is at risk. 

To solve this centralization issue, Content-Addressable Networks (like IPFS) introduced peer-to-peer routing where files are requested by their cryptographic hash (content) rather than a physical location (server IP). 

However, these networks primarily solve *routing and exchange*. They excel at finding data if it is available, but **they do not guarantee that the data actually exists or persists over time**. If you upload a file to a content-addressable network and turn off your computer, and no other node chooses to retain it, that file disappears.

This leads to the inherent **reliability problem**: how do you economically incentivize independent, unpermissioned nodes to reliably store and serve your data over the long term, without resorting back to centralized contracts?

## The Shortcomings of Existing Solutions

While several decentralized storage systems attempt to solve this reliability problem by paying nodes to store data, they introduce complex trust challenges of their own:

1. **Storage Sybil Attacks (Deduplication):** A single operator runs multiple "node identities" but only stores the data on one physical hard drive. The network mistakenly believes data is highly replicated when it is actually vulnerable to a single hardware failure.
2. **Data Silencing:** Without retrieving the entire file, it's difficult to prove a node hasn't silently deleted or corrupted parts of the file over time.
3. **Availability & "Lazy" Serving:** A node might retain the data to pass storage audits but refuse to actually serve the data to peers when requested, rendering the file useless to the network.

## How MuriData Solves This

MuriData addresses these systemic vulnerabilities through a layered architectural approach built on Zero-Knowledge proofs and bonded economics. Instead of trusting nodes to behave, the protocol forces them to mathematically prove it.

1. **Proof of Integrity (PoI):** Periodically challenges storage nodes to generate a Zero-Knowledge Proof proving they hold specific, randomly selected chunks of a file. This ensures data integrity without the network needing to download the entire file.
2. **Proof of Probing (PoP):** Verifies a node's timely serving behavior. It utilizes a distributed "checker pool" to perform random retrieval probes, ensuring that nodes don't just store data, but actually serve it to the network.
3. **Measurable Unique Replica Integrity (MURI):** The flagship protocol that guarantees physical redundancy. It ensures that every replica on the network is mathematically unique to the node storing it, making it impossible for operators to fake redundancy by deduplicating files.

## The Sweet Spot

By combining IPFS routing with zero-knowledge cryptographic proofs and blockchain-based economic incentives, MuriData achieves a unique balance in the decentralized storage landscape. It hits the "sweet spot" between **fast data retrieval**, **highly reliable storage guarantees**, and **low hardware dependence**.

## Who is MuriData For?

MuriData is designed as a balanced, multi-sided marketplace that provides immense value to several key participants:

### 1. Customers (Data Owners & Developers)
For developers building dApps, NFT creators, or enterprises needing archival storage, MuriData offers **provable permanence**. You no longer need to run your own IPFS pinning servers or trust a centralized Web2 provider. You pay the network, and the protocol cryptographically guarantees your data is replicated, intact, and available.

**How it works:**
1. Acquire MURI tokens (get free testnet tokens from the [Testnet Faucet](https://testnet-faucet.muri.moe/)).
2. Upload your file via the MuriData Web Console or developer SDK (MuriData Platform will support S3 in the near future).
3. The smart contract locks your payment and matching nodes automatically download and seal your data.

### 2. Node Operators (Storage Providers & Checkers)
Anyone with spare hard drive space and a reliable internet connection can become a Node Operator. MuriData allows even laptop users to participate, as the protocol relies on smart economics and zero-knowledge math rather than expensive enterprise hardware. Crucially, **all Storage Nodes also act as Checkers**. The network pays nodes not just to store data, but to constantly audit *other* nodes for availability via the Proof of Probing (PoP) protocol.

**How to start earning:**
1. Stake MURI tokens as collateral.
2. Run the lightweight, dockerized `murid` daemon.
3. The daemon automatically listens for storage orders, generates ZK proofs for your stored data, and audits other nodes on the network to securely earn yield.

## Potential Use Cases

Any application that needs provably available, decentralized off-chain storage can leverage MuriData:

- **dApp Storage**: Move user data, media, and app state off-chain without adding a centralized backend.
- **NFT & Metadata**: Assets are publicly retrievable via IPFS; anyone can fetch your NFT images directly, ensuring permanence.
- **Data Archival**: Cost-effective long-term storage with economic guarantees. Nodes are financially committed, so walking away means losing their stake.
- **Gaming Assets**: Store maps, replays, and player data with low-latency IPFS retrieval.
- **AI & ML Datasets**: Store large training sets affordably across many nodes. Permissionless access means any pipeline can fetch data directly.
- **Static Websites**: Host frontends and static sites on IPFS-backed storage for decentralized hosting with guaranteed uptime.

## System Architecture

The MuriData ecosystem consists of five independent subprojects working together within a unified organization structure:

- **`muri-contracts`**: The Solidity smart contracts deployed on the dedicated Avalanche L1, acting as the network's settlement layer.
- **`muri-zkproof`**: The Go-based zero-knowledge proof circuits that generate the cryptographic challenges.
- **`muri-artifacts`**: A repository of generated Groth16 verify keys.
- **`muri-node`**: The Go storage provider daemon that connects to the L1, stores files via IPFS, and generates ZK proofs when challenged.
- **`muri-website`**: The React + Vite web application serving as the landing page, user console, and network dashboard.