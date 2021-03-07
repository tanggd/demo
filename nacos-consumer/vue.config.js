const path = require('path')
module.exports = {
  outputDir: path.resolve(__dirname, "./koa2-server/public"),
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
        target: 'http://10.2.5.74:7001/',
        changeOrigin: true,
        ws: true
      },
    }
  },
  lintOnSave: false
}