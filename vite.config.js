import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import markdownPlugin from './plugins/vite-plugin-markdown.js'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    markdownPlugin(),
    nodePolyfills({
      include: ['buffer', 'crypto', 'stream', 'util', 'process', 'url'],
      globals: { Buffer: true, process: true },
    }),
  ],
})
