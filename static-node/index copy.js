const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const registerServiceInstance = require('./nacos')
const getServiceInstances = require('./nacos-subscribe')

const app = express()

const port = 3000
const appConfig = {
  serviceName: 'nacos.consumer.vue.test',
  port: port
}
const nacosConfig = {
  serverList: '10.12.102.26:8848',
  namespace: 'public'
}

app.use(express.static('./public'))

app.use('/serviceApi/:serviceName', createProxyMiddleware({
  target: 'http://169.254.68.221:7002/',
  changeOrigin: false,
  ws: true,
  pathRewrite: {
    '^/serviceApi': '/api'
  },
  router: async function (req) {
    const url = await getTargetUrl(req.params.serviceName)
    console.log(url)
    return url
  }
}))

app.listen(port, () => {
  console.log(`端口：${port}`)

  // 注册服务
  registerServiceInstance(nacosConfig, appConfig)
})

async function getTargetUrl(serviceName) {
  console.log(serviceName)
  const instances = await getServiceInstances(nacosConfig, 'nacos.provide.nodejs.test' || serviceName)
  // 注意为 instances 为空的情况，待处理
  console.log('---------------22222----------------------')
  console.log(instances)
  const first = instances[0]
  return `http://${first.ip}:${first.port}`
  // return 'http://169.254.68.221:7001/'
}