import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('css-doodle')
        }
      }
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8090,
    proxy: {
      "/api": {
        //target: "http://127.0.0.1:8082/api",
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
    chunkSizeWarningLimit: 600
  }
})