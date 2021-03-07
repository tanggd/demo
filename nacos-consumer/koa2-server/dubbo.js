const Koa = require('koa')
const static = require("koa-static");
const path = require('path')
const Router = require("koa-router");
const dubbo = require('./dubbo/consumer/index');

const app = new Koa()
const port = 3000

app.use(static(path.join(__dirname, './public')));

const router = new Router()

router.get('/', async ctx => {
  ctx.body = '1111111111111'
})

router.get('/serviceApi', async ctx => {
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
