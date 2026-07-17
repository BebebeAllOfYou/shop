import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Позволяет открывать любой маршрут напрямую (например /catalog)
  // в режиме разработки и при preview.
  // Для продакшн-хостинга (Nginx, Apache) нужно отдельно настроить
  // редирект всех запросов на index.html.
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
})
