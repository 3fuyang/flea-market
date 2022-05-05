import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueAxios from 'vue-axios'
import axios from 'axios'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'

const app = createApp(App)

// pinia实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app
  .use(pinia) 
  .use(router)  
  .use(ElementPlus)
  .use(VueAxios, axios)
  .mount('#app')
