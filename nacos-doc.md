# nacos-doc

## 注册服务

### 一般的

```javascript
const { address } = require('ip')
const { NacosNamingClient } = require('nacos')
const logger = console
const ipAddr = address()
const serviceName = 'consumers.nodejs.test'

const registerServiceInstance = async () => {
  const client = new NacosNamingClient({
    logger,
    serverList: '10.12.102.26:8848',  // nacos
    namespace: 'public',
  })

  await client.ready()

  // registry instance
  await client.registerInstance(serviceName, {
    ip: ipAddr,
    port: 3000,
  })
}

registerServiceInstance()
```

### node服务

```javascript
// index.js
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const registerServiceInstance = require('./nacos')

const app = express()

const port = 3000
const appConfig = {
  serviceName: 'consumer.vue.test',
  port: port
}
const nacosConfig = {
  serverList: '10.12.102.26:8848',
  namespace: 'public'
}

app.use(express.static('./public'))

// nacos服务，代理到统一网关
// '/serviceApi/{serviceName}/{path}'
app.use('/serviceApi', createProxyMiddleware({
  target: 'http://10.10.77.93:8008/',
  changeOrigin: false,
  ws: true,
  pathRewrite: {
    '^/serviceApi': ''
  },
}))
// 普通的接口访问，代理到业务服务器
app.use('/api', createProxyMiddleware({
  target: 'http://10.10.77.93:9000/',
  changeOrigin: false,
  ws: true,
}))

app.listen(port, () => {
  console.log(`端口：${port}`)

  // 注册服务
  registerServiceInstance(nacosConfig, appConfig)
})
```

```javascript
// nacos.js 注册服务
const { NacosNamingClient } = require('nacos')
const { address } = require('ip')
const logger = console
const ipAddr = address()

const registerServiceInstance = async function (nacosConfig, appConfig) {
  const { serverList, namespace } = nacosConfig
  const { serviceName, port } = appConfig

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
}

module.exports = registerServiceInstance
```

## 订阅服务

略。

## 前端开发

使用了统一网关，对于前端开发没有影响，以前是怎么开发的，现在依然怎么开发。

因为新旧模式开发，对于前端来说，具体调到哪个目标服务器是无感知的。

开发环境中

```javascript
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      "/serviceApi": {
        target: 'http://10.10.77.93:8008/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "/serviceApi": ""
        }
      },
      "/api": {
        target: 'http://10.2.5.88:8081/',
        changeOrigin: true,
        ws: true
      },
    }
  },
}
```

## 最后

1. 前端（静态资源html、css、js）服务有没有必要注册？注册的意义是什么？哪些地方需要用？

2. 前端接口代理：

   - nginx

   - node代理

3. 统一网关解决方案：

   - 1. 注册一个服务，就需要去统一网关配置数据，重启统一网关；太麻烦了；期望做成动态的代理。

     2. 去nacos配置中心配置config，统一网关动态获取配置；但是注册了服务，就需要去nacos配置中心配置该服务，也显得很麻烦，而且配置文件管理上还是显得很混乱。

        服务自行发布配置？不可取！

        是否具有负载均衡策略？？

     3. 待实现：订阅服务