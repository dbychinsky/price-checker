import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // server: {
    //     host: '192.168.169.162', // твой локальный IP
    //     port: 3000,             // нужный порт
    //     open: true,             // (опционально) чтобы автоматически открыть браузер
    // },
});