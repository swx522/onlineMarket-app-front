import request from '../utils/request'

export default {
  /**
   * 获取订单列表
   * @param {Object} params 查询参数
   * @returns {Promise}
   */
  getOrderList(params) {
    return request.get('/api/order/list', params)
  },

  /**
   * 根据ID获取订单详情
   * @param {number} id 订单ID
   * @returns {Promise}
   */
  getOrderById(id) {
    return request.get(`/api/order/${id}`)
  },

  /**
   * 更新订单状态
   * @param {number} id 订单ID
   * @param {number} status 订单状态
   * @returns {Promise}
   */
  updateOrderStatus(id, status) {
    return request.put(`/api/order/${id}/status`, { status })
  },

  /**
   * 取消订单
   * @param {number} id 订单ID
   * @param {string} reason 取消原因
   * @returns {Promise}
   */
  cancelOrder(id, reason) {
    return request.post(`/api/order/${id}/cancel`, { reason })
  },

  /**
   * 获取订单统计数据
   * @returns {Promise}
   */
  getOrderStatistics() {
    return request.get('/api/order/statistics')
  }
}
