const express = require('express')
const { Dubbo, java, setting } = require('apache-dubbo-js')
const c2k = require('koa-connect')

const app = express()
const port = 3000

const interfaceName = 'cci.hx.com.activiti.api.ActivitiExcuteService'
const interfaceVersion = '1.0.0'
const dubboSetting = setting
  .match([interfaceName],
    {
      // version: interfaceVersion,
    },
  )
  
const demoProvider = dubbo => dubbo.proxyService({
  dubboInterface: interfaceName,
  version: interfaceVersion,
  timeout: 300000,
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
const service = { demoProvider }
// console.log('nacos-----', nacos)
const dubbo = new Dubbo({
  dubboInvokeTimeout: 3600000,
  application: { name: 'hyman_povider' },
  register: `10.12.102.26:2181`,
  // register: '10.12.102.26:8848',
  // register: nacos({
  //   url: 'nacos:10.12.102.26:8848',
  // }),
  dubboSetting,
  service
})

// function x2x(fn) {
//   return async (ctx, next) => {
//     console.log('ctxctxctxctx', ctx.providerAttachments)
//     await fn(ctx.request, ctx.response, next)
//     await next()
//   }
// }

// 待解决问题
// dubbo.use(c2k(async (req, res, next) => {
//   await next()
// }));

dubbo.use(async (req, res, next) => {
  await next()
})

// dubbo.use(async (ctx, next) => {
//   await next()
// })

dubbo.subscribe({
  onTrace(msg) {
    console.log(msg);
  },
})

app.use(express.static('./public'))


app.use('/serviceApi', async (req, res, next) => {
  console.log('test')
  console.log(123)
  const aa = await dubbo.service.demoProvider.excute('test')
  console.log('aaaaaaaaaa:::', aa)
  const result = await dubbo.service.demoProvider.excute('test')
  console.log('resultresultresultresultresult:::', result)
  res.send(result)
})


app.listen(port, () => {
  console.log("[demo] nacos-consumer running at:");
  console.log(`- Local:   http://localhost:${port}/`);
  // console.log(`- Network: http://${ip}:${port}/`);

})
