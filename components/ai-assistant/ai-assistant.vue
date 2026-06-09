<template>
	<view class="ai-assistant">
		<!-- 悬浮按钮 -->
		<view class="float-btn" :class="{ 'btn-hide': panelOpen }" @click="openPanel">
			<text class="float-text">AI</text>
		</view>

		<!-- 聊天面板 -->
		<view class="chat-panel" v-if="panelOpen">
			<!-- 顶部栏 -->
			<view class="panel-header">
				<view class="header-left">
					<view class="avatar-text">AI</view>
					<text class="name">小卖 · 智能客服</text>
				</view>
				<view class="header-right" @click="closePanel">
					<text class="yticon icon-zuo"></text>
				</view>
			</view>

			<!-- 消息列表 -->
			<scroll-view class="msg-list" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true">
				<view class="msg-empty" v-if="messages.length === 0">
					<text class="empty-title">你好，我是小卖 🤖</text>
					<text class="empty-desc">可以问我订单、商品、优惠券等问题</text>
				</view>
				<view v-for="(msg, index) in messages" :key="index">
					<!-- 用户消息 -->
					<view class="msg-row msg-user" v-if="msg.role === 'user'">
						<view class="msg-bubble user-bubble">{{ msg.content }}</view>
					</view>
					<!-- 助手消息 -->
					<view class="msg-row msg-assistant" v-else>
						<view class="msg-bubble assistant-bubble">
							<text>{{ msg.content }}</text>
							<text class="fallback-tip" v-if="msg.fallback">（智能助手暂时不可用，以上为自动回复）</text>
						</view>
					</view>
				</view>
				<view class="msg-loading" v-if="loading">
					<text>正在输入...</text>
				</view>
			</scroll-view>

			<!-- 快捷问题 -->
			<view class="quick-questions" v-if="messages.length === 0">
				<text class="quick-title">常见问题</text>
				<view class="quick-tags">
					<text class="quick-tag" v-for="q in quickQuestions" :key="q" @click="sendQuick(q)">{{ q }}</text>
				</view>
			</view>

			<!-- 输入区 -->
			<view class="input-area">
				<input class="msg-input" v-model="inputText" placeholder="输入问题..." confirm-type="send"
					@confirm="sendMessage" :disabled="loading" />
				<button class="send-btn" @click="sendMessage" :disabled="loading || !inputText.trim()">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		sendMessage
	} from '@/api/assistant.js'

	export default {
		name: 'AiAssistant',
		data() {
			return {
				panelOpen: false,
				messages: [],
				loading: false,
				inputText: '',
				sessionId: '',
				scrollTop: 0,
				quickQuestions: [
					'我的订单什么时候发货？',
					'如何申请退货？',
					'有什么优惠券可以领？',
					'我的积分有多少？'
				]
			}
		},
		methods: {
			openPanel() {
				this.panelOpen = true
			},
			closePanel() {
				this.panelOpen = false
			},
			sendQuick(text) {
				this.inputText = text
				this.sendMessage()
			},
			async sendMessage() {
				const msg = this.inputText.trim()
				if (!msg || this.loading) return

				// 添加用户消息
				this.messages.push({ role: 'user', content: msg })
				this.inputText = ''
				this.loading = true
				this.$nextTick(() => {
					this.scrollToBottom()
				})

				// 构建请求参数
				const data = {
					message: msg,
					sessionId: this.sessionId || undefined
				}

				// 自动带 memberId
				const userInfo = uni.getStorageSync('userInfo')
				if (userInfo && userInfo.id) {
					data.memberId = userInfo.id
				}

				try {
					const res = await sendMessage(data)
					this.messages.push({
						role: 'assistant',
						content: res.data.reply,
						fallback: res.data.fallback
					})
					// 保存 sessionId 维持上下文
					if (res.data.sessionId) {
						this.sessionId = res.data.sessionId
					}
				} catch (e) {
					this.messages.push({
						role: 'assistant',
						content: '抱歉，我暂时无法回复，请稍后再试～',
						fallback: true
					})
				} finally {
					this.loading = false
					this.$nextTick(() => {
						this.scrollToBottom()
					})
				}
			},
			scrollToBottom() {
				this.scrollTop = 99999
			}
		}
	}
