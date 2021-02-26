const { application } = require('./config')
module.exports = {
  devServer: {
    port: application.port,
    proxy: {
      "/serviceApi": {
        target: 'http://10.2.5.141:7002/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "/serviceApi": "/api"
        }
      },
      "/api": {
        target: 'xxx',
        changeOrigin: true,
        ws: true
      },
    }
  },
  lintOnSave: false
}