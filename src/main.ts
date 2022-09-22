import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import router from './router'
import 'css-doodle'

const app = createApp(App)

// pinia实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app
  .use(pinia)
  .use(router)
  .mount('#app')

axios.interceptors.response.use((res) => res, (err) => {
  if (err.response.status === 401) {

    location.replace('/login')
  }
})
