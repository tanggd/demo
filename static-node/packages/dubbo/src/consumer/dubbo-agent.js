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
var debug_1 = require("debug");
var socket_worker_1 = require("./socket-worker");
var util_1 = require("../common/util");
var log = debug_1["default"]('dubbo:dubbo-agent');
/**
 * 机器agent和socket-worker的管理容器
 * Agent可以理解为一台dubbo service的负载
 */
var DubboAgent = /** @class */ (function () {
    function DubboAgent() {
        var _this = this;
        /**
         * static factor method
         * @param agentAddrList 负载地址列表
         */
        this.from = function (agentAddrs) {
            log('create-update dubbo-agent :|> %O', agentAddrs);
            //获取负载host:port列表
            process.nextTick(function () {
                for (var _i = 0, agentAddrs_1 = agentAddrs; _i < agentAddrs_1.length; _i++) {
                    var agentAddr = agentAddrs_1[_i];
                    //如果负载中存在该负载，继续下一个
                    if (_this._serverAgentMap.has(agentAddr)) {
                        //when current worker was retry, add retry chance
                        var worker = _this._serverAgentMap.get(agentAddr);
                        if (worker.isRetry) {
                            log(agentAddr + " was retry");
                            //add retry chance
                            worker.resetRetry();
                        }
                        continue;
                    }
                    util_1.traceInfo("ServerAgent create SocketWorker: " + agentAddr);
                    var socketWorker = socket_worker_1["default"].from(agentAddr).subscribe({
                        onConnect: _this._subscriber.onConnect,
                        onData: _this._subscriber.onData,
                        onClose: function (_a) {
                            var host = _a.host, pid = _a.pid, port = _a.port;
                            //delete close worker
                            _this._clearCloseWorker(host + ':' + port);
                            //notify scheduler
                            _this._subscriber.onClose({ pid: pid });
                        }
                    });
                    _this._serverAgentMap.set(agentAddr, socketWorker);
                }
            });
            return _this;
        };
        /**
         * remove close socket-worker from server agent
         */
        this._clearCloseWorker = function (agentAddr) {
            //如果全部关闭
            log("socket-worker#" + agentAddr + " was closed. delete this socket worker");
            _this._serverAgentMap["delete"](agentAddr);
            util_1.traceErr(new Error("socket-worker#" + agentAddr + " was closed. delete this socket worker"));
            if (util_1.isDevEnv) {
                log('SocketAgent current agentHost->', _this._serverAgentMap.keys());
            }
        };
        this._serverAgentMap = new Map();
        this._subscriber = {
            onConnect: util_1.noop,
            onData: util_1.noop,
            onClose: util_1.noop
        };
    }
    /**
     * 获取可用负载对应的socketWorker
     * @param agentAddrList
     */
    DubboAgent.prototype.getAvailableSocketWorker = function (agentAddrList) {
        if (agentAddrList === void 0) { agentAddrList = []; }
        var availableAgentList = this._getAvailableSocketAgents(agentAddrList);
        var len = availableAgentList.length;
        if (len === 0) {
            util_1.traceErr(new Error("agentAddrList->" + agentAddrList.join() + " could not find any avaliable socekt worker"));
            return null;
        }
        else if (len === 1) {
            return availableAgentList[0];
        }
        else {
            //match random
            return availableAgentList[Math.floor(Math.random() * len)];
        }
    };
    DubboAgent.prototype.subscribe = function (subscriber) {
        this._subscriber = subscriber;
        return this;
    };
    /**
     * 查询一组负载可用的agent
     * @param agentAddrList
     */
    DubboAgent.prototype._getAvailableSocketAgents = function (agentAddrList) {
        var availableList = [];
        for (var _i = 0, agentAddrList_1 = agentAddrList; _i < agentAddrList_1.length; _i++) {
            var agentAddr = agentAddrList_1[_i];
            var socketWorker = this._serverAgentMap.get(agentAddr);
            if (socketWorker && socketWorker.isAvaliable) {
                availableList.push(socketWorker);
            }
        }
        return availableList;
    };
    return DubboAgent;
}());
exports["default"] = DubboAgent;
