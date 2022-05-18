import { createRouter, createWebHistory, type RouteRecordRaw, type RouteRecordName } from 'vue-router'
import { useUserStore } from '@/stores/user'

const Home = () => import('../views/NewHome.vue')

const Result = () => import('../views/NewResult.vue')
const Login = () => import('../views/NewLogin.vue')
const Details = () => import('../views/Details.vue')

const Information = () => import("../views/User/Info.vue")
const History = () => import("../views/User/History.vue")
const Favorite = () => import("../views/User/Favorite.vue")
const Goods = () => import("../views/User/Goods.vue")
const Order = () => import("../views/User/Order.vue")
const Chat = () => import('../views/User/NewChat.vue')
const Confirm = () => import("../views/User/NewConfirm.vue")
const Security = () => import("../views/User/NewSecurity.vue")
const ShoppingCart = () => import("../views/User/ShoppingCart.vue")
const Trade = () => import("../views/User/Trade.vue")

const DealReport = () => import("../views/Administrator/DealingReports.vue")

const NotFound = () => import('../views/NotFound.vue')

// 公共路由
export const publicRoutes: RouteRecordRaw[] = [
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
	},
	{
		path: '/topnav',
		component: () => import('@/components/NewTopBar.vue')
	}
]

// 普通会员权限路由
export const memberRoutes: RouteRecordRaw[] = [
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
export const adminRoutes: RouteRecordRaw[] = [
	{
		name: 'report',
		path: '/admin/report',
		component: DealReport
	}
]

// 登录路由
export const loginRoutes: RouteRecordRaw[] = [
	{
		name: 'login',
		path: '/login',
		component: Login
	}
]

// 末尾路由
export const endRoutes: RouteRecordRaw[] = [
/* 	{
		name: '404',
		path: '/404',
		component: NotFound
	}	,
	{
		name: 'notFound',
		path: '/:pathMatch(.*)',
		redirect: '/404'
	} */
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes, ...loginRoutes, ...endRoutes],
	scrollBehavior (to, from, savedPosition) {
		return { top: 0 }
	}
})

router.beforeEach((to, from, next) => {
	//console.log(from.path, to.path)
	// initializing store
	const userStore = useUserStore()
	if (userStore.identity === 'member') {
		if (router.hasRoute('login')) {
			// 删除登录路由
			loginRoutes.forEach((route) => {
				router.removeRoute(route.name as RouteRecordName)
			})
			// 添加普通会员路由
			memberRoutes.forEach((route) => {
				router.addRoute(route)
			})
			// 将endRoutes移至尾部
			endRoutes.forEach((route) => {
				router.addRoute(route)
			})
			next(to.path)
		} else {
			next()
		}
	} else if (userStore.identity === 'admin') {
		if (router.hasRoute('login')) {
			// 删除登录路由，添加管理员路由
			loginRoutes.forEach((route) => {
				router.removeRoute(route.name as RouteRecordName)
			})
			adminRoutes.forEach((route) => {
				router.addRoute(route)
			})
			// 将endRoutes移至尾部
			endRoutes.forEach((route) => {
				router.addRoute(route)
			})
			next(to.path)    
		} else {
			next()
		}
	} else if (userStore.identity === 'visitor') {
		next()
	}	else {
		next()
	}
})

export default router