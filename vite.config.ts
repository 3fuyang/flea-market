// vite.config.ts
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8090,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8082/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/captcha": {
        target: "http://utf8.api.smschinese.cn/",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/captcha/, '')
      }
    },
  },
  build: {
    rollupOptions: {
      output: {
        // rollup.js分包，控制chunk大小
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  }  
})