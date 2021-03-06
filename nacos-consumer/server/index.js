const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { appConfig } = require("./config");
const { port, ip, staticPath } = appConfig;
const registerServiceInstance = require('./nacos/registerServiceInstance')

const app = express();

app.use(express.static(staticPath));

// 服务代理 统一网关
app.use(
  "/serviceApi",
  createProxyMiddleware({
    target: "http://10.10.77.93:8008/",
    changeOrigin: false,
    ws: true,
    pathRewrite: {
      "^/serviceApi": "",
    },
  })
);
// 普通代理 to目标服务器
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://10.2.5.74:7001/",
    changeOrigin: false,
    ws: true,
    pathRewrite: {
      "^/api": "",
    },
  })
);

app.listen(port, () => {
  console.log("[demo] nacos-consumer running at:");
  console.log(`- Local:   http://localhost:${port}/`);
  console.log(`- Network: http://${ip}:${port}/`);
  // 注册服务
  registerServiceInstance()
});
