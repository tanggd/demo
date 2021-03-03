const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
// const registerServiceInstance = require('./nacos')
// const { Dubbo, java, setting, nacos } = require('apache-dubbo-js')
// const { Dubbo, java, setting, nacos } = require('dubbo2.js')
const { Dubbo, java, setting, nacos } = require('./packages/dubbo/src/index.js')

const app = express()

const port = 3000
// const appConfig = {
//   serviceName: 'consumer.vue.test',
//   port: port
// }
// const nacosConfig = {
//   serverList: '10.12.102.26:8848',
//   namespace: 'public'
// }

const interfaceName = 'cci.hx.com.activiti.api.ActivitiExcuteService'
const interfaceVersion = '1.0.0'
const dubboSetting = setting.match(
  interfaceName, { version: interfaceVersion }
)
const dubboService = dubbo => dubbo.proxyService({
  dubboInterface: interfaceName,
  version: '1.0.0',
  methods: {
    Test(str) {
      return [
        java.String(str)
      ]
    }
  }
})
const service = { dubboService }
console.log('nacos-----', nacos)
const dubbo = new Dubbo({
  application: { name: 'consumer.vue.node.test' },
  // register: '10.12.102.26:8848',
  register: nacos({
    url: 'nacos:10.12.102.26:8848',
  }),
  dubboSetting,
  service
})

app.use(express.static('./public'))

app.use('/serviceApi', async (req, res, next) => {
  console.log(123)
  // const { id } = req.params
  const result = await dubbo.service.dubboService.Test('id123')
  console.log(result)
  res.send({
    code: 1,
    data: [1, 2, 3]
  })
})

app.listen(port, () => {
  console.log(`端口：${port}`)

  // 注册服务
  // registerServiceInstance(nacosConfig, appConfig)
})
