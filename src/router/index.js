import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home'
import Result from '../views/Result'
import Login from '../views/Login'
import Details from '../views/Details'
import Report from '../views/Report'

import Information from "../views/User/Info"
import History from "../views/User/History"
import Favorite from "../views/User/Favorite"
import Goods from "../views/User/Goods"
import Order from "../views/User/Order"
import Chat from "../views/User/Chat"
import Confirm from "../views/User/Confirm"
import Security from "../views/User/Security"
import ShoppingCart from "../views/User/ShoppingCart"
import Stream from "../views/User/Stream"
import Upload from "../views/User/Upload"

import AdminReport from "../views/Administrator/HandlingReports"

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
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
