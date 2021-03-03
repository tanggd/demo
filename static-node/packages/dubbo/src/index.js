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
var js_to_java_1 = require("js-to-java");
exports.java = js_to_java_1["default"];
var request_context_1 = require("./consumer/request-context");
exports.Context = request_context_1["default"];
var directly_dubbo_1 = require("./consumer/directly-dubbo");
exports.DirectlyDubbo = directly_dubbo_1["default"];
var dubbo_1 = require("./consumer/dubbo");
exports.Dubbo = dubbo_1["default"];
var go_1 = require("./common/go");
exports.go = go_1.go;
var registry_1 = require("./registry");
exports.Registry = registry_1.Registry;
exports.zk = registry_1.zk;
exports.nacos = registry_1.nacos;
var setting_1 = require("./setting");
exports.setting = setting_1["default"];
var server_1 = require("./server/server");
exports.DubboServer = server_1["default"];
