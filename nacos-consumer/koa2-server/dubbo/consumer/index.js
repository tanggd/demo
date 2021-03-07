
const { Dubbo, setting } = require('apache-dubbo-js')
const service = require('./service')

const dubboSetting = setting
  .match(
    [
      'cci.hx.com.activiti.api.ActivitiExcuteService',
    ],
    {
      // 找到了错误原因了，version到底是多少？？？注释下可以用
      // version: '1.0.0',
    },
  )

const dubbo = new Dubbo({
  // isSupportedDubbox: true,
  dubboInvokeTimeout: 3600000,
  application: { name: 'hyman_povider'},
  service,
  dubboSetting,
  // default zookeeper
  register: `10.12.102.26:2181`,
  // register: `nacos://localhost:8848`,
  // register: `localhost:8848`,
  // register: nacos({
  //   url: 'nacos:localhost:8848',
  // }),
});

dubbo.use(async (ctx, next) => {
  await next();
  console.log('-providerAttachments-->', ctx.providerAttachments);
});

dubbo.subscribe({
  onTrace(msg) {
    console.log(msg);
  },
});

module.exports = dubbo