import FixUtil from './FixUtil'

export default {
  /**
   * 设置本地存储
   * @param {string} key 键名
   * @param {*} value 值
   */
  set(key, value) {
    try {
      uni.setStorageSync(key, JSON.stringify(value))
    } catch (e) {
      console.error('存储失败:', e)
    }
  },

  /**
   * 获取本地存储
   * @param {string} key 键名
   * @param {*} defaultValue 默认值
   * @returns {*} 存储的值
   */
  get(key, defaultValue = null) {
    try {
      const value = uni.getStorageSync(key)
      if (value) {
        return JSON.parse(value)
      }
      return defaultValue
    } catch (e) {
      console.error('获取存储失败:', e)
      return defaultValue
    }
  },

  /**
   * 删除本地存储
   * @param {string} key 键名
   */
  remove(key) {
    try {
      uni.removeStorageSync(key)
    } catch (e) {
      console.error('删除存储失败:', e)
    }
  },

  /**
   * 清空所有本地存储
   */
  clear() {
    try {
      uni.clearStorageSync()
    } catch (e) {
      console.error('清空存储失败:', e)
    }
  }
}
