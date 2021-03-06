"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {Dubbo, setting, zk} from 'apache-dubbo-js';
const apache_dubbo_js_1 = require("apache-dubbo-js");
const service = __importStar(require("./service"));
/**
 * setting dubbo invoke params, such version, group etc.
 */
const dubboSetting = apache_dubbo_js_1.setting
    .match([
    'cci.hx.com.activiti.api.ActivitiExcuteService',
], {
// version: '1.0.0',
});
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
const dubbo = new apache_dubbo_js_1.Dubbo({
    // isSupportedDubbox: true,
    dubboInvokeTimeout: 3600000,
    application: { name: 'hyman_povider' },
    service,
    dubboSetting,
    // default zookeeper
    register: `10.12.102.26:2181`,
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
exports.default = dubbo;
//# sourceMappingURL=dubbo.js.map