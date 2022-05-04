import { defineStore } from "pinia"

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
    },
    // 登出
    logOut () {
      this.userID = ''
    }
  },
  persist: true
})