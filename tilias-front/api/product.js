import request from '../utils/request'

export default {
  /**
   * 获取商品列表
   * @param {Object} params 查询参数
   * @returns {Promise}
   */
  getProductList(params) {
    return request.get('/api/product/list', params)
  },

  /**
   * 根据ID获取商品详情
   * @param {number} id 商品ID
   * @returns {Promise}
   */
  getProductById(id) {
    return request.get(`/api/product/${id}`)
  },

  /**
   * 新增商品
   * @param {Object} data 商品数据
   * @returns {Promise}
   */
  addProduct(data) {
    return request.post('/api/product', data)
  },

  /**
   * 更新商品
   * @param {number} id 商品ID
   * @param {Object} data 商品数据
   * @returns {Promise}
   */
  updateProduct(id, data) {
    return request.put(`/api/product/${id}`, data)
  },

  /**
   * 删除商品
   * @param {number} id 商品ID
   * @returns {Promise}
   */
  deleteProduct(id) {
    return request.delete(`/api/product/${id}`)
  },

  /**
   * 批量删除商品
   * @param {Array} ids 商品ID数组
   * @returns {Promise}
   */
  batchDeleteProduct(ids) {
    return request.post('/api/product/batch-delete', { ids })
  },

  /**
   * 上下架商品
   * @param {number} id 商品ID
   * @param {number} status 状态 0-下架 1-上架
   * @returns {Promise}
   */
  updateProductStatus(id, status) {
    return request.put(`/api/product/${id}/status`, { status })
  },

  /**
   * 获取商品分类列表
   * @returns {Promise}
   */
  getCategoryList() {
    return request.get('/api/category/list')
  }
}
