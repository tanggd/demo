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
var util_1 = require("../common/util");
/**
 * 抽取注册中心的基类
 */
var Registry = /** @class */ (function () {
    function Registry(props) {
        this._dubboProps = props;
        //保存dubbo接口和服务url之间的映射关系
        this._dubboServiceUrlMap = new Map();
        //初始化订阅者
        this._subscriber = { onData: util_1.noop, onError: util_1.noop };
    }
    /**
     * 订阅者
     * @param subscriber
     */
    Registry.prototype.subscribe = function (subscriber) {
        this._subscriber = subscriber;
        return this;
    };
    /**
     * 获取可以处理上下文context中的dubbo接口信息map
     * @param ctx
     */
    Registry.prototype.getAgentAddrMap = function (ctx) {
        var dubboInterface = ctx.dubboInterface, version = ctx.version, group = ctx.group;
        return this._dubboServiceUrlMap
            .get(dubboInterface)
            .filter(function (serviceProp) {
            // "*" refer to default wildcard in dubbo
            var isSameVersion = !version || version == '*' || serviceProp.version === version;
            //如果Group为null，就默认匹配， 不检查group
            //如果Group不为null，确保group和接口的group一致
            var isSameGroup = !group || group === serviceProp.group;
            return isSameGroup && isSameVersion;
        })
            .reduce(function (reducer, prop) {
            var host = prop.host, port = prop.port;
            reducer[host + ":" + port] = prop;
            return reducer;
        }, Object.create(null));
    };
    Registry.prototype.hasAgentAddr = function (ctx) {
        var agentAddr = this._dubboServiceUrlMap.get(ctx.dubboInterface);
        return agentAddr && agentAddr.length > 0;
    };
    return Registry;
}());
exports["default"] = Registry;
