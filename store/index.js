import { createStore } from 'vuex'

const store = createStore({
  state: {
    hasLogin: false,
    userInfo: {}
  },
  mutations: {
    login(state, provider) {
      state.hasLogin = true
      state.userInfo = provider
      uni.setStorage({ key: 'userInfo', data: provider })
    },
    logout(state) {
      state.hasLogin = false
      state.userInfo = {}
      uni.removeStorage({ key: 'userInfo' })
      uni.removeStorage({ key: 'token' })
    }
  }
})

export default store
