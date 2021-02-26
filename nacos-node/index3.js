const { NacosConfigClient } = require('nacos')

// for find address mode
// 新建配置实例，接收推送
// const configClient = new NacosConfigClient({
//   endpoint: '10.12.102.26',
//   serverPort: '8848',
//   namespace: 'public',
//   // accessKey: '***************',
//   // secretKey: '***************',
//   requestTimeout: 6000,
// });

// for direct mode
// 直接模式
const configClient = new NacosConfigClient({
  serverAddr: '10.12.102.26:8848',
});

(async () => {
  // get config once  
  // 获取配置
  const content = await configClient.getConfig('com.node.test', 'DEFAULT_GROUP');
  console.log('getConfig = ', content);

  // listen data changed
  // configClient.subscribe({
  //   dataId: 'test',
  //   group: 'DEFAULT_GROUP',
  // }, content => {
  //   console.log(content);
  // });

  // publish config
  // const content = await configClient.publishSingle('test', 'DEFAULT_GROUP', '测试');
  // console.log('getConfig = ', content);

  // remove config
  // await configClient.remove('test', 'DEFAULT_GROUP');
})()






