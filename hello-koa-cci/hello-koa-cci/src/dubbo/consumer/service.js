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
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoProvider = void 0;
const apache_dubbo_js_1 = require("apache-dubbo-js");
//========================provider=======================
const demoProvider = (dubbo) => dubbo.proxyService({
    dubboInterface: 'cci.hx.com.activiti.api.ActivitiExcuteService',
    version: '1.0.0',
    timeout: 300000,
    methods: {
        excute(json) {
            return [apache_dubbo_js_1.java.String(json)];
        },
        test(name) {
            console.log('service.ts第41行:::test', 1111111111111, name);
            console.log('service.ts第43行:::[java.String(name)]', [apache_dubbo_js_1.java.String(name)]);
            return [apache_dubbo_js_1.java.String(name)];
        }
    },
});
exports.demoProvider = demoProvider;
//# sourceMappingURL=service.js.map