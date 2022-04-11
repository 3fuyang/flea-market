import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/Home.vue')
const Result = () => import('../views/Result.vue')
const NewResult = () => import('../views/NewResult.vue')
const Login = () => import('../views/Login.vue')
const Details = () => import('../views/Details.vue')
const Report = () => ('../views/Report.vue')

const Information = () => import("../views/User/Info.vue")
const History = () => import("../views/User/History.vue")
const Favorite = () => import("../views/User/Favorite.vue")
const Goods = () => import("../views/User/Goods.vue")
const Order = () => import("../views/User/Order.vue")
const Chat = () => import("../views/User/Chat.vue")
const Confirm = () => import("../views/User/Confirm.vue")
const NewConfirm = () => import("../views/User/NewConfirm.vue")
const Security = () => import("../views/User/Security.vue")
const ShoppingCart = () => import("../views/User/ShoppingCart.vue")
const Stream = () => import("../views/User/Stream.vue")

const AdminReport = () => import("../views/Administrator/HandlingReports.vue")

const routes = [
	//侧导航栏和顶部导航栏
	{ path: '/', 			redirect: '/home' }, // 重定向到首页
	{ path: '/home', 		component: Home },
	{ path: '/result',		redirect: '/newresult'},
	{ path: '/login', 		component: Login },
	{ path: '/newresult',  component: NewResult},
	//{ path: '/logout', 		redirect: '/home' },
	{ path: '/details',		component: Details},
  { path: '/report',		component: Report},

	{ path: '/info', 		component: Information },
	{ path: '/history', 	component: History },
	{ path: '/favorite', 	component: Favorite },
  { path: '/goods',		component: Goods},
	{ path: '/order', 		component: Order },
  { path: '/chat',		component: Chat},
  { path: '/confirm',		component: NewConfirm},
	{ path: '/security',	component: Security},
  { path: '/shoppingcart',component: ShoppingCart},
  { path: '/stream',		component: Stream},

	{ path: '/admin/report', component: AdminReport },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL,),
  routes
})

export default router
