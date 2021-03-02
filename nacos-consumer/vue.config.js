// const { application } = require('./config')
module.exports = {
  devServer: {
    // port: application.port,
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
  lintOnSave: false
}