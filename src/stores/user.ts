import { defineStore } from "pinia"
import { memberRoutes, adminRoutes, loginRoutes, endRoutes, default as router } from "@/router"

// Router has to be used as a plugin in pinia.

// Options Style
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userID: ''
  }),
  getters: {
    identity: (state) => {
      if (state.userID.length === 7) {
        return 'member'
      } else if (state.userID.length === 4) {
        return 'admin'
      } else {
        return 'visitor'
      }
    }
  },
  actions: {
    // 登入
    logIn (userID: string) {
      this.userID = userID
      switch (this.identity) {
        case 'member':
          // 删除登录路由
          loginRoutes.forEach((route) => {
            router.removeRoute(route.name)
          })
          // 添加普通会员路由
          memberRoutes.forEach((route) => {
            router.addRoute(route)
          })
          // 将endRoutes移至尾部
          endRoutes.forEach((route) => {
            router.addRoute(route)
          })
          break
        case 'admin':
          // 删除登录路由，添加管理员路由
          loginRoutes.forEach((route) => {
            router.removeRoute(route.name)
          })
          adminRoutes.forEach((route) => {
            router.addRoute(route)
          })
          // 将endRoutes移至尾部
          endRoutes.forEach((route) => {
            router.addRoute(route)
          })         
          break
        default:
          break
      }
    },
    // 登出
    logOut () {
      // 保存登出前的角色
      const preIdentity = this.identity
      // 清除用户ID
      this.userID = ''
      // 移除权限路由
      switch (preIdentity) {
        case 'member':
          memberRoutes.forEach((route) => {
            router.removeRoute(route.name)
          })
          break
        case 'admin':
          adminRoutes.forEach((route) => {
            router.removeRoute(route.name)
          })
          break
        default:
          break
      }
      // 添加登录路由
      loginRoutes.forEach((route) => {
        router.addRoute(route)
      })
      // 将endRoutes移至尾部
      endRoutes.forEach((route) => {
        router.addRoute(route)
      })     
    }
  },
  persist: true
})