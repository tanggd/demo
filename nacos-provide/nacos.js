/**
 * 注册服务到nacos
 */
const { application, nacos } = require('./config')
const { address } = require('ip')
const { NacosNamingClient } = require('nacos')

const logger = console

// 动态获取本机 IP 地址
const ipAddr = address()

const { name: serviceName, port } = application

const registerServiceInstance = async () => {
  // 新建客户端
  const client = new NacosNamingClient({
    logger,
    serverList: nacos['service-list'],
    namespace: nacos.namespace,
  })

  await client.ready()

  // registry instance
  await client.registerInstance(serviceName, {
    ip: ipAddr,
    port: port,
  })
}

// 注册服务
registerServiceInstance()
