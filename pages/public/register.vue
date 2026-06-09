<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<view class="wrapper">
			<view class="left-top-sign">REGISTER</view>
			<view class="welcome">注册新账号</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">用户名</text>
					<input type="text" v-model="username" placeholder="请输入用户名" maxlength="32"/>
				</view>
				<view class="input-item">
					<text class="tit">手机号</text>
					<input type="number" v-model="telephone" placeholder="请输入手机号" maxlength="11"/>
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="text" v-model="password" placeholder="8-18位不含特殊字符" placeholder-class="input-empty" maxlength="20" password/>
				</view>
				<view class="input-item sms-row">
					<text class="tit">验证码</text>
					<view class="sms-wrap">
						<input type="number" v-model="authCode" placeholder="请输入验证码" maxlength="6"/>
						<button class="sms-btn" :disabled="smsSending" @click="sendSms">{{ smsText }}</button>
					</view>
				</view>
			</view>
			<button class="confirm-btn" @click="doRegister" :disabled="registering">注册</button>
		</view>
		<view class="register-section">
			已有账号？
			<text @click="navToLogin">马上登录</text>
		</view>
	</view>
</template>

<script>
import { memberRegister, getAuthCode } from '@/api/member.js';

export default {
	data() {
		return {
			username: '',
			telephone: '',
			password: '',
			authCode: '',
			registering: false,
			smsSending: false,
			smsSeconds: 0,
			smsTimer: null
		}
	},
	computed: {
		smsText() {
			return this.smsSending ? this.smsSeconds + 's后重发' : '获取验证码';
		}
	},
	methods: {
		navBack() { uni.navigateBack(); },
		navToLogin() { uni.redirectTo({ url: '/pages/public/login' }); },
		sendSms() {
			if (this.smsSending) return;
			if (!this.telephone || this.telephone.length !== 11) {
				uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
				return;
			}
			this.smsSending = true;
			this.smsSeconds = 60;
			getAuthCode(this.telephone).then(() => {
				uni.showToast({ title: '验证码已发送', icon: 'none' });
			}).catch(() => {
				this.smsSending = false;
				clearInterval(this.smsTimer);
			});
			this.smsTimer = setInterval(() => {
				this.smsSeconds--;
				if (this.smsSeconds <= 0) {
					this.smsSending = false;
					clearInterval(this.smsTimer);
				}
			}, 1000);
		},
		doRegister() {
			if (!this.username) return uni.showToast({ title: '请输入用户名', icon: 'none' });
			if (!this.telephone || this.telephone.length !== 11) return uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
			if (!this.password || this.password.length < 6) return uni.showToast({ title: '密码至少6位', icon: 'none' });
			if (!this.authCode) return uni.showToast({ title: '请输入验证码', icon: 'none' });
			this.registering = true;
			memberRegister({
				username: this.username,
				password: this.password,
				telephone: this.telephone,
				authCode: this.authCode
			}).then(() => {
				uni.showToast({ title: '注册成功', icon: 'none' });
				setTimeout(() => uni.redirectTo({ url: '/pages/public/login' }), 1000);
			}).catch(() => { this.registering = false; });
		}
	},
	beforeUnmount() {
		if (this.smsTimer) clearInterval(this.smsTimer);
	}
}
</script>

<style lang='scss'>
	page { background: #fff; }
	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}
	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content { padding: 0 60upx; }
	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 100upx;
		border-radius: 4px;
		margin-bottom: 30upx;
		.tit {
			height: 30upx;
			line-height: 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
		}
		input {
			height: 40upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}
	.sms-row {
		flex-direction: column;
		.sms-wrap {
			display: flex;
			width: 100%;
			input { flex: 1; }
			.sms-btn {
				width: 180upx;
				height: 56upx;
				line-height: 56upx;
				font-size: $font-sm;
				color: $font-color-dark;
				background: $page-color-base;
				border-radius: 8upx;
				&[disabled] { color: $font-color-disabled; }
			}
		}
	}
	.confirm-btn {
		width: 560upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 50upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&[disabled] { opacity: 0.6; }
	}
	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		text-align: center;
		text { color: $uni-color-primary; margin-left: 10upx; }
	}
	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
		}
	}
	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
</style>
