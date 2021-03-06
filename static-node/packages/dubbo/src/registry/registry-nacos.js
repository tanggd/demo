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
var util_1 = require("../common/util");
var registry_1 = require("./registry");
var NacosNamingClient = require('nacos').NacosNamingClient;
// nacos debug
var log = debug_1["default"]('dubbo:nacos');
var Nacos = /** @class */ (function (_super) {
    __extends(Nacos, _super);
    function Nacos(nacosProps, dubboProps) {
        var _this = _super.call(this, dubboProps) || this;
        // nacos connect
        _this._connect = function (callback) { return __awaiter(_this, void 0, void 0, function () {
            var register, u;
            return __generator(this, function (_a) {
                register = this._nacosProps.url;
                u = register.split('nacos://')[1];
                log("connecting nacosserver " + u);
                this._client = new NacosNamingClient({
                    logger: console,
                    serverList: u,
                    namespace: 'public'
                });
                this._client.ready();
                callback(null);
                return [2 /*return*/];
            });
        }); };
        _this._init = function (err) { return __awaiter(_this, void 0, void 0, function () {
            var _a, interfaces, dubboSetting, _i, interfaces_1, item, obj, inf, dubboServiceUrls, _b, dubboServiceUrls_1, _c, ip, port, metadata;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // nacos occur error
                        if (err) {
                            log(err);
                            util_1.traceErr(err);
                            this._subscriber.onError(err);
                            return [2 /*return*/];
                        }
                        // if current nacos call from dubbo provider, registry provider service to nacos
                        if (this._dubboProps.type === 'provider') {
                            log("this._dubboProps.type=" + this._dubboProps.type);
                            return [2 /*return*/];
                        }
                        _a = this._dubboProps, interfaces = _a.interfaces, dubboSetting = _a.dubboSetting;
                        log("this._dubboProps=" + this._dubboProps);
                        _i = 0, interfaces_1 = interfaces;
                        _d.label = 1;
                    case 1:
                        if (!(_i < interfaces_1.length)) return [3 /*break*/, 5];
                        item = interfaces_1[_i];
                        return [4 /*yield*/, dubboSetting.getDubboSetting(item)];
                    case 2:
                        obj = _d.sent();
                        inf = 'providers:' + item + ':' + obj.version + ':';
                        return [4 /*yield*/, this._client.getAllInstances(inf)];
                    case 3:
                        dubboServiceUrls = _d.sent();
                        // set dubbo interface meta info
                        for (_b = 0, dubboServiceUrls_1 = dubboServiceUrls; _b < dubboServiceUrls_1.length; _b++) {
                            _c = dubboServiceUrls_1[_b], ip = _c.ip, port = _c.port, metadata = _c.metadata;
                            this._dubboServiceUrlMap.set(metadata.path, __assign({}, metadata, { ip: ip, port: port }));
                        }
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        log("this._dubboServiceUrlMap=" + this._dubboServiceUrlMap);
                        this._subscriber.onData(this._allAgentAddrSet);
                        return [2 /*return*/];
                }
            });
        }); };
        _this._nacosProps = nacosProps;
        log("new:|> %O", __assign({}, _this._nacosProps, dubboProps));
        _this._nacosProps.nacosRoot = _this._nacosProps.nacosRoot || 'dubbo';
        // init nacos client
        _this._connect(_this._init);
        return _this;
    }
    Object.defineProperty(Nacos.prototype, "_allAgentAddrSet", {
        /**
         * 获取所有的负载列表，通过 agentAddrMap 聚合出来
         */
        get: function () {
            var agentSet = new Set();
            for (var _i = 0, _a = this._dubboServiceUrlMap.values(); _i < _a.length; _i++) {
                var metaData = _a[_i];
                agentSet.add(metaData.ip + ':' + metaData.port);
            }
            return agentSet;
        },
        enumerable: true,
        configurable: true
    });
    return Nacos;
}(registry_1["default"]));
exports.Nacos = Nacos;
function nacos(props) {
    return function (dubboProps) { return new Nacos(props, dubboProps); };
}
exports["default"] = nacos;
