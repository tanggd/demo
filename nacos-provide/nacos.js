/**
 * 注册服务到nacos
 */
const { application, nacos } = require('./config')
const { address } = require('ip')
const { NacosNamingClient, NacosConfigClient } = require('nacos')

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

const publishConfig = async () => {
  const configClient = new NacosConfigClient({
    serverAddr: nacos['service-list'],
  })

  // publish config
  const content = await configClient.publishSingle('gateway_config_json', 'refresh_config_json', JSON.stringify( {
    "filters": [],
    "id": serviceName,
    "order": 0,
    "predicates": [{
      "args": {
        "pattern": `/${serviceName}/**`
      },
      "name": "Path"
    }],
    "uri": `lb://${serviceName}`
  }))
  console.log('getConfig = ', content)


}

// 注册服务
registerServiceInstance()

// 发布配置
publishConfig()
