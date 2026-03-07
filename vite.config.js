import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import markdownPlugin from './plugins/vite-plugin-markdown.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), markdownPlugin()],
})
