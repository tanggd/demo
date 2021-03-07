const Koa = require('koa')
const { Dubbo, java, setting } = require('apache-dubbo-js')
const static = require("koa-static");
const path = require('path')
const Router = require("koa-router");

const app = new Koa()
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

dubbo.use(async (ctx, next) => {
  await next();
  console.log('-providerAttachments-->', ctx.providerAttachments);
});

dubbo.subscribe({
  onTrace(msg) {
    console.log(msg);
  },
});

// app.use(static(path.join(__dirname, './public')));

const router = new Router()

router.get('/', async ctx => {
  ctx.body = '1111111111111'
})

router.get('/ss', async ctx => {
  console.log('test')
  const result = await dubbo.service.demoProvider.test('test')
  console.log('resultresultresultresultresult:::', result)
  const { res, err } = result
  ctx.body = err ? err.message : res
})

app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(port, () => {
  console.log("[demo] nacos-consumer running at:");
  console.log(`- Local:   http://localhost:${port}/`);
  // console.log(`- Network: http://${ip}:${port}/`);

})
