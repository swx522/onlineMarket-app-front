# onlineMarket 用户前端

`onlineMarket-app-front` 是 onlineMarket 商城系统的用户端前端项目，面向移动端商城场景。项目基于 Vue、Vuex 和 uni-app 开发，并在开源商城项目的基础上进行了移植、适配和功能完善。

本项目采用前后端分离架构，需要配合同一工作区中的 `onlineMarket/mall-portal` 后端服务运行。

## 主要功能

- 首页内容、商品推荐、新品和热门商品
- 商品分类、搜索、列表和详情
- 品牌推荐、品牌详情和品牌关注
- 购物车管理和订单确认
- 订单创建、支付、取消、收货和删除
- 用户登录、注册和个人中心
- 收货地址管理
- 优惠券领取与查看
- 商品收藏、浏览记录和品牌关注记录

## 技术栈

| 技术 | 用途 |
| --- | --- |
| Vue | 页面和组件开发 |
| Vuex | 登录状态及用户信息管理 |
| uni-app | 多端应用开发框架 |
| luch-request | HTTP 请求封装 |
| HBuilderX | 项目开发、调试和构建 |


## 项目结构

```text
onlineMarket-app-front
├── api/                  # 商城业务接口定义
├── components/           # 公共组件
├── images/               # 项目图片资源
├── js_sdk/               # 第三方 SDK，包含 luch-request
├── pages/                # 页面模块
│   ├── address/          # 收货地址
│   ├── brand/            # 品牌
│   ├── cart/             # 购物车
│   ├── category/         # 商品分类
│   ├── coupon/           # 优惠券
│   ├── index/            # 首页
│   ├── money/            # 支付
│   ├── notice/           # 通知
│   ├── order/            # 订单
│   ├── product/          # 商品
│   ├── public/           # 登录与注册
│   ├── set/              # 设置
│   ├── user/             # 用户中心
│   └── userinfo/         # 用户资料
├── static/               # 图标、字体等静态资源
├── store/                # Vuex 状态管理
├── utils/                # 请求配置和工具函数
├── App.vue               # 应用入口组件
├── main.js               # Vue 初始化入口
├── manifest.json         # uni-app 应用配置
└── pages.json            # 页面路由和导航配置
```

## 开发环境

运行项目前请准备：

1. HBuilderX，建议安装 App 开发版。
2. 已正确配置并启动的 `onlineMarket/mall-portal` 服务。
3. 后端开发环境所需的 MySQL、Redis、MongoDB 和 RabbitMQ。

后端默认使用 `dev` 配置，服务端口为 `8085`。数据库及中间件连接信息位于：

```text
../onlineMarket/mall-portal/src/main/resources/application-dev.yml
```

## 接口配置

用户端请求地址配置在 `utils/appConfig.js`：

```js
export const API_BASE_URL = 'http://localhost:8085';
export const USE_ALIPAY = false;
```

- `API_BASE_URL`：商城用户端后端服务地址。
- `USE_ALIPAY`：是否启用支付宝支付。默认关闭，此时支付页面使用项目内的模拟支付流程。

如果后端部署在其他主机或端口，需要同步修改 `API_BASE_URL`。在手机、模拟器或局域网设备上调试时，不能使用设备自身的 `localhost`，应改为后端所在计算机可访问的局域网 IP。

## 本地运行

1. 启动后端项目中的 `mall-portal` 模块，确认 `http://localhost:8085` 可以访问。
2. 打开 HBuilderX，选择“文件 -> 导入 -> 从本地目录导入”。
3. 选择本目录 `onlineMarket-app-front`。
4. 选择“运行 -> 运行到浏览器 -> Chrome”。
5. H5 默认开发端口为 `8060`，运行后访问：

```text
http://localhost:8060
```

建议在浏览器开发者工具中切换到移动设备模式进行调试。

## 多端配置

项目的 `manifest.json` 已包含 H5、App 和微信小程序相关配置，但微信小程序 `appid` 当前为空。构建到微信小程序或 App 前，需要在 HBuilderX 中补充对应平台的应用标识、权限和发行配置。

当前项目主要按 H5 环境进行本地联调，其他平台发布前应重点检查：

- 后端接口域名和 HTTPS 配置
- 小程序合法请求域名
- App 网络与系统权限
- 静态资源和外部字体的可访问性
- 支付平台相关参数

## 登录与请求说明

- 登录成功后，用户信息和 Token 会保存在 uni-app 本地存储中。
- 请求工具会自动将 Token 写入 `Authorization` 请求头。
- 接口返回 `401` 时，页面会提示用户重新登录。
- 业务接口统一定义在 `api/` 目录，请优先在对应模块中维护接口，避免在页面内直接拼接请求。

## 常见问题

### 页面能够打开，但没有商品数据

检查 `mall-portal` 是否已经启动，以及 `utils/appConfig.js` 中的 `API_BASE_URL` 是否与后端地址一致。同时确认 MySQL、Redis、MongoDB 和 RabbitMQ 的连接配置正确。

### 浏览器提示跨域错误

确认后端允许当前 H5 地址访问。开发环境默认前端地址为 `http://localhost:8060`，后端地址为 `http://localhost:8085`。

### 登录后仍提示未登录

检查登录接口是否正常返回 Token，并确认浏览器本地存储中存在 `token`。请求头格式应与 `mall-portal` 的 JWT 配置保持一致。

### 真机无法访问本地后端

将 `API_BASE_URL` 中的 `localhost` 改为后端计算机的局域网 IP，并确保设备与计算机处于同一网络、端口未被防火墙拦截。

## 许可证

本项目使用 Apache License 2.0，具体内容见根目录下的 `LICENSE` 文件。
