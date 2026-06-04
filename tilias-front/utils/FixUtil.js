/**
 * 修复工具类 - 包含数据处理和输入验证方法
 * @author swx522
 * @version 1.0.0
 */
export default {
  // ==================== 数据修复与处理 ====================
  
  /**
   * 修复后端返回的null/undefined数据为默认值
   * @param {*} data 原始数据
   * @param {*} defaultValue 默认值
   * @returns {*} 修复后的数据
   */
  fixNull(data, defaultValue = '') {
    return data === null || data === undefined ? defaultValue : data
  },

  /**
   * 修复数字类型数据，非数字转为0
   * @param {*} num 原始数字
   * @param {number} defaultValue 默认值
   * @returns {number} 修复后的数字
   */
  fixNumber(num, defaultValue = 0) {
    const parsed = Number(num)
    return isNaN(parsed) ? defaultValue : parsed
  },

  /**
   * 修复布尔类型数据
   * @param {*} bool 原始布尔值
   * @param {boolean} defaultValue 默认值
   * @returns {boolean} 修复后的布尔值
   */
  fixBoolean(bool, defaultValue = false) {
    if (typeof bool === 'boolean') return bool
    if (bool === 'true' || bool === '1' || bool === 1) return true
    if (bool === 'false' || bool === '0' || bool === 0) return false
    return defaultValue
  },

  /**
   * 修复数组数据，非数组转为空数组
   * @param {*} arr 原始数组
   * @returns {Array} 修复后的数组
   */
  fixArray(arr) {
    return Array.isArray(arr) ? arr : []
  },

  /**
   * 修复对象数据，非对象转为空对象
   * @param {*} obj 原始对象
   * @returns {Object} 修复后的对象
   */
  fixObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj) ? obj : {}
  },

  /**
   * 深度修复对象所有属性
   * @param {Object} obj 原始对象
   * @returns {Object} 修复后的对象
   */
  deepFixObject(obj) {
    if (!obj || typeof obj !== 'object') return obj
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.deepFixObject(item))
    }
    
    const fixed = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        if (value === null || value === undefined) {
          fixed[key] = ''
        } else if (typeof value === 'object') {
          fixed[key] = this.deepFixObject(value)
        } else {
          fixed[key] = value
        }
      }
    }
    return fixed
  },

  /**
   * 去除字符串首尾空格
   * @param {string} str 原始字符串
   * @returns {string} 处理后的字符串
   */
  trim(str) {
    return this.fixNull(str).toString().trim()
  },

  /**
   * 格式化金额（保留2位小数）
   * @param {number} amount 金额
   * @returns {string} 格式化后的金额
   */
  formatMoney(amount) {
    const num = this.fixNumber(amount)
    return num.toFixed(2)
  },

  /**
   * 格式化手机号（中间4位打码）
   * @param {string} phone 手机号
   * @returns {string} 格式化后的手机号
   */
  formatPhone(phone) {
    const str = this.trim(phone)
    if (str.length !== 11) return str
    return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  },

  /**
   * 格式化身份证号（中间8位打码）
   * @param {string} idCard 身份证号
   * @returns {string} 格式化后的身份证号
   */
  formatIdCard(idCard) {
    const str = this.trim(idCard)
    if (str.length !== 18) return str
    return str.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
  },

  // ==================== 输入验证 ====================

  /**
   * 验证手机号
   * @param {string} phone 手机号
   * @returns {boolean} 验证结果
   */
  isPhone(phone) {
    const reg = /^1[3-9]\d{9}$/
    return reg.test(this.trim(phone))
  },

  /**
   * 验证邮箱
   * @param {string} email 邮箱
   * @returns {boolean} 验证结果
   */
  isEmail(email) {
    const reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
    return reg.test(this.trim(email))
  },

  /**
   * 验证身份证号
   * @param {string} idCard 身份证号
   * @returns {boolean} 验证结果
   */
  isIdCard(idCard) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return reg.test(this.trim(idCard))
  },

  /**
   * 验证URL
   * @param {string} url URL地址
   * @returns {boolean} 验证结果
   */
  isUrl(url) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]+)?(\/[^/?#]*)*(\?[^#]*)?(#.*)?$/
    return reg.test(this.trim(url))
  },

  /**
   * 验证是否为数字
   * @param {*} num 数字
   * @returns {boolean} 验证结果
   */
  isNumber(num) {
    return !isNaN(Number(num))
  },

  /**
   * 验证是否为正整数
   * @param {*} num 数字
   * @returns {boolean} 验证结果
   */
  isPositiveInteger(num) {
    const reg = /^[1-9]\d*$/
    return reg.test(this.trim(num))
  },

  /**
   * 验证是否为非负整数
   * @param {*} num 数字
   * @returns {boolean} 验证结果
   */
  isNonNegativeInteger(num) {
    const reg = /^\d+$/
    return reg.test(this.trim(num))
  },

  /**
   * 验证密码强度（至少6位，包含字母和数字）
   * @param {string} password 密码
   * @returns {boolean} 验证结果
   */
  isPassword(password) {
    const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    return reg.test(this.trim(password))
  },

  /**
   * 验证是否为空
   * @param {*} value 要验证的值
   * @returns {boolean} 是否为空
   */
  isEmpty(value) {
    if (value === null || value === undefined || value === '') return true
    if (Array.isArray(value) && value.length === 0) return true
    if (typeof value === 'object' && Object.keys(value).length === 0) return true
    return false
  },

  /**
   * 验证表单
   * @param {Object} form 表单数据
   * @param {Array} rules 验证规则
   * @returns {Object} 验证结果 { valid: boolean, message: string }
   */
  validateForm(form, rules) {
    for (const rule of rules) {
      const { field, label, required = false, validator, message } = rule
      const value = form[field]

      // 必填验证
      if (required && this.isEmpty(value)) {
        return {
          valid: false,
          message: message || `请输入${label}`
        }
      }

      // 自定义验证
      if (validator && !this.isEmpty(value)) {
        const result = validator(value)
        if (!result.valid) {
          return result
        }
      }
    }
    return { valid: true, message: '验证通过' }
  }
}
