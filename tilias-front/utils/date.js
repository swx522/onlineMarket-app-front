import FixUtil from './FixUtil'

/**
 * 日期时间工具类
 */
export default {
  /**
   * 格式化日期
   * @param {Date|string|number} date 日期
   * @param {string} format 格式
   * @returns {string} 格式化后的日期
   */
  format(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return ''
    
    let d
    if (date instanceof Date) {
      d = date
    } else if (typeof date === 'string') {
      // 处理IOS日期格式问题
      d = new Date(date.replace(/-/g, '/'))
    } else if (typeof date === 'number') {
      d = new Date(date)
    } else {
      return ''
    }

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hour = String(d.getHours()).padStart(2, '0')
    const minute = String(d.getMinutes()).padStart(2, '0')
    const second = String(d.getSeconds()).padStart(2, '0')

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second)
  },

  /**
   * 获取当前时间戳
   * @returns {number} 时间戳
   */
  getTimestamp() {
    return Date.now()
  },

  /**
   * 获取今天的日期
   * @param {string} format 格式
   * @returns {string} 今天的日期
   */
  getToday(format = 'YYYY-MM-DD') {
    return this.format(new Date(), format)
  },

  /**
   * 获取昨天的日期
   * @param {string} format 格式
   * @returns {string} 昨天的日期
   */
  getYesterday(format = 'YYYY-MM-DD') {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    return this.format(date, format)
  },

  /**
   * 获取本周的开始和结束日期
   * @returns {Object} { start: string, end: string }
   */
  getWeekRange() {
    const now = new Date()
    const day = now.getDay() || 7 // 周日为0，转为7
    const start = new Date(now)
    start.setDate(now.getDate() - day + 1)
    start.setHours(0, 0, 0, 0)
    
    const end = new Date(now)
    end.setDate(now.getDate() + (7 - day))
    end.setHours(23, 59, 59, 999)
    
    return {
      start: this.format(start, 'YYYY-MM-DD'),
      end: this.format(end, 'YYYY-MM-DD')
    }
  },

  /**
   * 获取本月的开始和结束日期
   * @returns {Object} { start: string, end: string }
   */
  getMonthRange() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0)
    end.setHours(23, 59, 59, 999)
    
    return {
      start: this.format(start, 'YYYY-MM-DD'),
      end: this.format(end, 'YYYY-MM-DD')
    }
  },

  /**
   * 计算两个日期之间的天数
   * @param {Date|string} startDate 开始日期
   * @param {Date|string} endDate 结束日期
   * @returns {number} 天数
   */
  getDaysBetween(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  /**
   * 时间戳转相对时间
   * @param {number} timestamp 时间戳
   * @returns {string} 相对时间
   */
  formatRelativeTime(timestamp) {
    const now = Date.now()
    const diff = now - timestamp
    
    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour
    const month = 30 * day
    const year = 12 * month
    
    if (diff < minute) {
      return '刚刚'
    } else if (diff < hour) {
      return Math.floor(diff / minute) + '分钟前'
    } else if (diff < day) {
      return Math.floor(diff / hour) + '小时前'
    } else if (diff < month) {
      return Math.floor(diff / day) + '天前'
    } else if (diff < year) {
      return Math.floor(diff / month) + '个月前'
    } else {
      return Math.floor(diff / year) + '年前'
    }
  }
}
