---
title: Quickstart
description: Get started developing and running MuriData node and website
order: 2
---

# Quickstart Guide

This guide covers the two primary ways to interact with the MuriData network: uploading files as a customer, and earning yield as a storage node operator.

---

## 1. Uploading Files via the Console

The easiest way to store data on MuriData is through the web Console.

### Prerequisites
- A Web3 Wallet (e.g., MetaMask, Core) connected to the **MuriData L1 Network**.
- MURI tokens to pay for storage. You can get free testnet tokens from the [Testnet Faucet](https://testnet-faucet.muri.moe/).

### Steps
1. Navigate to the **MuriData Console** in your browser.
2. Click **Connect Wallet** in the top right corner.
3. Once connected, navigate to the **Upload** section.
4. Drag and drop your file into the upload zone, or click to browse.
5. The Console will automatically calculate the storage cost based on the file size and the current network storage rate.
6. Click **Confirm Upload**. Your wallet will prompt you to approve the transaction locking your MURI tokens in the `FileMarket` smart contract.
7. Upon transaction success, your file is immediately pinned to IPFS by your local browser node and broadcasted to the network. MuriData Storage Nodes will automatically detect the order, download the file, and begin generating Zero-Knowledge proofs to secure it.

You can monitor the status of your file and the nodes securing it via the **Explorer** tab.

---

## 2. Becoming a Node Operator

Anyone with spare hard drive space can earn yield by running the `murid` storage daemon. The easiest way to run the node is via Docker Compose, which automatically provisions the required Avalanche RPC node and IPFS node alongside the MuriData daemon.

### Prerequisites
- **Git** and **Docker Compose** installed on your machine.
- A stable internet connection and sufficient hard drive space.
- MURI tokens (for staking collateral). Use the [Testnet Faucet](https://testnet-faucet.muri.moe/) to get free testnet tokens.

### Steps

All `docker compose` commands below use two compose files: the base `docker-compose.yml` (IPFS + murid) and `docker-compose.avago.yml` (Avalanche RPC node). For convenience, you can create a `.env` file or shell alias, but the full form is shown here.

1. **Clone the Repository**
   Clone the `muri-node` repository to your local machine:
   ```bash
   git clone https://github.com/MuriData/muri-node.git
   cd muri-node/docker
   ```

2. **Initialize the Node**
   Run the interactive initialization wizard. This step securely generates your node's EVM wallet and ZK-proof keys:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.avago.yml run --rm murid init
   ```
   *Note: Safely back up the mnemonic phrase generated during this step.*

3. **Fund Your Node**
   Send MURI tokens to the EVM address generated in the previous step. You need tokens to pay for gas fees and to stake as collateral. Use the [Testnet Faucet](https://testnet-faucet.muri.moe/) to get free testnet tokens.

4. **Stake Collateral**
   Specify how much storage capacity (in GB) you want to offer to the network. The daemon will calculate and stake the required collateral automatically:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.avago.yml run --rm murid stake -capacity-gb 100
   ```

5. **Start Earning**
   Start the daemon in the background. It will automatically listen for new storage orders from the smart contract, fetch data via IPFS, and submit Zero-Knowledge proofs to the network to earn your yield:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.avago.yml up -d
   ```

You can view your node's live logs and proof generation status at any time:
```bash
docker compose -f docker-compose.yml -f docker-compose.avago.yml logs -f murid
```

---

## 3. Exiting the Network (Quitting)

If you decide to stop participating as a Node Operator, you must gracefully exit the network to retrieve your staked collateral.

> [!WARNING]
> MuriData distributes storage payouts on a **7-day billing period**. Additionally, there is a strict distinction between gracefully expiring orders, voluntarily quitting early (cancellation penalty), and going offline (slashing).

### Steps

1. **Initiate Unstake**
   Tell the smart contract that you want to stop accepting new storage orders:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.avago.yml run --rm murid unstake
   ```
   *Note: This prevents new orders from being assigned to you, but you are still responsible for your existing active storage commitments until they naturally expire.*

2. **Wait for Expiration vs. Quitting Early**
   You have two choices for your active orders:
   - **Graceful Expiration:** Keep your `murid` daemon running until all your current orders naturally expire. You will receive your full yield.
   - **Quit Early (Cancellation Penalty):** If you cannot wait, you can forcefully quit your active orders. **Doing so incurs a cancellation penalty** (a portion of your staked collateral is slashed because you failed to serve the order for its full duration).

   > [!CAUTION]
   > Do not simply turn off your daemon. **If your node goes offline** while you have active orders, you will fail PoI challenges and suffer **severe slashing penalties**, resulting in a significant loss of funds.

3. **Withdraw Collateral & Earnings**
   Once your node has zero active orders (either gracefully expired or forcefully quit), you can safely withdraw your MURI tokens back to your node's EVM wallet:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.avago.yml run --rm murid withdraw
   ```

4. **Transfer Funds Out**
   Transfer the MURI tokens and any native gas tokens from your node's CLI wallet back to your personal Web3 wallet:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.avago.yml run --rm murid wallet send -to 0xYourPersonalWalletAddress -amount ALL
   ```

5. **Stop the Daemon**
   Finally, safely shut down the IPFS node, Avalanche RPC node, and `murid` daemon containers:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.avago.yml down
   ```