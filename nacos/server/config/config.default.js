/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path')

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
  config.keys = appInfo.name + '_1615090280936_5160';

  // add your middleware config here
  config.middleware = [];


  // view
  config.view = {
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.html',
    root: [
      path.join(appInfo.baseDir, 'app/view'),
      // path.join(appInfo.baseDir, 'path/to/another'),
    ].join(',')
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
