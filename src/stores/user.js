import { defineStore } from "pinia"

export const useUser = defineStore({
  id: 'user',
  state: () => ({
    userID: '',
    nickname: ''
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
    logOut () {
      this.userID = ''
      this.nickname = ''
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      key: 'user',
      storage: sessionStorage
    }]
  }
})