import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub Pages repo path for assets to resolve.
// https://vite.dev/config/
export default defineConfig({
  base: '/cyberxi-savvy/',
  plugins: [react()],
})
