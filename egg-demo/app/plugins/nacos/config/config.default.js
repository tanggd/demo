/* eslint valid-jsdoc: "off" */

'use strict';

// add your user config here
// 设置启动端口
const servicePort = 9763;
// 允许通过ip访问
const hostname = '0.0.0.0';

const userConfig = {
  // myAppName: 'egg',
  cluster: {
    listen: {
      path: '',
      port: servicePort,
      hostname,
    },
  },
};

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1614070969927_418';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
