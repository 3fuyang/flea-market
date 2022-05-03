import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueAxios from 'vue-axios'
import axios from 'axios'
import TopNav from './components/TopNav.vue'
import { createPinia } from 'pinia'
import { createPersistPlugin } from 'pinia-persist-plugin'

const pinia = createPinia()
const plugin = createPersistPlugin()
pinia.use(plugin)

createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(VueAxios, axios)
  .use(pinia)
  .component("top-nav", TopNav)
  .mount('#app')
