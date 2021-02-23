'use strict';
// https://github.com/nacos-group/nacos-sdk-nodejs
// 注册消费服务
const {
    NacosNamingClient,
} = require('nacos');

const {
    address,
} = require('ip');

module.exports = function (agent) {
    const { logger } = agent;
    logger.info('[ssr-nacos] 注册SSR-Nacos服务');

    // 动态获取 IP 地址
    const ipAddr = address();
    // 我们当前应用的端口号
    const port = 7001

    // 服务名称，后面消费方调用的时候通过这个服务名进行服务查询。
    const providerServiceName = 'cloud:nacos-print-ssr';
    // nacos服务地址，我们刚刚在本地启动的服务地址是‘127.0.0.1:8848’
    // const nacosServerAddress = '127.0.0.1:8848';
    const nacosServerAddress = 'http://10.12.102.26:8848';
    // http://10.12.102.26:8848/nacos/
    // namespace: 名称空间必须在服务器上存在，可以自行新建。http://127.0.0.1:8848/nacos/#/namespace?dataId=&group=&appName=
    const providerNamespase = 'public';
    const client = new NacosNamingClient({
        logger,
        serverList: nacosServerAddress,
        namespace: providerNamespase,
    });

    agent.beforeStart(async () => {
        try {
            await client.ready();
            await client.registerInstance(providerServiceName, {
                ip: ipAddr,
                port
            });
            // 这里也可以传入group，不传默认就是 DEFAULT_GROUP
            // const groupName = 'nodejs';
            // await client.registerInstance(providerServiceName, {
                // ip: ipAddr,
                // port
            // }, groupName);
            logger.info(`[ssr-nacos] 注册成功: ${ipAddr}:${port}`);
        } catch (err) {
            logger.error('[ssr-nacos] 注册失败: ' + err.toString());
        }
    });

    agent.beforeClose(async () => {
        try {
            await client.close();
            await client.deregisterInstance(providerServiceName, {
                ip: ipAddr,
                port
            });
            logger.info(`[ssr-nacos] 注销成功: ${ipAddr}:${port}`);
        } catch (err) {
            logger.error('[ssr-nacos] 注销失败: ' + err.toString());
        }
    });
}