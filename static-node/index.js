const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const registerServiceInstance = require('./nacos')

const app = express()

const port = 3000
const appConfig = {
  serviceName: 'consumer.vue.test',
  port: port
}
const nacosConfig = {
  serverList: '10.12.102.26:8848',
  namespace: 'public'
}

app.use(express.static('./public'))

app.use('/serviceApi', createProxyMiddleware({
  target: 'http://10.10.77.93:8008/',
  changeOrigin: false,
  ws: true,
  pathRewrite: {
    '^/serviceApi': ''
  },
}))

app.listen(port, () => {
  console.log(`端口：${port}`)

  // 注册服务
  registerServiceInstance(nacosConfig, appConfig)
})
