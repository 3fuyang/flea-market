import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/NewHome.vue')

const Result = () => import('../views/NewResult.vue')
const Login = () => import('../views/NewLogin.vue')
const Details = () => import('../views/Details.vue')

const Information = () => import("../views/User/Info.vue")
const History = () => import("../views/User/History.vue")
const Favorite = () => import("../views/User/Favorite.vue")
const Goods = () => import("../views/User/Goods.vue")
const Order = () => import("../views/User/Order.vue")
const Chat = () => import("../views/User/Chat.vue")
const Confirm = () => import("../views/User/NewConfirm.vue")
const Security = () => import("../views/User/Security.vue")
const ShoppingCart = () => import("../views/User/ShoppingCart.vue")
const Trade = () => import("../views/User/Trade.vue")

const DealReport = () => import("../views/Administrator/DealingReports.vue")

const NotFound = () => import('../views/NotFound.vue')

// 公共路由
export const publicRoutes = [
	{
		path: '/',
		redirect: '/home'
	},
	{
		name: 'home',
		path: '/home',
		component: Home
	},
	{
		name: 'result',
		path: '/result',
		component: Result
	},
	{
		name: 'details',
		path: '/details',
		component: Details
	}
]

// 普通会员权限路由
export const memberRoutes = [
	{
		name: 'info',
		path: '/info',
		component: Information
	},
	{
		name: 'history',
		path: '/history',
		component: History
	},
	{
		name: 'favorite',
		path: '/favorite',
		component: Favorite
	},
	{
		name: 'goods',
		path: '/goods',
		component: Goods
	},
	{
		name: 'order',
		path: '/order',
		component: Order
	},
	{
		name: 'chat',
		path: '/chat',
		component: Chat
	},
	{
		name: 'confirm',
		path: '/confirm',
		component: Confirm
	},
	{
		name: 'security',
		path: '/security',
		component: Security
	},
	{
		name: 'shoppingcart',
		path: '/shoppingcart',
		component: ShoppingCart
	},
	{
		name: 'trade',
		path: '/trade',
		component: Trade
	}
]

// 管理员权限路由
export const adminRoutes = [
	{
		name: 'report',
		path: '/admin/report',
		component: DealReport
	}
]

// 登录路由
export const loginRoutes = [
	{
		name: 'login',
		path: '/login',
		component: Login
	}
]

// 末尾路由
export const endRoutes = [
	{
		name: '404',
		path: '/404',
		component: NotFound
	}	,
	{
		name: 'notFound',
		path: '/:pathMatch(.*)',
		redirect: '/404'
	}
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes, ...loginRoutes, ...endRoutes]
})

/* // 对所有人公开的路由
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
}) */

export default router