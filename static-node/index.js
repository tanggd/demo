const express = require('express')
const app = express()
const { createProxyMiddleware } = require('http-proxy-middleware')
app.use(express.static('./public'))

const filter = async function (pathname, req) {
  const serviceName = req.params.serviceName
  console.log(serviceName)
  return true
}

app.use('/serviceApi/:serviceName', createProxyMiddleware(filter, {
  target: 'http://10.2.5.141:7002/',
  changeOrigin: false,
  ws: true,
  pathRewrite: {
    '^/serviceApi': '/api'
  }
}))

app.listen(3000, () => {
  console.log('端口：3000')
})