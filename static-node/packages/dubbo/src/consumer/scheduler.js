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
var dubbo_agent_1 = require("./dubbo-agent");
var util_1 = require("../common/util");
var err_1 = require("../common/err");
var log = debug_1["default"]('dubbo:scheduler');
/**
 * scheduler
 * 1. 初始化zookeeper和dubbo-agent
 * 2. 接受所有的socket-worker的事件
 * 3. 处理用户的请求
 * 4. 接受zookeeper的变化，更新dubbo-agent
 */
var Scheduler = /** @class */ (function () {
    function Scheduler(registry, queue) {
        var _this = this;
        /**
         * handle request in queue
         * @param requestId
         */
        this._handleQueueRequest = function (requestId) {
            //record current status
            log("handle requestId " + requestId + ", current status: " + _this._status);
            switch (_this._status) {
                case "ready" /* READY */:
                    //发起dubbo的调用
                    _this._handleDubboInvoke(requestId);
                    break;
                case "padding" /* PADDING */:
                    log('current scheduler was padding');
                    break;
                case "no_agent" /* NO_AGENT */:
                    _this._handleFailed(requestId, new err_1.ScheduleError('Zookeeper Can not be find any agents'));
                    break;
                case "failded" /* FAILED */:
                    _this._handleFailed(requestId, new err_1.ScheduleError('ZooKeeper Could not be connected'));
                    break;
            }
        };
        /**
         * 处理zookeeper的数据
         */
        this._handleClientOnData = function (agentSet) {
            //获取负载列表
            log("get agent address:=> %O", agentSet);
            //如果负载为空，也就是没有任何provider提供服务
            if (agentSet.size === 0) {
                _this._status = "no_agent" /* NO_AGENT */;
                //将队列中的所有dubbo调用全调用失败
                var err = new err_1.ScheduleError('Can not be find any agents');
                _this._queue.allFailed(err);
                util_1.traceErr(err);
                return;
            }
            //初始化dubboAgent
            _this._dubboAgent.from(agentSet).subscribe({
                onConnect: _this._handleOnConnect,
                onData: _this._handleOnData,
                onClose: _this._handleOnClose
            });
        };
        /**
         * 处理zookeeper的错误
         */
        this._handleClientError = function (err) {
            log(err);
            util_1.traceErr(err);
            //说明zookeeper连接不上
            if (err instanceof err_1.ClientTimeoutError) {
                switch (_this._status) {
                    // 当zk已经初始化完成后, 相应的provider已经找到了, 如果zk这时出现问题, 不应该让provider不允许调用
                    case "ready" /* READY */:
                        break;
                    default:
                        _this._status = "failded" /* FAILED */;
                }
            }
        };
        /**
         * 处理schedule的failed状态
         */
        this._handleFailed = function (requestId, err) {
            log('#requestId: %d scheduler was failed, err: %s', requestId, err);
            _this._queue.failed(requestId, err);
        };
        this._handleOnConnect = function (_a) {
            var pid = _a.pid, host = _a.host, port = _a.port;
            log("scheduler receive socket-worker connect pid#" + pid + " " + host + ":" + port);
            var agentHost = host + ":" + port;
            _this._status = "ready" /* READY */;
            util_1.traceInfo("scheduler receive socket-worker connect pid#" + pid + " " + host + ":" + port);
            for (var _i = 0, _b = _this._queue.requestQueue.values(); _i < _b.length; _i++) {
                var ctx = _b[_i];
                if (ctx.isNotScheduled) {
                    var agentHostList = Object.keys(_this._registry.getAgentAddrMap(ctx));
                    log('agentHostList-> %O', agentHostList);
                    //当前的socket是否可以处理当前的请求
                    if (agentHostList.indexOf(agentHost) != -1) {
                        _this._handleDubboInvoke(ctx.requestId);
                    }
                }
            }
        };
        /**
         * 当收到数据的时候
         */
        this._handleOnData = function (_a) {
            var requestId = _a.requestId, res = _a.res, err = _a.err, attachments = _a.attachments;
            if (err) {
                _this._queue.failed(requestId, err, attachments);
            }
            else {
                _this._queue.resolve(requestId, res, attachments);
            }
        };
        /**
         * 处理某一个SocketWorker被关闭的状态
         */
        this._handleOnClose = function (_a) {
            var pid = _a.pid;
            log("socket-worker#" + pid + " was close");
            //查询之前哪些接口的方法被pid调用, 然后直接failfast
            var requestQueue = _this._queue.requestQueue;
            for (var _i = 0, requestQueue_1 = requestQueue; _i < requestQueue_1.length; _i++) {
                var _b = requestQueue_1[_i], requestId = _b[0], ctx = _b[1];
                if (ctx.pid === pid) {
                    _this._handleFailed(requestId, new err_1.SocketError("socket-worker#" + pid + " had closed."));
                }
            }
        };
        log("new scheduler");
        this._status = "padding" /* PADDING */;
        this._queue = queue;
        this._queue.subscribe(this._handleQueueRequest);
        this._dubboAgent = new dubbo_agent_1["default"]();
        //init ZkClient and subscribe
        this._registry = registry.subscribe({
            onData: this._handleClientOnData,
            onError: this._handleClientError
        });
    }
    /**
     * static factory method
     * @param props
     */
    Scheduler.from = function (registry, queue) {
        return new Scheduler(registry, queue);
    };
    /**
     * 发起dubbo调用
     * @param ctx
     * @param agentHostList
     */
    Scheduler.prototype._handleDubboInvoke = function (requestId) {
        //get request context
        var ctx = this._queue.requestQueue.get(requestId);
        // match any agent?
        var hasAgent = this._registry.hasAgentAddr(ctx);
        if (!hasAgent) {
            var dubboInterface = ctx.dubboInterface;
            var err = new err_1.ScheduleError("requestId#" + requestId + ":Could not find any agent worker with " + dubboInterface);
            this._handleFailed(requestId, err);
            log(err);
            return;
        }
        // get agent addr map
        var agentAddrMap = this._registry.getAgentAddrMap(ctx);
        //get socket agent list
        var agentAddrList = Object.keys(agentAddrMap);
        log('agentAddrSet-> %O', agentAddrList);
        if (agentAddrList.length === 0) {
            var dubboInterface = ctx.dubboInterface, version = ctx.version, group = ctx.group;
            var msg = "requestId#" + requestId + " Could not find any match service with " + dubboInterface + "#" + version + "#" + (group ||
                '');
            var err = new err_1.ScheduleError(msg);
            this._handleFailed(requestId, err);
            log(err);
            return;
        }
        var worker = this._dubboAgent.getAvailableSocketWorker(agentAddrList);
        //if could not find any available socket agent worker
        if (!worker) {
            var dubboInterface = ctx.dubboInterface, version = ctx.version, group = ctx.group;
            var msg = "requestId#" + requestId + ":Could not find any available agent worker with " + dubboInterface + "#" + version + "#" + group + " agentList: " + agentAddrList.join(',');
            var err = new err_1.ScheduleError(msg);
            this._handleFailed(requestId, err);
            log(err);
            return;
        }
        ctx.invokeHost = worker.host;
        ctx.invokePort = worker.port;
        var providerProps = agentAddrMap[ctx.invokeHost + ":" + ctx.invokePort];
        this._queue.consume(ctx.requestId, worker, providerProps);
    };
    return Scheduler;
}());
exports["default"] = Scheduler;
