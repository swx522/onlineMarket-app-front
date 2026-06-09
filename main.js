import { createSSRApp } from 'vue'
import { createStore } from 'vuex'
import App from './App'

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

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
  if (Boolean(title) === false) return
  uni.showToast({ title, duration, mask, icon })
}

const prePage = () => {
  const pages = getCurrentPages()
  const prev = pages[pages.length - 2]
  // #ifdef H5
  return prev
  // #endif
  return prev ? prev.$vm : undefined
}

App.mpType = 'app'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.config.globalProperties.$store = store
  app.config.globalProperties.$api = { msg, prePage }
  return { app }
}
