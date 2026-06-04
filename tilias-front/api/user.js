import request from '../utils/request'

export default {
  /**
   * 用户登录
   * @param {Object} data 登录数据 { username, password }
   * @returns {Promise}
   */
  login(data) {
    return request.post('/api/user/login', data)
  },

  /**
   * 用户注册
   * @param {Object} data 注册数据
   * @returns {Promise}
   */
  register(data) {
    return request.post('/api/user/register', data)
  },

  /**
   * 获取用户信息
   * @returns {Promise}
   */
  getUserInfo() {
    return request.get('/api/user/info')
  },

  /**
   * 更新用户信息
   * @param {Object} data 用户信息
   * @returns {Promise}
   */
  updateUserInfo(data) {
    return request.put('/api/user/info', data)
  },

  /**
   * 修改密码
   * @param {Object} data { oldPassword, newPassword }
   * @returns {Promise}
   */
  changePassword(data) {
    return request.post('/api/user/change-password', data)
  },

  /**
   * 获取用户列表
   * @param {Object} params 查询参数
   * @returns {Promise}
   */
  getUserList(params) {
    return request.get('/api/user/list', params)
  },

  /**
   * 根据ID获取用户详情
   * @param {number} id 用户ID
   * @returns {Promise}
   */
  getUserById(id) {
    return request.get(`/api/user/${id}`)
  },

  /**
   * 新增用户
   * @param {Object} data 用户数据
   * @returns {Promise}
   */
  addUser(data) {
    return request.post('/api/user', data)
  },

  /**
   * 更新用户
   * @param {number} id 用户ID
   * @param {Object} data 用户数据
   * @returns {Promise}
   */
  updateUser(id, data) {
    return request.put(`/api/user/${id}`, data)
  },

  /**
   * 删除用户
   * @param {number} id 用户ID
   * @returns {Promise}
   */
  deleteUser(id) {
    return request.delete(`/api/user/${id}`)
  },

  /**
   * 批量删除用户
   * @param {Array} ids 用户ID数组
   * @returns {Promise}
   */
  batchDeleteUser(ids) {
    return request.post('/api/user/batch-delete', { ids })
  }
}
