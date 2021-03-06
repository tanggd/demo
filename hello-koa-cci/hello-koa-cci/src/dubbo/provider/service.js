"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const ip_1 = __importDefault(require("ip"));
const js_to_java_1 = __importDefault(require("js-to-java"));
var Sex;
(function (Sex) {
    Sex[Sex["male"] = 0] = "male";
    Sex[Sex["female"] = 1] = "female";
})(Sex || (Sex = {}));
class UserResponse {
    __fields2java() {
        return js_to_java_1.default('org.apache.dubbo.demo.UserResponse', {
            status: js_to_java_1.default.String(this.status),
            info: this.info,
        });
    }
}
class TypeRequest {
    __fields2java() {
        return js_to_java_1.default('org.apache.dubbo.demo.TypeRequest', {
            map: this.map,
            bigDecimal: js_to_java_1.default.BigDecimal(this.bigDecimal.value),
        });
    }
}
//========================provider=======================
class DemoProvider {
    constructor() {
        this.dubboInterface = 'org.apache.dubbo.demo.DemoProvider';
        this.version = '1.0.0';
        this.methods = {
            sayHello(name) {
                return js_to_java_1.default.String(`Hello ${name}, response from provider ${ip_1.default.address()}`);
            },
            echo() {
                return 'pang';
            },
            test() {
                console.log('test');
            },
            getUserInfo(request) {
                console.log(request);
                const res = new UserResponse();
                res.status = 'ok';
                const map = new Map();
                map.set('id', '1');
                map.set('name', 'test');
                res.info = map;
                return res;
            },
        };
    }
}
const basicTypeProvider = {
    dubboInterface: 'org.apache.dubbo.demo.BasicTypeProvider',
    version: '2.0.0',
    methods: {
        testBasicType(req) {
            const response = new TypeRequest();
            response.bigDecimal = { value: '100.00' };
            const map = new Map();
            map.set('hello', 'world');
            response.map = map;
            return response;
        },
    },
};
class ErrorProvider {
    constructor() {
        this.dubboInterface = 'org.apache.dubbo.demo.ErrorProvider';
        this.version = '1.0.0';
        this.methods = {
            errorTest() {
                throw new Error('ErrorProvider error');
            },
        };
    }
}
exports.default = [new DemoProvider(), basicTypeProvider, new ErrorProvider()];
//# sourceMappingURL=service.js.map