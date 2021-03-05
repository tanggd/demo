const express = require('express')
// const { createProxyMiddleware } = require('http-proxy-middleware')
// const registerServiceInstance = require('./nacos')
const { Dubbo, java, setting } = require('apache-dubbo-js')
// const nacos = require('./packages/dubbo/src/registry/registry-nacos').default
// const { Dubbo, java, setting, nacos } = require('dubbo2.js')
// const { Dubbo, java, setting, nacos } = require('./packages/dubbo/src/index.js')

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
const dubboSetting = setting
  .match(interfaceName,
    {
      version: interfaceVersion,
    },
  )
  
const dubboService = dubbo => dubbo.proxyService({
  dubboInterface: interfaceName,
  // version: interfaceVersion,
  // timeout: 300000,
  methods: {
    excute(json) {
      return [java.String(json)];
    },
    test(str) {
      console.log(str)
      return [java.String(str)]
    }
  }
})
const service = { dubboService }
// console.log('nacos-----', nacos)
const dubbo = new Dubbo({
  // dubboInvokeTimeout: 3600000,
  application: { name: 'hyman_povider' },
  register: `10.12.102.26:2181`,
  // register: '10.12.102.26:8848',
  // register: nacos({
  //   url: 'nacos:10.12.102.26:8848',
  // }),
  dubboSetting,
  service
})

dubbo.use(async (req, res, next) => {
  await next()
  console.log('-providerAttachments-->')
})

// dubbo.subscribe({
//   onTrace(msg) {
//     console.log(msg);
//   },
// })

app.use(express.static('./public'))

app.use('/serviceApi', async (req, res, next) => {
  console.log(123)
  // const { id } = req.params
  const result = await dubbo.service.dubboService.test('test')
  console.log('resultresultresultresultresult:::', result)
  res.send(result)
})

app.listen(port, () => {
  console.log(`端口：${port}`)

  // 注册服务
  // registerServiceInstance(nacosConfig, appConfig)
})
