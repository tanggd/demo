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
var request_context_1 = require("./request-context");
var go_1 = require("../common/go");
var socket_worker_1 = require("./socket-worker");
var log = debug_1["default"]('directly-dubbo');
/**
 * 直连dubbo的远程方法，方便快速测试还没有发布到zookeeper的的方法
 * Usage:
 *
const dubbo = DirectlyDubbo.from({
  dubboAddress: 'localhost:20880',
  dubboVersion: '2.0.0',
  dubboInvokeTimeout: 10,
});

const demoService = dubbo.proxyService<IDemoService>({
  dubboInterface: 'com.alibaba.dubbo.demo.DemoService',
  version: '1.0.0',
  methods: {
    sayHello(name) {
      return [java.String(name)];
    },

    echo() {},

    test() {},

    getUserInfo() {
      return [
        java.combine('com.alibaba.dubbo.demo.UserRequest', {
          id: 1,
          name: 'nodejs',
          email: 'node@qianmi.com',
        }),
      ];
    },
  },
});
 */
var DirectlyDubbo = /** @class */ (function () {
    function DirectlyDubbo(props) {
        var _this = this;
        //===================socket event===================
        this.onConnect = function () {
            _this._socketStatus = "CONNECTED" /* CONNECTED */;
            for (var _i = 0, _a = _this._queue.values(); _i < _a.length; _i++) {
                var ctx = _a[_i];
                //如果还没有被处理
                if (ctx.isNotScheduled) {
                    _this._socketWorker.write(ctx);
                }
            }
        };
        this.onData = function (_a) {
            var requestId = _a.requestId, res = _a.res, err = _a.err;
            log("onData->requestId#" + requestId + " err?: " + (err != null));
            err ? _this.fail(requestId, err) : _this.success(requestId, res);
        };
        this.onClose = function () {
            log('socket-worker was closed');
            _this._socketStatus = "CLOSED" /* CLOSED */;
            //failed all
            for (var _i = 0, _a = _this._queue.values(); _i < _a.length; _i++) {
                var ctx = _a[_i];
                ctx.reject(new Error('socket-worker was closed.'));
                ctx.cleanTimeout();
            }
            _this._queue.clear();
        };
        log('bootstrap....%O', this._props);
        this._props = props;
        this._queue = new Map();
        this._socketStatus = "PADDING" /* PADDING */;
        this._socketWorker = socket_worker_1["default"].from(this._props.dubboAddress).subscribe({
            onConnect: this.onConnect,
            onData: this.onData,
            onClose: this.onClose
        });
    }
    DirectlyDubbo.from = function (props) {
        return new DirectlyDubbo(props);
    };
    DirectlyDubbo.prototype.proxyService = function (invokeParam) {
        var _this = this;
        var dubboInterface = invokeParam.dubboInterface, methods = invokeParam.methods, timeout = invokeParam.timeout, group = invokeParam.group, version = invokeParam.version, _a = invokeParam.attachments, attachments = _a === void 0 ? {} : _a, _b = invokeParam.isSupportedDubbox, isSupportedDubbox = _b === void 0 ? false : _b;
        var proxy = Object.create(null);
        Object.keys(methods).forEach(function (methodName) {
            proxy[methodName] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return go_1.go(new Promise(function (resolve, reject) {
                    var ctx = request_context_1["default"].create();
                    ctx.resolve = resolve;
                    ctx.reject = reject;
                    ctx.methodName = methodName;
                    var method = methods[methodName];
                    ctx.methodArgs = method.call.apply(method, [invokeParam].concat(args)) || [];
                    ctx.dubboVersion = _this._props.dubboVersion;
                    ctx.dubboInterface = dubboInterface;
                    ctx.path = dubboInterface;
                    ctx.group = group;
                    ctx.timeout = timeout;
                    ctx.version = version;
                    ctx.attachments = attachments;
                    ctx.isSupportedDubbox = isSupportedDubbox;
                    //check param
                    //param should be hessian data type
                    if (!ctx.isMethodArgsHessianType) {
                        log(dubboInterface + " method: " + methodName + " not all arguments are valid hessian type");
                        log("arguments->" + JSON.stringify(ctx.methodArgs, null, 2));
                        reject(new Error('not all arguments are valid hessian type'));
                        return;
                    }
                    //超时检测
                    ctx.timeoutId = setTimeout(function () {
                        var requestId = ctx.requestId;
                        log(dubboInterface + " method: " + methodName + " invoke timeout");
                        _this.fail(requestId, new Error('remote invoke timeout'));
                    }, _this._props.dubboInvokeTimeout * 1000);
                    //add task to queue
                    _this.addQueue(ctx);
                }));
            };
        });
        return proxy;
    };
    /**
     * 成功的处理队列的任务
     * @param requestId
     * @param res
     */
    DirectlyDubbo.prototype.success = function (requestId, res) {
        var ctx = this._queue.get(requestId);
        if (!ctx) {
            return;
        }
        var resolve = ctx.resolve;
        resolve(res);
        ctx.cleanTimeout();
        this._queue["delete"](requestId);
    };
    /**
     * 失败的处理队列的任务
     * @param requestId
     * @param err
     */
    DirectlyDubbo.prototype.fail = function (requestId, err) {
        var ctx = this._queue.get(requestId);
        if (!ctx) {
            return;
        }
        var reject = ctx.reject;
        reject(err);
        ctx.cleanTimeout();
        this._queue["delete"](requestId);
    };
    DirectlyDubbo.prototype.addQueue = function (ctx) {
        var requestId = ctx.requestId;
        this._queue.set(requestId, ctx);
        log("current socketworkder=> " + this._socketStatus);
        //根据当前socket的worker的状态，来对任务进行处理
        switch (this._socketStatus) {
            case "PADDING" /* PADDING */:
                break;
            case "CONNECTED" /* CONNECTED */:
                this._socketWorker.write(ctx);
                break;
            case "CLOSED" /* CLOSED */:
                this.fail(requestId, new Error("socket-worker had closed."));
                break;
        }
    };
    return DirectlyDubbo;
}());
exports["default"] = DirectlyDubbo;