</script>

<style lang="scss" scoped>
	$primary: #fa436a;

	/* 悬浮按钮 */
	.float-btn {
		position: fixed;
		right: 30upx;
		bottom: 200upx;
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		background: $primary;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
		box-shadow: 0 4upx 20upx rgba(250, 67, 106, 0.4);
		transition: all 0.3s;

		&.btn-hide {
			transform: scale(0);
			opacity: 0;
		}

		.float-text {
			font-size: 50upx;
			color: #fff;
		}
	}

	/* 聊天面板 */
	.chat-panel {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #f5f5f5;
		z-index: 1000;
		display: flex;
		flex-direction: column;
	}

	/* 顶部栏 */
	.panel-header {
		padding-top: var(--status-bar-height);
		height: calc(var(--status-bar-height) + 90upx);
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 30upx;
		padding-right: 30upx;
		border-bottom: 1px solid #eee;

		.header-left {
			display: flex;
			align-items: center;

			.avatar-text {
				width: 60upx;
				height: 60upx;
				border-radius: 50%;
				background: $primary;
				color: #fff;
				font-size: 24upx;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 16upx;
			}

			.name {
				font-size: 32upx;
				font-weight: 500;
				color: #333;
			}
		}

		.header-right {
			width: 60upx;
			height: 60upx;
			display: flex;
			align-items: center;
			justify-content: center;

			text {
				font-size: 36upx;
				color: #666;
			}
		}
	}

	/* 消息列表 */
	.msg-list {
		flex: 1;
		padding: 20upx 30upx;
		overflow-y: auto;

		.msg-empty {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top: 200upx;

			.empty-title {
				font-size: 36upx;
				font-weight: 500;
				color: #333;
				margin-bottom: 16upx;
			}

			.empty-desc {
				font-size: 28upx;
				color: #999;
			}
		}
	}

	.msg-row {
		margin-bottom: 30upx;
		display: flex;
	}

	.msg-user {
		justify-content: flex-end;
	}

	.msg-assistant {
		justify-content: flex-start;
	}

	.msg-bubble {
		max-width: 70%;
		padding: 20upx 24upx;
		border-radius: 16upx;
		font-size: 28upx;
		line-height: 1.6;
		word-break: break-all;
	}

	.user-bubble {
		background: $primary;
		color: #fff;
		border-bottom-right-radius: 4upx;
	}

	.assistant-bubble {
		background: #fff;
		color: #333;
		border-bottom-left-radius: 4upx;

		.fallback-tip {
			display: block;
			margin-top: 8upx;
			font-size: 22upx;
			color: #999;
		}
	}

	.msg-loading {
		padding: 16upx 30upx;
		font-size: 24upx;
		color: #999;
	}

	/* 快捷问题 */
	.quick-questions {
		padding: 20upx 30upx;
		background: #fff;
		border-top: 1px solid #eee;

		.quick-title {
			font-size: 24upx;
			color: #999;
			margin-bottom: 16upx;
		}

		.quick-tags {
			display: flex;
			flex-wrap: wrap;

			.quick-tag {
				padding: 12upx 24upx;
				background: #fef0f0;
				color: $primary;
				border-radius: 30upx;
				font-size: 24upx;
				margin-right: 16upx;
				margin-bottom: 12upx;
			}
		}
	}

	/* 输入区 */
	.input-area {
		display: flex;
		align-items: center;
		padding: 16upx 20upx;
		padding-bottom: calc(16upx + env(safe-area-inset-bottom));
		background: #fff;
		border-top: 1px solid #eee;

		.msg-input {
			flex: 1;
			height: 70upx;
			background: #f5f5f5;
			border-radius: 35upx;
			padding: 0 30upx;
			font-size: 28upx;
		}

		.send-btn {
			width: 120upx;
			height: 70upx;
			line-height: 70upx;
			text-align: center;
			background: $primary;
			color: #fff;
			border-radius: 35upx;
			font-size: 28upx;
			margin-left: 16upx;
			padding: 0;

			&[disabled] {
				background: #ccc;
			}
		}
	}
</style>
