import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueAxios from 'vue-axios'
import axios from 'axios'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

// pinia实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app
  .use(router)
  .use(pinia)  
  .use(ElementPlus)
  .use(VueAxios, axios)
  .mount('#app')
