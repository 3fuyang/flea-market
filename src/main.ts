import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import router from './router'
import 'css-doodle'

const app = createApp(App)

if (import.meta.env.DEV) {
  // Turn on the performance inspector
  app.config.performance = true
}

// pinia实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app
  .use(pinia)
  .use(router)
  .mount('#app')
