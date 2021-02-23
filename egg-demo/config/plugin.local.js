// 本地调试环境启动的时候会调用（使用npm run dev）
console.log('Local plugin config.');
module.exports = {
  nacos: {
    enable: true,
    path: '../app/plugins/nacos'
  }
};