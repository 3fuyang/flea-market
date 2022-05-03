import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueAxios from 'vue-axios'
import axios from 'axios'
import TopNav from './components/TopNav.vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(piniaPersist)

createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(VueAxios, axios)
  .use(pinia)
  .component("top-nav", TopNav)
  .mount('#app')
