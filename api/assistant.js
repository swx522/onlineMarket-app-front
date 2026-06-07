import request from '@/utils/requestUtil'

/**
 * 发起智能客服对话
 * @param {Object} data - { message, sessionId?, memberId? }
 */
export function sendMessage(data) {
	return request({
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
	return request({
		method: 'DELETE',
		url: `/assistant/history/${sessionId}`
	})
}
