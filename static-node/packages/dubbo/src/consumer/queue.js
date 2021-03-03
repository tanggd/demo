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
var config_1 = require("../common/config");
var err_1 = require("../common/err");
var statistics_1 = require("./statistics");
var util_1 = require("../common/util");
var constants_1 = require("../serialization/constants");
var log = debug_1["default"]('dubbo:queue');
/**
 * Node的异步特性就会让我们在思考问题的时候，要转换一下思考问题的思维
 * 无论是zookeeper的连接，还是socket的创建都是异步的特性。
 * 但是请求的incoming的时候，整体可能还没有初始化结束，如果我们试图去阻塞
 * 就会导致整个编程架构很痛苦。
 * 所有简单的处理就是，每次处理请求incoming的时候先把请求参数推入队列，然后
 * 等待后面的资源初始化结束进行处理，如果超过超时时间就自动进行timeout超时处理
 */
var Queue = /** @class */ (function () {
    function Queue() {
        var _this = this;
        this.add = function (ctx) {
            return new Promise(function (resolve, reject) {
                ctx.resolve = resolve;
                ctx.reject = reject;
                //hessian参数检测
                if (!Queue._checkMethodArgsHessianType(ctx)) {
                    return;
                }
                //timeout超时检测
                _this._checkTimeout(ctx);
                //add queue
                var _a = ctx.request, requestId = _a.requestId, dubboInterface = _a.dubboInterface;
                log("add queue,requestId#" + requestId + ", interface: " + dubboInterface);
                //设置调用队列
                _this._requestQueue.set(requestId, ctx);
                if (util_1.isDevEnv) {
                    log("current schedule queue =>", _this.scheduleQueue);
                }
                //通知scheduler
                _this._subscriber(requestId, ctx);
            });
        };
        log('new Queue');
        //调用队列-保持调用的requestId和参数
        this._requestQueue = new Map();
        //订阅者,当有新的dubbo请求添加到队列中，通知schedule进行处理
        this._subscriber = util_1.noop;
    }
    Queue.prototype._clear = function (requestId) {
        log("clear invoke and schedule queue #" + requestId);
        this._requestQueue["delete"](requestId);
        if (util_1.isDevEnv) {
            log('current schedule queue', this.scheduleQueue);
            this._showStatistics();
        }
    };
    /**
     * static factory method
     */
    Queue.create = function () {
        return new Queue();
    };
    Object.defineProperty(Queue.prototype, "requestQueue", {
        /**
         * 获取当前请求队列
         */
        get: function () {
            return this._requestQueue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "scheduleQueue", {
        /**
         * 获取当前调度队列
         */
        get: function () {
            var schedule = {};
            for (var _i = 0, _a = this._requestQueue; _i < _a.length; _i++) {
                var _b = _a[_i], requestId = _b[0], ctx = _b[1];
                schedule[requestId] = ctx.pid;
            }
            return schedule;
        },
        enumerable: true,
        configurable: true
    });
    Queue.prototype.subscribe = function (cb) {
        this._subscriber = cb;
        return this;
    };
    Queue.prototype.allFailed = function (err) {
        for (var _i = 0, _a = this._requestQueue; _i < _a.length; _i++) {
            var _b = _a[_i], requestId = _b[0], ctx = _b[1];
            var reject = ctx.reject, _c = ctx.request, dubboInterface = _c.dubboInterface, methodName = _c.methodName;
            log('queue schedule failed requestId#%d, %s#%s err: %s', requestId, dubboInterface, methodName, err);
            ctx.cleanTimeout();
            reject(err);
        }
        this._requestQueue.clear();
    };
    Queue.prototype.failed = function (requestId, err, attachments) {
        if (attachments === void 0) { attachments = {}; }
        var ctx = this._requestQueue.get(requestId);
        if (!ctx) {
            return;
        }
        var uuid = ctx.uuid, _a = ctx.request, dubboInterface = _a.dubboInterface, methodName = _a.methodName;
        log('queue schedule failed requestId#%d, err: %s', requestId, err);
        err.message = "uuid: " + uuid + " invoke " + dubboInterface + "#" + methodName + " was error, " + err.message;
        //删除该属性，不然会导致JSON.Stringify失败
        if (err['cause']) {
            delete err['cause']['cause'];
        }
        //dubbo2.6.3
        ctx.providerAttachments = attachments;
        ctx.cleanTimeout();
        ctx.reject(err);
        this._clear(requestId);
    };
    Queue.prototype.consume = function (requestId, node, providerMeta) {
        var ctx = this._requestQueue.get(requestId);
        if (!ctx) {
            return;
        }
        var request = ctx.request;
        var dubboInterface = request.dubboInterface, version = request.version;
        log("staring schedule " + requestId + "#" + dubboInterface + "#" + version);
        //merge dubboVersion timeout group
        request.dubboVersion =
            request.dubboVersion ||
                providerMeta.dubboVersion ||
                constants_1.DEFAULT_DUBBO_PROTOCOL_VERSION;
        request.group = request.group || providerMeta.group;
        request.path = providerMeta.path;
        try {
            node.write(ctx);
        }
        catch (err) {
            this.failed(requestId, err);
            util_1.traceErr(err);
        }
        if (util_1.isDevEnv) {
            log("current schedule queue ==>", this.scheduleQueue);
        }
    };
    Queue.prototype.resolve = function (requestId, res, attachments) {
        if (attachments === void 0) { attachments = {}; }
        var ctx = this._requestQueue.get(requestId);
        if (!ctx) {
            return;
        }
        log('resolve requestId#%d, res: %O', requestId, res);
        //dubbo2.6.3
        ctx.providerAttachments = attachments;
        ctx.cleanTimeout();
        ctx.resolve(res);
        this._clear(requestId);
    };
    Queue.prototype._showStatistics = function () {
        //调度完成,显示调度结果
        if (this._requestQueue.size === 0) {
            log('invoke statistics==>%o', statistics_1["default"]);
        }
    };
    /**
     * 检测方法参数是不是都是hessian格式
     * @param ctx
     */
    Queue._checkMethodArgsHessianType = function (ctx) {
        if (ctx.isMethodArgsHessianType) {
            return true;
        }
        var _a = ctx.request, dubboInterface = _a.dubboInterface, methodArgs = _a.methodArgs, methodName = _a.methodName;
        statistics_1["default"].paramCheckErrCount++;
        log(dubboInterface + " method: " + methodName + " not all arguments are valid hessian type arguments: => %O", methodArgs);
        ctx.reject(new err_1.DubboMethodParamHessianTypeError("err: " + dubboInterface + "#" + methodName + " not all arguments are valid hessian type"));
        return false;
    };
    /**
     * 超时检测
     * @param ctx
     */
    Queue.prototype._checkTimeout = function (ctx) {
        var _this = this;
        //先获取上下文设置的超时时间，如果没有设置就获取最大超时时间
        var timeout = (ctx.timeout || config_1["default"].dubboInvokeTimeout) * 1000;
        log('check timeout: ctx.timeout-> %d @timeout: %d', ctx.timeout, timeout);
        ctx.timeoutId = setTimeout(function () {
            statistics_1["default"].timeoutErrCount++;
            var _a = ctx.request, requestId = _a.requestId, dubboInterface = _a.dubboInterface, methodName = _a.methodName;
            log("err: " + dubboInterface + "#" + methodName + " remote invoke timeout");
            _this.failed(requestId, new err_1.DubboTimeoutError("err:" + dubboInterface + "#" + methodName + " remote invoke timeout"));
        }, timeout);
    };
    return Queue;
}());
exports["default"] = Queue;
