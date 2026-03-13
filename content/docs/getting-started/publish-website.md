# Publishing a Static Website on MuriData

Host any static website (React, Vue, plain HTML, docs sites, etc.) on IPFS with MuriData decentralized storage guarantees using the `murid web publish` CLI.

## How It Works

MuriData stores individual files as separate on-chain orders. A static website is a directory of files, so publishing involves:

1. **Upload** the directory to IPFS (Kubo recursive add)
2. **Generate an FSP proof** for each file and directory DAG node
3. **Place an order** on-chain for each entry

IPFS directories are represented as DAG-PB protobuf nodes. These directory nodes are stored as raw block orders using the `ipfs://CID?type=raw` URI convention. This allows IPFS gateways to traverse the directory structure and resolve paths like `/index.html` or `/assets/style.css`.

## Prerequisites

- **murid binary** — built from `muri-node` (`go build -o murid ./cmd/murid/`)
- **murid.toml** — configured with chain RPC, IPFS API, wallet, and ZK keys
- **IPFS node** — running Kubo with API accessible (default `http://127.0.0.1:5001`)
- **FSP keys** — `fsp_prover.key` and `fsp_verifier.key` in your keys directory
- **Funded wallet** — enough MURI for order escrow + gas fees
- **Built website** — production build output (e.g. `dist/` from Vite/webpack)

## Quick Start

```bash
# Build your website
cd my-website
npm run build

# Publish to MuriData (adjust parameters to your needs)
murid web publish \
  -config murid.toml \
  -dir ./dist \
  -periods 4 \
  -replicas 3 \
  -price 1000000000000
```

## Command Reference

```
murid web publish [flags]

Flags:
  -config string    Path to config file (default "murid.toml")
  -dir string       Local directory to publish (required)
  -periods uint     Number of storage periods (default 1)
  -replicas uint    Number of replicas per file (default 1)
  -price string     Price per chunk per period in wei (required)
```

### Parameters

| Flag | Description |
|------|-------------|
| `-dir` | Path to the built website directory (e.g. `./dist`) |
| `-periods` | How many 7-day periods to store the data |
| `-replicas` | Number of storage nodes per file (more = higher availability) |
| `-price` | Payment per 16 KB chunk per period per replica, in wei |

### Cost Formula

```
cost per file = numChunks * periods * replicas * price
total cost = sum of all file costs + gas fees
```

Where `numChunks = ceil(fileSize / 16384)`. A 1 MB file = 63 chunks.

## Optimizing for Fewer Orders

Each file in the directory becomes a separate on-chain order. Fewer files = fewer orders = lower gas costs. Optimize your build:

### Vite

```js
// vite.config.js
export default defineConfig({
  build: {
    // Inline fonts/small assets as base64 (up to 1 MB)
    assetsInlineLimit: 1024 * 1024,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Merge all JS into a single chunk
        manualChunks: () => 'app',
      },
    },
  },
})
```

### webpack

```js
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: false,
    runtimeChunk: false,
  },
  module: {
    rules: [{
      test: /\.(woff2?|ttf|eot|svg|png|jpg|gif)$/,
      type: 'asset/inline', // inline all assets as base64
    }],
  },
}
```

This can reduce a typical React app from 100+ files to ~10-15.

## IPFS Subpath Hosting

When hosted on IPFS, the site is served under a subpath like `/ipfs/<CID>/`. This requires two adjustments:

### 1. Hash-based Routing

IPFS gateways serve static files — there are no server-side redirects. Client-side routing with `BrowserRouter` (React Router) or `createWebHistory` (Vue Router) will fail for direct URL access. Use hash-based routing instead:

**React Router:**
```jsx
import { HashRouter } from 'react-router-dom'

// Routes become /#/console instead of /console
<HashRouter>
  <App />
</HashRouter>
```

**Vue Router:**
```js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
```

### 2. Relative Asset Paths

Assets referenced with absolute paths (`/assets/index.js`) won't resolve under `/ipfs/<CID>/`. Configure your bundler to use relative paths:

