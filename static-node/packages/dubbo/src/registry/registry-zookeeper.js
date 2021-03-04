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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var debug_1 = require("debug");
var ip_1 = require("ip");
var node_zookeeper_client_1 = require("node-zookeeper-client");
var querystring_1 = require("querystring");
var dubbo_url_1 = require("../consumer/dubbo-url");
var err_1 = require("../common/err");
var go_1 = require("../common/go");
var util_1 = require("../common/util");
var registry_1 = require("./registry");
var log = debug_1["default"]('dubbo:zookeeper');
var ipAddress = ip_1.address();
var CHECK_TIME = 30 * 1000;
var ZkRegistry = /** @class */ (function (_super) {
    __extends(ZkRegistry, _super);
    function ZkRegistry(zkProps, dubboProp) {
        var _this = _super.call(this, dubboProp) || this;
        //========================private method==========================
        _this._init = function (err) { return __awaiter(_this, void 0, void 0, function () {
            var zkRoot, _a, name, interfaces, _i, interfaces_1, inf, dubboServicePath, _b, dubboServiceUrls, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        //zookeeper occur error
                        if (err) {
                            log(err);
                            util_1.traceErr(err);
                            this._subscriber.onError(err);
                            return [2 /*return*/];
                        }
                        // if current zk call from dubbo provider, registry provider service to zookeeper
                        if (this._dubboProps.type === 'provider') {
                            this._registryProviderServices();
                            return [2 /*return*/];
                        }
                        zkRoot = this._zkProps.zkRoot;
                        _a = this._dubboProps, name = _a.application.name, interfaces = _a.interfaces;
                        log("this._dubboProps=" + this._dubboProps.interfaces);
                        _i = 0, interfaces_1 = interfaces;
                        _c.label = 1;
                    case 1:
                        if (!(_i < interfaces_1.length)) return [3 /*break*/, 4];
                        inf = interfaces_1[_i];
                        dubboServicePath = "/" + zkRoot + "/" + inf + "/providers";
                        return [4 /*yield*/, go_1.go(this._getDubboServiceUrls(dubboServicePath, inf))];
                    case 2:
                        _b = _c.sent(), dubboServiceUrls = _b.res, err_2 = _b.err;
                        // 重连进入init后不能清空已有provider, 会导致运行中的请求找到, 报no agents错误
                        // 或者zk出现出错了, 无法获取provider, 那么之前获取的还能继续使用
                        if (err_2) {
                            log("getChildren " + dubboServicePath + " error " + err_2);
                            util_1.traceErr(err_2);
                            //If an error occurs, continue
                            return [3 /*break*/, 3];
                        }
                        // set dubbo interface meta info
                        this._dubboServiceUrlMap.set(inf, dubboServiceUrls.map(dubbo_url_1["default"].from));
                        //写入consumer信息
                        this._createConsumer({
                            name: name,
                            dubboInterface: inf
                        }).then(function () { return log('create Consumer finish'); });
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (util_1.isDevEnv) {
                            log('agentAddrSet: %O', this._allAgentAddrSet);
                            log('dubboServiceUrl:|> %O', this._dubboServiceUrlMap);
                        }
                        this._subscriber.onData(this._allAgentAddrSet);
                        return [2 /*return*/];
                }
            });
        }); };
        //========================zookeeper helper=========================
        /**
         * connect zookeeper
         */
        _this._connect = function (callback) {
            var _a = _this._zkProps, register = _a.url, zkAuthInfo = _a.zkAuthInfo;
            //debug log
            log("connecting zkserver " + register);
            // remove all listeners, avoid memory leak
            if (_this._client) {
                _this._client.removeAllListeners();
            }
            //connect
            _this._client = node_zookeeper_client_1["default"].createClient(register, {
                retries: 10
            });
            // add auth info
            if (zkAuthInfo && zkAuthInfo.scheme && zkAuthInfo.auth) {
                _this._client.addAuthInfo(zkAuthInfo.scheme, Buffer.from(zkAuthInfo.auth));
            }
            //手动做一个超时检测
            //node-zookeeper-client启动时候有个bug，当连不上zk时会无限重连
            var timeId = setTimeout(function () {
                log("Could not connect zk " + register + "\uFF0C time out");
                _this._client.close();
                callback(new err_1.ZookeeperTimeoutError("ZooKeeper was connected " + register + " time out. "));
            }, 30 * 1000);
            _this._client.once('connected', function () {
                log("connected to zkserver " + register);
                clearTimeout(timeId);
                callback(null);
                util_1.msg.emit('sys:ready');
                _this._monitor();
            });
            //the connection between client and server is dropped.
            _this._client.once('disconnected', function () {
                log("zk " + register + " had disconnected");
                clearTimeout(timeId);
                util_1.traceErr(new err_1.ZookeeperDisconnectedError("ZooKeeper was disconnected. current state is " + _this._client.getState() + " "));
                _this._reconnect();
            });
            _this._client.once('expired', function () {
                clearTimeout(timeId);
                log("zk " + register + " had session expired");
                util_1.traceErr(new err_1.ZookeeperExpiredError("Zookeeper was session Expired Error current state " + _this._client.getState()));
                _this._client.close();
            });
            //connect
            _this._client.connect();
        };
        _this._getChildren = function (path, watch) {
            return new Promise(function (resolve, reject) {
                _this._client.getChildren(path, watch, function (err, children, stat) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({
                        children: children,
                        stat: stat
                    });
                });
            });
        };
        _this._create = function (path, mode) {
            return new Promise(function (resolve, rejec) {
                _this._client.create(path, mode, function (err, path) {
                    if (err) {
                        rejec(err);
                        return;
                    }
                    resolve(path);
                });
            });
        };
        _this._exists = function (path) {
            return new Promise(function (resolve, reject) {
                _this._client.exists(path, function (err, stat) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(stat);
                });
            });
        };
        _this._zkProps = zkProps;
        log("new:|> %O", __assign({}, _this._zkProps, dubboProp));
        //默认dubbo
        _this._zkProps.zkRoot = _this._zkProps.zkRoot || 'dubbo';
        //初始化zookeeper的client
        _this._connect(_this._init);
        return _this;
    }
    /**
     * 重连
     */
    ZkRegistry.prototype._reconnect = function () {
        clearInterval(this._checkTimer);
        if (this._client) {
            this._client.close();
        }
        this._connect(this._init);
    };
    /**
     * 由于zk自己的监测机制不明确, 改为自主检测
     */
    ZkRegistry.prototype._monitor = function () {
        var _this = this;
        clearInterval(this._checkTimer);
        this._checkTimer = setInterval(function () {
            var state = _this._client.getState();
            switch (state) {
                case node_zookeeper_client_1.State.EXPIRED:
                case node_zookeeper_client_1.State.DISCONNECTED:
                    log("checker is error, state is " + state + ", need reconnect");
                    _this._reconnect();
                    break;
                default:
                    log("checker is ok, state is " + state);
            }
        }, CHECK_TIME);
    };
    Object.defineProperty(ZkRegistry.prototype, "_allAgentAddrSet", {
        /**
         * 获取所有的负载列表，通过agentAddrMap聚合出来
         * 这样有点Reactive的感觉，不需要考虑当中增加删除的动作
         */
        get: function () {
            var agentSet = new Set();
            for (var _i = 0, _a = this._dubboServiceUrlMap.values(); _i < _a.length; _i++) {
                var urlList = _a[_i];
                for (var _b = 0, urlList_1 = urlList; _b < urlList_1.length; _b++) {
                    var url = urlList_1[_b];
                    agentSet.add(url.host + ':' + url.port);
                }
            }
            return agentSet;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取所有的provider列表
     * @param {string} dubboServicePath
     * @param dubboInterface
     * @returns {Promise<Array<string>>}
     * @private
     */
    ZkRegistry.prototype._getDubboServiceUrls = function (dubboServicePath, dubboInterface) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._getChildren(dubboServicePath, this._watchWrap(dubboServicePath, dubboInterface)).then(function (res) {
                        return (res.children || [])
                            .map(function (child) { return decodeURIComponent(child); })
                            .filter(function (child) { return child.startsWith('dubbo://'); });
                    })];
            });
        });
    };
    ZkRegistry.prototype._watchWrap = function (dubboServicePath, dubboInterface) {
        var _this = this;
        return function (e) { return __awaiter(_this, void 0, void 0, function () {
            var _a, dubboServiceUrls, err, urls;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log("trigger watch " + e);
                        return [4 /*yield*/, go_1.go(this._getDubboServiceUrls(dubboServicePath, dubboInterface))];
                    case 1:
                        _a = _b.sent(), dubboServiceUrls = _a.res, err = _a.err;
                        // when getChildren had occur error
                        if (err) {
                            log("getChildren " + dubboServicePath + " error " + err);
                            util_1.traceErr(err);
                            return [2 /*return*/];
                        }
                        urls = dubboServiceUrls.map(function (serviceUrl) {
                            return dubbo_url_1["default"].from(serviceUrl);
                        });
                        if (urls.length === 0) {
                            util_1.traceErr(new Error("trigger watch " + e + " agentList is empty"));
                            return [2 /*return*/];
                        }
                        //clear current dubbo interface
                        this._dubboServiceUrlMap.set(dubboInterface, urls);
                        if (util_1.isDevEnv) {
                            log('agentSet:|> %O', this._allAgentAddrSet);
                            log('update dubboInterface %s providerList %O', dubboInterface, this._dubboServiceUrlMap.get(dubboInterface));
                        }
                        this._subscriber.onData(this._allAgentAddrSet);
                        return [2 /*return*/];
                }
            });
        }); };
    };
    ZkRegistry.prototype._registryProviderServices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var zkRoot, services, _i, services_1, _a, dubboInterface, dubboUrl, providerRoot, err, existProviderPath, create;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        zkRoot = this._zkProps.zkRoot;
                        services = this._dubboProps.services;
                        _i = 0, services_1 = services;
                        _b.label = 1;
                    case 1:
                        if (!(_i < services_1.length)) return [3 /*break*/, 6];
                        _a = services_1[_i], dubboInterface = _a[0], dubboUrl = _a[1];
                        providerRoot = "/" + zkRoot + "/" + dubboInterface + "/providers";
                        return [4 /*yield*/, this._createDubboRootPath(providerRoot)];
                    case 2:
                        err = _b.sent();
                        if (err) {
                            log("create root provider " + providerRoot + " %o", err);
                            return [3 /*break*/, 5];
                        }
                        dubboUrl = providerRoot + "/" + dubboUrl;
                        return [4 /*yield*/, go_1.go(this._exists(dubboUrl))];
                    case 3:
                        existProviderPath = _b.sent();
                        if (existProviderPath.err) {
                            log("check " + dubboUrl + " err: %o , exists: %s", existProviderPath.err, existProviderPath.res);
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, go_1.go(this._create(dubboUrl, node_zookeeper_client_1["default"].CreateMode.EPHEMERAL))];
                    case 4:
                        create = _b.sent();
                        if (create.err) {
                            log(decodeURIComponent(dubboUrl) + " \u521B\u5EFA\u5931\u8D25 %o", create.err);
                            return [2 /*return*/];
                        }
                        log("create successfully provider url: " + decodeURIComponent(dubboUrl));
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * com.alibaba.dubbo.registry.zookeeper.ZookeeperRegistry
     */
    ZkRegistry.prototype._createConsumer = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var name, dubboInterface, dubboSetting, queryParams, consumerRoot, err, consumerUrl, exist, create;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = params.name, dubboInterface = params.dubboInterface;
                        dubboSetting = this
                            ._dubboProps.dubboSetting.getDubboSetting(dubboInterface);
                        if (!dubboSetting) {
                            throw new Error("Could not find group, version for " + dubboInterface + " please check your dubbo setting");
                        }
                        queryParams = {
                            interface: dubboInterface,
                            application: name,
                            category: 'consumers',
                            method: '',
                            revision: '',
                            version: dubboSetting.version,
                            group: dubboSetting.group,
                            side: 'consumer',
                            check: 'false'
                        };
                        consumerRoot = "/" + this._zkProps.zkRoot + "/" + dubboInterface + "/consumers";
                        return [4 /*yield*/, this._createDubboRootPath(consumerRoot)];
                    case 1:
                        err = _a.sent();
                        if (err) {
                            log('create root consumer: error %o', err);
                            return [2 /*return*/];
                        }
                        consumerUrl = consumerRoot +
                            '/' +
                            encodeURIComponent("consumer://" + ipAddress + "/" + dubboInterface + "?" + querystring_1["default"].stringify(queryParams));
                        return [4 /*yield*/, go_1.go(this._exists(consumerUrl))];
                    case 2:
                        exist = _a.sent();
                        if (exist.err) {
                            log("check consumer url: " + decodeURIComponent(consumerUrl) + " failed");
                            return [2 /*return*/];
                        }
                        if (exist.res) {
                            log("check consumer url: " + decodeURIComponent(consumerUrl) + " was existed.");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, go_1.go(this._create(consumerUrl, node_zookeeper_client_1["default"].CreateMode.EPHEMERAL))];
                    case 3:
                        create = _a.sent();
                        if (create.err) {
                            log("check consumer url: " + decodeURIComponent(consumerUrl) + "\u521B\u5EFAconsumer\u5931\u8D25 %o", create.err);
                            return [2 /*return*/];
                        }
                        log("create successfully consumer url: " + decodeURIComponent(consumerUrl));
                        return [2 /*return*/];
                }
            });
        });
    };
    ZkRegistry.prototype._createDubboRootPath = function (dir) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, res, err;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, go_1.go(this._exists(dir))];
                    case 1:
                        _a = _b.sent(), res = _a.res, err = _a.err;
                        //check error
                        if (err) {
                            return [2 /*return*/, err];
                        }
                        // current consumer root path was existed.
                        if (res) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, go_1.go(this._mkdirp(dir))];
                    case 2:
                        //create current consumer path
                        (err = (_b.sent()).err);
                        if (err) {
                            return [2 /*return*/, err];
                        }
                        log('create root path %s successfull', dir);
                        return [2 /*return*/];
                }
            });
        });
    };
    ZkRegistry.prototype._mkdirp = function (dir) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._client.mkdirp(dir, function (err, path) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(path);
            });
        });
    };
    return ZkRegistry;
}(registry_1["default"]));
exports.ZkRegistry = ZkRegistry;
function zk(props) {
    return function (dubboProps) { return new ZkRegistry(props, dubboProps); };
}
exports["default"] = zk;
