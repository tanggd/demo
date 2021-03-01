/**
 * 注册服务到nacos
 */
const { NacosNamingClient } = require('nacos')
const logger = console

// nacos客户端集合
const allClient = {}
// 服务实例信息集合
const allInstances = {}

const getServiceInstances = async function (nacosConfig, serviceName) {
  const { serverList, namespace } = nacosConfig


  let client = allClient[`${serverList}-${namespace}`]
  console.log(client, 'you------')
  if (!client) {
    // 新建客户端
    client = new NacosNamingClient({
      logger,
      serverList: serverList,
      namespace: namespace,
    })
    await client.ready()
  }

  const services = allInstances[serviceName]
  if (!services) {
    // 未订阅服务时，就去订阅
    // subscribe instance
    await client.subscribe(serviceName, hosts => {
      console.log('----------subscribe---------------------')
      console.log(hosts)
      allInstances[serviceName] = hosts
    })
  }

  return allInstances[serviceName]
}

module.exports = getServiceInstances
