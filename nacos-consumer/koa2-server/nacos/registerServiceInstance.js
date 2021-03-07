/**
 * 注册服务到nacos
 */
const { NacosNamingClient } = require("nacos");
const { nacosConfig, appConfig } = require("./../config");
const logger = console;

const registerServiceInstance = async function() {
  const { serverList, namespace } = nacosConfig;
  const { name: serviceName, ip, port } = appConfig;

  const client = new NacosNamingClient({
    logger,
    serverList,
    namespace,
  });

  await client.ready();

  // registry instance
  await client.registerInstance(serviceName, {
    ip,
    port,
  });
};

module.exports = registerServiceInstance;
