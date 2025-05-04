import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.50.106', // Укажите ваш IP-адрес
    port: 3000, // Укажите нужный порт
  },
})