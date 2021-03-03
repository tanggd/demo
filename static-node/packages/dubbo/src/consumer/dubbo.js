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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var debug_1 = require("debug");
var koa_compose_1 = require("koa-compose");
var util_1 = require("util");
var config_1 = require("../common/config");
var request_context_1 = require("./request-context");
var go_1 = require("../common/go");
var queue_1 = require("./queue");
var registry_1 = require("../registry");
var scheduler_1 = require("./scheduler");
var util_2 = require("../common/util");
var log = debug_1["default"]('dubbo:bootstrap');
var packageVersion = require('../../package.json').version;
log('dubbo-js version :=> %s', packageVersion);
/**
 * Dubbo
 *
 * 1. 连接注册中心zookeeper
 * 2. 发起远程dubbo service的方法调用
 * 3. 序列化/反序列化dubbo协议
 * 4. 管理tcp连接以及心跳
 * 5. 通过代理机制自动代理interface对应的方法
 * 6. 提供直连的方式快速测试接口
 * 7. Middleware
 * 8. 通过zone-context可以实现dubbo调用的全链路跟踪
 * 9. 集中消息管理
 */
var Dubbo = /** @class */ (function () {
    function Dubbo(props) {
        var _this = this;
        /**
         * 代理dubbo的服务
         */
        this.proxyService = function (provider) {
            var _a = _this._props, application = _a.application, isSupportedDubbox = _a.isSupportedDubbox, dubboSetting = _a.dubboSetting;
            var dubboInterface = provider.dubboInterface, methods = provider.methods, timeout = provider.timeout;
            var proxyObj = Object.create(null);
            //collect interface
            _this._interfaces.push(dubboInterface);
            //get interface setting such as group, version
            var setting = dubboSetting.getDubboSetting(dubboInterface);
            if (!setting) {
                throw new Error("Could not find any group or version for " + dubboInterface + ", Please specify dubboSetting");
            }
            //proxy methods
            Object.keys(methods).forEach(function (name) {
                proxyObj[name] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return __awaiter(_this, void 0, void 0, function () {
                        var ctx, method, self, middlewares, fn, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    log('%s create context', name);
                                    ctx = request_context_1["default"].create();
                                    ctx.application = application;
                                    ctx.isSupportedDubbox = isSupportedDubbox;
                                    // set dubbo version
                                    ctx.dubboVersion = this._props.dubboVersion;
                                    method = methods[name];
                                    ctx.methodName = name;
                                    ctx.methodArgs = method.call.apply(method, [provider].concat(args)) || [];
                                    ctx.dubboInterface = dubboInterface;
                                    ctx.version = setting.version;
                                    ctx.timeout = timeout;
                                    ctx.group = setting.group || '';
                                    self = this;
                                    middlewares = this._middleware.concat([
                                        function handleRequest(ctx) {
                                            return __awaiter(this, void 0, void 0, function () {
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            log('start middleware handle dubbo request');
                                                            _a = ctx;
                                                            return [4 /*yield*/, go_1.go(self._queue.add(ctx))];
                                                        case 1:
                                                            _a.body = _b.sent();
                                                            log('end handle dubbo request');
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        },
                                    ]);
                                    log('middleware->', middlewares);
                                    fn = koa_compose_1["default"](middlewares);
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, fn(ctx)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _a.sent();
                                    log(err_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/, ctx.body];
                            }
                        });
                    });
                };
            });
            return proxyObj;
        };
        this._props = props;
        // check dubbo setting
        if (!props.dubboSetting) {
            throw new Error('Please specify dubboSetting');
        }
        // check dubbo register
        if (!util_1.isString(props.registry) && !util_1.isFunction(props.registry)) {
            throw new Error('Dubbo register must be string of function ');
        }
        this._interfaces = [];
        this._middleware = [];
        this._service = {};
        //初始化队列
        this._queue = queue_1["default"].create();
        //初始化config
        //全局超时时间(最大熔断时间)类似<dubbo:consumer timeout="sometime"/>
        //对应consumer客户端来说，用户设置了接口级别的超时时间，就使用接口级别的
        //如果用户没有设置用户级别，默认就是最大超时时间
        var dubboInvokeTimeout = props.dubboInvokeTimeout, dubboSocketPool = props.dubboSocketPool;
        config_1["default"].dubboInvokeTimeout = dubboInvokeTimeout || config_1["default"].dubboInvokeTimeout;
        config_1["default"].dubboSocketPool = dubboSocketPool || config_1["default"].dubboSocketPool;
        log("initial:|> %O", props);
        log('config:|> %O', config_1["default"]);
        //注册dubbo需要处理接口服务
        this._registryService(props.service);
        log('interfaces:|>', this._interfaces);
        this._readyPromise = new Promise(function (resolve) {
            _this._readyResolve = resolve;
        });
        this._subscriber = { onTrace: util_2.noop };
        //初始化消息监听
        this._initMsgListener();
        // get registry center
        var register = registry_1.fromRegistry(this._props.registry);
        //create scheduler
        scheduler_1["default"].from(register({
            type: 'consumer',
            application: props.application,
            interfaces: this._interfaces,
            dubboSetting: props.dubboSetting
        }), this._queue);
    }
    //========================public method===================
    /**
     * static factory method
     * @param props
     */
    Dubbo.from = function (props) {
        return new Dubbo(props);
    };
    Object.defineProperty(Dubbo.prototype, "service", {
        /**
         * get service from dubbo container
         */
        get: function () {
            return this._service;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * extends middleware, api: the same as koa
     * @param fn
     */
    Dubbo.prototype.use = function (fn) {
        if (typeof fn != 'function') {
            throw new TypeError('middleware must be a function');
        }
        log('use middleware %s', fn._name || fn.name || '-');
        this._middleware.push(fn);
        return this;
    };
    /**
     * dubbo的连接是异步的，有没有连接成功，通常需要到runtime才可以知道
     * 这时候可能会给我们一些麻烦，我们必须发出一个请求才能知道dubbo状态
     * 基于这种场景，我们提供一个方法，来告诉外部，dubbo是不是初始化成功，
     * 这样在node启动的过程中就知道dubbo的连接状态，如果连不上我们就可以
     * 及时的fixed
     *
     * 比如和egg配合起来，egg提供了beforeStart方法
     * 通过ready方法来等待dubbo初始化成功
     *
     * //app.js
     * export default (app: EggApplication) => {
     *   const dubbo = Dubbo.from({....})
     *   app.beforeStart(async () => {
     *     await dubbo.ready();
     *     console.log('dubbo was ready...');
     *   })
     * }
     *
     * 其他的框架类似
     */
    Dubbo.prototype.ready = function () {
        return this._readyPromise;
    };
    Dubbo.prototype.subscribe = function (subscriber) {
        this._subscriber = subscriber;
        return this;
    };
    //================private method================
    Dubbo.prototype._initMsgListener = function () {
        var _this = this;
        process.nextTick(function () {
            util_2.msg
                .addListener('sys:trace', function (msg) {
                _this._subscriber.onTrace(msg);
            })
                .addListener('sys:ready', function () {
                _this._readyResolve();
            });
            util_2.traceInfo("dubbo:bootstrap version => " + packageVersion);
        });
    };
    /**
     * 注册服务到dubbo容器中
     * @param service dubbo需要管理的接口服务
     * service style:
     * {[key: string]: (dubbo): T => dubbo.proxyService<T>({...})}
     */
    Dubbo.prototype._registryService = function (service) {
        for (var key in service) {
            this._service[key] = service[key](this);
        }
    };
    return Dubbo;
}());
exports["default"] = Dubbo;
