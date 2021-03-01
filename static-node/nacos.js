/**
 * 注册服务到nacos
 */
const { NacosNamingClient } = require('nacos')
const { address } = require('ip')
const logger = console

// 动态获取本机 IP 地址
const ipAddr = address()

const registerServiceInstance = async function (nacosConfig, appConfig, callback) {
  const { serviceName, port } = appConfig
  const { serverList, namespace } = nacosConfig

  // 新建客户端
  const client = new NacosNamingClient({
    logger,
    serverList: serverList,
    namespace: namespace,
  })

  await client.ready()

  // registry instance
  await client.registerInstance(serviceName, {
    ip: ipAddr,
    port: port,
  })

  // subscribe instance
  if (callback) {
    await client.subscribe(serviceName, hosts => {
      console.log('----------subscribe---------------------')
      console.log(hosts)
      callback(hosts)
    })
  }
}

module.exports = registerServiceInstance
