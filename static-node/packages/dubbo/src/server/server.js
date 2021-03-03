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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var net_1 = require("net");
var ip_1 = require("ip");
var querystring_1 = require("querystring");
var debug_1 = require("debug");
var koa_compose_1 = require("koa-compose");
var decode_hessian2_1 = require("../serialization/decode-hessian2");
var encode_hessian2_1 = require("../serialization/encode-hessian2");
var heartbeat_1 = require("../serialization/heartbeat");
var decode_buffer_1 = require("../serialization/decode-buffer");
var response_context_1 = require("./response-context");
var util_1 = require("../common/util");
var util_2 = require("util");
var registry_1 = require("../registry");
var log = debug_1["default"]('dubbo-server');
var isMap = function (val) {
    return Object.prototype.toString.call(val);
};
var DubboServer = /** @class */ (function () {
    function DubboServer(props) {
        var _this = this;
        this.start = function () {
            // TODO 完善promise机制
            _this._server = net_1["default"]
                .createServer(_this._handleSocketRequest)
                .listen(_this._port, function () {
                log('start dubbo-server with port %d', _this._port);
                _this._registerServices();
            });
        };
        this._handleSocketRequest = function (socket) {
            log('tcp socket establish connection');
            // init heartbeat
            var heartbeat = heartbeat_1["default"].from({
                type: 'response',
                transport: socket,
                onTimeout: function () { return socket.destroy(); }
            });
            decode_buffer_1["default"].from(socket, 'dubbo-server').subscribe(function (data) { return __awaiter(_this, void 0, void 0, function () {
                var ctx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (heartbeat_1["default"].isHeartBeat(data)) {
                                log("receive socket client heartbeat");
                                heartbeat.emit();
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this._invokeRequest(data)];
                        case 1:
                            ctx = _a.sent();
                            heartbeat.setWriteTimestamp();
                            socket.write(new encode_hessian2_1.DubboResponseEncoder(ctx).encode());
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        var port = props.port, services = props.services;
        this._port = port || 20880;
        this._registry = props.registry;
        this._middlewares = [];
        this._services = services || [];
        this._serviceMap = new Map();
        // debug log
        log("init service with port: %d", this._port);
        for (var _i = 0, _a = this._services; _i < _a.length; _i++) {
            var service = _a[_i];
            var methods = Object.keys(service.methods);
            var s = __assign({}, service, { methods: methods });
            log('registry services %j', s);
        }
    }
    DubboServer.from = function (props) {
        return new DubboServer(props);
    };
    DubboServer.prototype.close = function () {
        this._server &&
            this._server.close(function () {
                log("server was closed");
            });
    };
    /**
     * extends middleware
     * @param fn
     */
    DubboServer.prototype.use = function (fn) {
        if (typeof fn != 'function') {
            throw new TypeError('middleware must be a function');
        }
        log('use middleware %s', fn._name || fn.name || '-');
        this._middlewares.push(fn);
        return this;
    };
    DubboServer.prototype._invokeRequest = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var request, service, context, methodName, _a, path, group, version, middlewares, fn, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        request = decode_hessian2_1.decodeDubboRequest(data);
                        service = this.matchService(request);
                        context = new response_context_1["default"](request);
                        methodName = request.methodName, _a = request.attachment, path = _a.path, group = _a.group, version = _a.version;
                        // service not found
                        if (!service) {
                            context.status = response_context_1.ResponseStatus.SERVICE_NOT_FOUND;
                            context.body.err = new Error("Service not found with " + path + " and " + methodName + ", group:" + group + ", version:" + version);
                            return [2 /*return*/, context];
                        }
                        middlewares = this._middlewares.concat([
                            function handleRequest(ctx) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var method, err, res, error_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                method = service.methods[request.methodName];
                                                ctx.status = response_context_1.ResponseStatus.OK;
                                                err = null;
                                                res = null;
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, method.apply(service, (request.args || []).concat([ctx]))];
                                            case 2:
                                                res = _a.sent();
                                                // check hessian type
                                                if (!DubboServer.checkRetValHessian(res)) {
                                                    throw new Error(path + "#" + methodName + " return value not hessian type");
                                                }
                                                return [3 /*break*/, 4];
                                            case 3:
                                                error_1 = _a.sent();
                                                err = error_1;
                                                return [3 /*break*/, 4];
                                            case 4:
                                                ctx.body = {
                                                    res: res,
                                                    err: err
                                                };
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            },
                        ]);
                        log('middleware stack =>', middlewares);
                        fn = koa_compose_1["default"](middlewares);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fn(context)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        log(err_1);
                        context.status = response_context_1.ResponseStatus.SERVER_ERROR;
                        context.body.err = err_1;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, context];
                }
            });
        });
    };
    DubboServer.prototype._registerServices = function () {
        var services = this._services;
        // init serviceMap
        for (var _i = 0, services_1 = services; _i < services_1.length; _i++) {
            var service = services_1[_i];
            this._serviceMap.set(service.dubboInterface, service);
        }
        var registryService = [];
        for (var _a = 0, services_2 = services; _a < services_2.length; _a++) {
            var service = services_2[_a];
            // compose dubbo url
            // dubbo://127.0.0.1:3000/org.apache.dubbo.js.HelloWorld?group=fe&version=1.0.0&method=sayHello,sayWorld
            var url = this._urlBuilder(service);
            // write to zookeeper
            registryService.push([service.dubboInterface, url]);
        }
        var registry = registry_1.fromRegistry(this._registry);
        registry({
            type: 'provider',
            services: registryService
        });
    };
    DubboServer.prototype._urlBuilder = function (service) {
        var ipAddr = ip_1["default"].address();
        var dubboInterface = service.dubboInterface, _a = service.group, group = _a === void 0 ? '' : _a, version = service.version, methods = service.methods;
        var methodName = Object.keys(methods).join();
        return encodeURIComponent("dubbo://" + ipAddr + ":" + this._port + "/" + dubboInterface + "?" +
            querystring_1["default"].stringify({
                group: group,
                version: version,
                method: methodName,
                side: 'provider',
                pid: process.pid,
                generic: false,
                protocal: 'dubbo',
                dynamic: true,
                category: 'providers',
                anyhost: true,
                timestamp: Date.now()
            }));
    };
    DubboServer.prototype.matchService = function (request) {
        var methodName = request.methodName;
        var _a = request.attachment, path = _a.path, _b = _a.group, group = _b === void 0 ? '' : _b, version = _a.version;
        var service = this._serviceMap.get(path);
        if (!service ||
            (service.methods[methodName] === undefined ||
                service.group !== group ||
                service.version !== version)) {
            return null;
        }
        return service;
    };
    /**
     * check hessian
     * @param res
     */
    DubboServer.checkRetValHessian = function (res) {
        // allow method return undefined, boolean, number, string, map directly
        if (typeof res === 'undefined' ||
            util_2.isBoolean(res) ||
            util_2.isNumber(res) ||
            util_2.isString(res) ||
            isMap(res)) {
            return true;
        }
        var hessian = res.__fields2java ? res.__fields2java() : res;
        return util_1.checkHessianParam(hessian);
    };
    return DubboServer;
}());
exports["default"] = DubboServer;
