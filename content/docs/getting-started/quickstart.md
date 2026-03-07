---
title: Quickstart
description: Get started with MuriData in minutes
order: 2
---

# Quickstart

This guide walks you through setting up a MuriData storage node on the Avalanche testnet.

## Prerequisites

- Go 1.24.4+
- An Avalanche Fuji testnet wallet with test AVAX
- IPFS daemon (Kubo) running locally

## 1. Install the Node

```bash
git clone https://github.com/muridata/muri-node.git
cd muri-node
go build -o murid ./cmd/murid/
```

## 2. Configure

Copy the example configuration and edit it:

```bash
cp murid.example.toml murid.toml
```

Key settings to configure:

```toml
[chain]
rpc_url = "https://api.avax-test.network/ext/bc/C/rpc"
chain_id = 43113
market_address = "0x..."

[ipfs]
api_url = "http://127.0.0.1:5001"

[node]
private_key_path = "./keys/evm.key"
secret_key_path = "./keys/zk.key"
data_dir = "./data"
keys_dir = "./keys"
```

## 3. Stake and Register

Before your node can accept storage orders, you need to stake AVAX and register your ZK public key:

```bash
# The node handles staking automatically on first run
./murid -config murid.toml
```

## 4. Monitor

Your node will automatically:
- Poll for and execute new storage orders
- Respond to PoI challenges within the challenge window
- Claim accumulated rewards periodically

Check the logs for activity:

```
INFO  challenge_loop: received challenge for order 42, slot 3
INFO  prover: generating PoI proof (8 openings)...
INFO  prover: proof generated in 38.2s
INFO  chain: submitting proof for slot 3...
INFO  chain: proof accepted, tx: 0xabc...
```
