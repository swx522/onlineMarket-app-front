import FixUtil from './FixUtil'

const baseURL = 'https://api.example.com' // 替换为你的后端地址

const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })

    uni.request({
      url: baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': uni.getStorageSync('token') || ''
      },
      success: (res) => {
        uni.hideLoading()
        
        if (res.statusCode === 200) {
          const data = FixUtil.deepFixObject(res.data)
          
          if (data.code === 200) {
            resolve(data)
          } else if (data.code === 401) {
            // 未登录，清除token并跳转到登录页
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
            uni.reLaunch({
              url: '/tilias-front/pages/login/login'
            })
            reject(new Error('登录已过期，请重新登录'))
          } else {
            uni.showToast({
              title: data.message || '请求失败',
              icon: 'none'
            })
            reject(new Error(data.message || '请求失败'))
          }
        } else {
          uni.showToast({
            title: `请求错误：${res.statusCode}`,
            icon: 'none'
          })
          reject(new Error(`请求错误：${res.statusCode}`))
        }
      },
      fail: (err) => {
        uni.hideLoading()
        uni.showToast({
          title: '网络请求失败，请检查网络',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

// 封装常用请求方法
export default {
  get(url, params = {}) {
    return request({
      url,
      method: 'GET',
      data: params
    })
  },

  post(url, data = {}) {
    return request({
      url,
      method: 'POST',
      data
    })
  },

  put(url, data = {}) {
    return request({
      url,
      method: 'PUT',
      data
    })
  },

  delete(url, data = {}) {
    return request({
      url,
      method: 'DELETE',
      data
    })
  }
}
