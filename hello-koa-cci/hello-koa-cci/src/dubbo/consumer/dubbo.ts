/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// import {Dubbo, setting, zk} from 'apache-dubbo-js';
import { Dubbo, setting, zk} from 'apache-dubbo-js';
import * as service from './service';

/**
 * setting dubbo invoke params, such version, group etc.
 */
const dubboSetting = setting
  .match(
    [
      'cci.hx.com.activiti.api.ActivitiExcuteService',
    ],
    {
      // version: '1.0.0',
    },
  )

/**
 * create dubbo instance, it create proxyService
 */
// console.log('nacos-----', nacos);
// cci:
//   hx:
//     dubbo:
//       enable: true
//       timeout: 3600000
//       registry:
//         protocol: zookeeper
//         addr: 10.12.102.26
//         port: 2181
//       protocol:
//         config:
//           name: dubbo
//           port: 20880
//       consumer:
//         application:
//           name: hy_consumer
// dubbo%3A%2F%2F10.12.102.26%3A30880%2Fcci.hx.com.activiti.api.ActivitiExcuteService%3Fanyhost%3Dtrue%26application%3Dhyman_povider%26default.timeout%3D3600000%26dubbo%3D2.6.1%26generic%3Dfalse%26interface%3Dcci.hx.com.activiti.api.ActivitiExcuteService%26methods%3Dtest%2Cexcute%26pid%3D54775%26revision%3D1.0.0%26side%3Dprovider%26timeout%3D60000%26timestamp%3D1613994412717
const dubbo = new Dubbo<typeof service>({
  // isSupportedDubbox: true,
  dubboInvokeTimeout: 3600000,
  application: { name: 'hyman_povider'},
  service,
  dubboSetting,
  // default zookeeper
  register: `10.12.102.26:2181`,
  // register: `nacos://localhost:8848`,
  // register: `localhost:8848`,
  // register: nacos({
  //   url: 'nacos:localhost:8848',
  // }),
});

/**
 * apache-dubbo-js middleware Extension mechanism the same as koa middleware
 */
dubbo.use(async (ctx, next) => {
  await next();
  console.log('-providerAttachments-->', ctx.providerAttachments);
});

/**
 * subscribe apache-dubbo-js inner message
 */
dubbo.subscribe({
  onTrace(msg) {
    console.log(msg);
  },
});

export default dubbo;
