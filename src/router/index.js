import { createRouter, createWebHistory } from 'vue-router'

const NewHome = () => import('../views/NewHome.vue')
const Result = () => import('../views/NewResult.vue')
const Login = () => import('../views/Login.vue')
const Details = () => import('../views/Details.vue')

const Information = () => import("../views/User/Info.vue")
const History = () => import("../views/User/History.vue")
const Favorite = () => import("../views/User/Favorite.vue")
const Goods = () => import("../views/User/Goods.vue")
const Order = () => import("../views/User/Order.vue")
const Chat = () => import("../views/User/Chat.vue")
const NewConfirm = () => import("../views/User/NewConfirm.vue")
const Security = () => import("../views/User/Security.vue")
const ShoppingCart = () => import("../views/User/ShoppingCart.vue")
const Trade = () => import("../views/User/Trade.vue")

const DealReport = () => import("../views/Administrator/DealingReports.vue")

const routes = [
	{ path: '/', 			redirect: '/home' }, // 重定向到首页
	{ path: '/home', 		component: NewHome },
	{ path: '/result',		component: Result},
	{ path: '/login', 		component: Login },
	{ path: '/details',		component: Details},

	{ path: '/info', 		component: Information },
	{ path: '/history', 	component: History },
	{ path: '/favorite', 	component: Favorite },
  { path: '/goods',		component: Goods},
	{ path: '/order', 		component: Order },
  { path: '/chat',		component: Chat},
  { path: '/confirm',		component: NewConfirm},
	{ path: '/security',	component: Security},
  { path: '/shoppingcart',component: ShoppingCart},
  { path: '/trade',		component: Trade},

	{ path: '/admin/report', component: DealReport },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL,),
  routes
})

// 对所有人公开的路由
const publicRoutes = ['/home', '/result', '/details']
// 需对普通会员鉴权的路由
const memberRoutes = ['/info', '/history', '/favorite', '/goods', '/order', '/chat', '/confirm', '/security', '/shoppingcart', '/trade']
// 需对管理员鉴权的路由
const adminRoutes = ['/admin/report']
// 注册全局前置守卫
router.beforeEach((to, from, next) => {
	const path = to.path
	let userID = window.sessionStorage.getItem('uid')
	userID = userID ? userID : '0'

	// 公共路由
	if (publicRoutes.includes(path)) {
		next()
	} 
	// 普通会员路由
	else if (memberRoutes.includes(path)) {
		// 当前会员是普通会员
		if (userID.length === 7) {
			next()
		} 
		// 当前会员是管理员
		else if (userID.length === 4) {
			router.go(-1)
			next(false)
		}
		// 未登录
		else {
			next({ path: '/login' })
		}
	}
	// 管理员路由
	else if (adminRoutes.includes(path)) {
		// 当前用户是管理员
		if (userID.length === 4) {
			next()
		} 
		// 当前用户是普通会员
		else if (userID.length === 7) {
			router.go(-1)
			next(false)
		}
		// 未登录
		else {
			next({ path: '/login'})
		}
	}
	// /login页面
	else {
		next()
	}
})

export default router
