'use strict';
// 注册服务

const { NacosNamingClient } = require('nacos')
const logger = console;

// 新建客户端
const client = new NacosNamingClient({
  logger,
  serverList: '10.12.102.26:8848', // replace to real nacos serverList
  namespace: 'public',
});


const serviceName = 'nodejs.test.domain';

(async () => {
  await client.ready();

  console.log(client)

  // registry instance
  await client.registerInstance(serviceName, {
    ip: '10.10.77.92',
    port: 8000,
  });

  await client.registerInstance(serviceName, {
    ip: '0.0.0.0',
    port: 3000,
  });
  // console.log('clientclientclientclient--------', client)

  // subscribe instance
  await client.subscribe(serviceName, hosts => {
    console.log('----------subscribe---------------------')
    console.log(hosts);
  });

  // deregister instance
  // await client.deregisterInstance(serviceName, {
  //   ip: '10.10.77.92',
  //   port: 8000,
  // });

  // getAllInstances
  const allInstances = await client.getAllInstances(serviceName);
  console.log('-------allInstances--------')
  console.log(allInstances)

})()





