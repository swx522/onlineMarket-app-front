import Request from '@/js_sdk/luch-request/request.js'
import { ASSISTANT_BASE_URL } from '@/utils/appConfig.js'

const http = new Request()

http.setConfig((config) => {
	config.baseUrl = ASSISTANT_BASE_URL
	config.header = {
		...config.header
	}
	return config
})

http.validateStatus = (statusCode) => {
	return statusCode === 200
}

http.interceptor.request((config, cancel) => {
	const token = uni.getStorageSync('token')
	if (token) {
		config.header = {
			'Authorization': token,
			...config.header
		}
	}
	return config
})

http.interceptor.response((response) => {
	const res = response.data
	if (res.code !== 200) {
		uni.showToast({
			title: res.message,
			duration: 1500
		})
		return Promise.reject(response)
	}
	return response.data
}, (response) => {
	uni.showToast({
		title: response.errMsg,
		duration: 1500
	})
	return Promise.reject(response)
})

/**
 * 发起智能客服对话
 * @param {Object} data - { message, sessionId?, memberId? }
 */
export function sendMessage(data) {
	return http.request({
		method: 'POST',
		url: '/assistant/chat',
		header: {
			'content-type': 'application/json;charset=utf-8'
		},
		data: data
	})
}

/**
 * 清空会话历史
 * @param {string} sessionId
 */
export function clearHistory(sessionId) {
	return http.request({
		method: 'DELETE',
		url: `/assistant/history/${sessionId}`
	})
}
