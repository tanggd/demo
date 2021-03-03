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
exports.__esModule = true;
var registry_1 = require("./registry");
exports.Registry = registry_1["default"];
var registry_zookeeper_1 = require("./registry-zookeeper");
exports.zk = registry_zookeeper_1["default"];
var registry_nacos_1 = require("./registry-nacos");
exports.nacos = registry_nacos_1["default"];
var util_1 = require("util");
/**
 * parse registry
 *
 * we support registry mode
 *
 * 1. url string, such as
 *  - localhost:2181 // default as zookeeper
 *  - nacos://localhost:2181
 *
 * 2. factory function
 *  - zk('') => (props: IDubboProviderRegistryProps) => void
 *  - nacos() => (props: IDubboProviderRegistryProps) => void
 * @param param
 */
function fromRegistry(param) {
    if (util_1.isString(param) && param.startsWith('nacos://')) {
        return registry_nacos_1["default"]({ url: param });
    }
    else if (util_1.isString(param)) {
        return registry_zookeeper_1["default"]({ url: param });
    }
    else if (util_1.isFunction(param)) {
        return param;
    }
}
exports.fromRegistry = fromRegistry;