**Vite:** Add `base: './'` to `vite.config.js`

**webpack:** Set `output.publicPath: './'`

**Create React App:** Set `"homepage": "."` in `package.json`

### 3. Web Workers

Workers loaded from absolute paths need adjustment. Derive the base URL from `self.location`:

```js
// In your worker file
const _base = self.location.href.replace(/\/assets\/.*$/, '/')

importScripts(_base + 'wasm_exec.js')
fetch(_base + 'my-asset.wasm')
```

## Example Output

```
$ murid web publish -dir ./dist -periods 8 -replicas 3 -price 1000000000000

Initializing FSP prover...
Uploading /path/to/dist to IPFS...
Uploaded 15 entries to IPFS

Files: 13, Directory nodes: 2
Periods: 8, Replicas: 3, Price: 1000000000000 wei/chunk/period

[1/15] assets/index-BKE3E7gT.js (CID: bafybeie...)
  8279232 bytes, generating FSP proof...
  Chunks: 506, Root: 0x1916...
  Placing order (cost: 12144000000000000 wei)...
  Order #29 placed (tx: 0xe72f...)
...
[15/15] (root directory) (CID: bafybeiff2aog...)
  555 bytes, generating FSP proof...
  Chunks: 1, Root: 0x9c41...
  Placing order (cost: 24000000000000 wei)...
  Order #43 placed (tx: 0x196d...)

========== PUBLISH SUMMARY ==========
  OK    assets/index-BKE3E7gT.js -> order #29
  OK    assets/style-ALQTxEeV.css -> order #32
  OK    index.html -> order #39
  OK    muri.wasm -> order #40
  OK    assets -> order #42
  OK    (root) -> order #43
  ...

Orders: 15 succeeded, 0 failed
Total cost: 46560000000000000 wei (0.046560 MURI)

Root CID: bafybeiff2aogkbwvcrdu6i56wvx6hnzov56t27y2dbnjbpsoda6yskgwam
Access via IPFS gateway: https://ipfs.io/ipfs/bafybeiff2aogkbwvcrdu6i56wvx6hnzov56t27y2dbnjbpsoda6yskgwam
```

## Accessing Your Site

After publishing, the site is available through any IPFS gateway:

- **Local gateway:** `http://127.0.0.1:8080/ipfs/<root-CID>/`
- **Public gateways:**
  - `https://ipfs.io/ipfs/<root-CID>/`
  - `https://<root-CID>.ipfs.dweb.link/`
  - `https://<root-CID>.ipfs.cf-ipfs.com/`

### Persistent Naming

IPFS CIDs change when content changes. For a stable URL across updates:

- **DNSLink:** Add a DNS TXT record `_dnslink.example.com` → `dnslink=/ipfs/<root-CID>`. Access via `https://ipfs.io/ipns/example.com`. Update the TXT record when you republish.
- **IPNS:** Generate a key (`ipfs key gen mysite`), then publish (`ipfs name publish --key=mysite /ipfs/<CID>`). Note: IPNS records expire after 48h and require periodic re-publishing by an online node.

## Architecture

```
Local directory
  ├── index.html          ─→ order (ipfs://CID)
  ├── assets/
  │   ├── index.js        ─→ order (ipfs://CID)
  │   └── style.css       ─→ order (ipfs://CID)
  ├── favicon.png         ─→ order (ipfs://CID)
  └── (directory DAGs)
      ├── assets/          ─→ order (ipfs://CID?type=raw)  ← DAG-PB node
      └── (root wrap)      ─→ order (ipfs://CID?type=raw)  ← DAG-PB node
```

Each file gets a standard `ipfs://CID` URI. Directory DAG nodes get `ipfs://CID?type=raw` to signal that storage nodes should use `block/get` instead of `cat` when fetching the data for proof generation. The `?type=raw` convention uses the free-form URI string field in the order — no contract changes are needed.

Storage nodes that execute these orders will store and prove all the data. When challenged, nodes generate PoI proofs against both file data and raw directory blocks identically (any byte stream works with the Poseidon2 Merkle tree).
