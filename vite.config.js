import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import markdownPlugin from './plugins/vite-plugin-markdown.js'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  // Relative paths so assets resolve under any subpath (e.g. /ipfs/CID/)
  base: './',
  plugins: [
    react(),
    markdownPlugin(),
    nodePolyfills({
      include: ['buffer', 'crypto', 'stream', 'util', 'process', 'url'],
      globals: { Buffer: true, process: true },
    }),
  ],
  build: {
    // Inline fonts and small assets as base64 (up to 1 MB) to avoid
    // dozens of separate font files that each need their own IPFS order.
    assetsInlineLimit: 1024 * 1024,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Merge all JS into a single chunk. Workers are still separate
        // entries and unaffected. This trades initial load size for far
        // fewer files — critical for decentralized storage where each
        // file is an individual on-chain order.
        manualChunks: () => 'app',
      },
    },
  },
})
