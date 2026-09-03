import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Use polling instead of native fs.watch to avoid EBUSY errors
      // caused by OneDrive/cloud sync locking files during sync
      usePolling: true,
      interval: 1000
    }
  }
})

