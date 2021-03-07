const { address } = require('ip')
// 动态获取本机 IP 地址
const ip = address()

module.exports = {
  nacosConfig: {
    serverList: '10.12.102.26:8848',
    namespace: 'public'
  },
  appConfig: {
    name: 'consumer.vue.express.test',
    ip,
    port: 3000,
    staticPath: './public'
  }
}