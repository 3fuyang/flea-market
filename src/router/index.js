import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Result from '../views/Result.vue'
import Login from '../views/Login.vue'
import Details from '../views/Details.vue'
import Report from '../views/Report.vue'

import Information from "../views/User/Info.vue"
import History from "../views/User/History.vue"
import Favorite from "../views/User/Favorite.vue"
import Goods from "../views/User/Goods.vue"
import Order from "../views/User/Order.vue"
import Chat from "../views/User/Chat.vue"
import Confirm from "../views/User/Confirm.vue"
import Security from "../views/User/Security.vue"
import ShoppingCart from "../views/User/ShoppingCart.vue"
import Stream from "../views/User/Stream.vue"
import Upload from "../views/User/Upload.vue"

import AdminReport from "../views/Administrator/HandlingReports.vue"

const routes = [
	//侧导航栏和顶部导航栏
	{ path: '/', 			redirect: '/home' }, // 重定向到首页
	{ path: '/home', 		component: Home },
	{ path: '/result',		component: Result},
	{ path: '/login', 		component: Login },
	//{ path: '/logout', 		redirect: '/home' },
	{ path: '/details',		component: Details},
  { path: '/report',		component: Report},

	{ path: '/info', 		component: Information },
	{ path: '/history', 	component: History },
	{ path: '/favorite', 	component: Favorite },
  { path: '/goods',		component: Goods},
	{ path: '/order', 		component: Order },
  { path: '/chat',		component: Chat},
  { path: '/confirm',		component: Confirm},
	{ path: '/security',	component: Security},
  { path: '/shoppingcart',component: ShoppingCart},
  { path: '/stream',		component: Stream},
  { path: '/upload',		component: Upload},

	{ path: '/admin/report', component: AdminReport },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL,),
  routes
})

export default router
