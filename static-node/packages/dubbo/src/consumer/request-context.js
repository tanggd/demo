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
exports.__esModule = true;
var debug_1 = require("debug");
var request_id_1 = require("./request-id");
var util_1 = require("../common/util");
var NO_PID = -1;
var log = debug_1["default"]('dubbo:context');
var RequestContext = /** @class */ (function () {
    function RequestContext() {
        log('new Context');
        //trace id
        this._uuid = '';
        this._pid = NO_PID;
        this._timeoutId = null;
        this._isSupportedDubbox = false;
        this._body = { err: null, res: null };
        this._application = { name: 'dubbo-js' };
        this._attachments = {};
        this._providerAttachments = {};
        this._request = {
            requestId: request_id_1.id()
        };
    }
    RequestContext.create = function () {
        return new RequestContext();
    };
    Object.defineProperty(RequestContext.prototype, "isMethodArgsHessianType", {
        get: function () {
            var methodArgs = this._request.methodArgs;
            return methodArgs.every(util_1.checkHessianParam);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "request", {
        get: function () {
            return this._request;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "body", {
        get: function () {
            return this._body;
        },
        set: function (body) {
            this._body = body;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "requestId", {
        get: function () {
            return this._request.requestId;
        },
        //=====================dubboRequest setter&&getter==========================
        set: function (requestId) {
            log('requestId#%d set requestId: %d', this._request.requestId, requestId);
            this._request.requestId = requestId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "methodName", {
        get: function () {
            return this._request.methodName;
        },
        set: function (name) {
            log('requestId#%d set methodName: %s', this._request.requestId, name);
            this._request.methodName = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "methodArgs", {
        get: function () {
            return this._request.methodArgs;
        },
        set: function (args) {
            log('requestId#%d set methodArgs: %O', this._request.requestId, args);
            this._request.methodArgs = args;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "dubboInterface", {
        get: function () {
            return this._request.dubboInterface;
        },
        set: function (inf) {
            log('requestId#%d set dubboInterface: %s', this._request.requestId, inf);
            this._request.dubboInterface = inf;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "dubboVersion", {
        get: function () {
            return this._request.dubboVersion;
        },
        set: function (version) {
            log('requestId#%d set dubboVersion: %s', this._request.requestId, version);
            this._request.dubboVersion = version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "version", {
        get: function () {
            return this._request.version;
        },
        set: function (version) {
            log('requestId#%d set version: %s', this._request.requestId, version);
            this._request.version = version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "timeout", {
        get: function () {
            return this._request.timeout;
        },
        /**
         * 设置dubbo超时时间
         */
        set: function (timeout) {
            log('requestId#%d set timeout: %d', this._request.requestId, timeout);
            this._request.timeout = timeout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "group", {
        get: function () {
            return this._request.group;
        },
        set: function (group) {
            log('requestId#%d set group: %s', this._request.requestId, group);
            this._request.group = group;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "path", {
        get: function () {
            return this._request.path;
        },
        set: function (path) {
            log('requestId#%d set path: %d', this._request.requestId, path);
            this._request.path = path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "application", {
        get: function () {
            return this._application;
        },
        //===============application setter=========================
        set: function (app) {
            log('requestId#%d set application: %O', this._request.requestId, app);
            this._application.name = app.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "resolve", {
        //===============resolve && reject=============================
        get: function () {
            return this._resolve;
        },
        set: function (resolve) {
            log('requestId#%d set resolve: %O', this._request.requestId, resolve);
            this._resolve = resolve;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "reject", {
        get: function () {
            return this._reject;
        },
        set: function (reject) {
            log('requestId#%d set reject: %O', this._request.requestId, reject);
            this._reject = reject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "invokeHost", {
        get: function () {
            return this._invokeHost;
        },
        //=====================host port setter&&getter============
        set: function (host) {
            log('requestId#%d set reject: %s', this._request.requestId, host);
            this._invokeHost = host;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "invokePort", {
        get: function () {
            return this._invokePort;
        },
        set: function (port) {
            log('requestId#%d set invokePort: %d', this._request.requestId, port);
            this._invokePort = port;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "timeoutId", {
        //===========timeout setter&&getter=================
        set: function (timeId) {
            log('requestId#%d set timeoutId', this._request.requestId);
            this._timeoutId = timeId;
        },
        enumerable: true,
        configurable: true
    });
    RequestContext.prototype.cleanTimeout = function () {
        clearTimeout(this._timeoutId);
    };
    Object.defineProperty(RequestContext.prototype, "uuid", {
        get: function () {
            return this._uuid;
        },
        //============uuid setter&&getter==============
        set: function (uuid) {
            this._uuid = uuid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "pid", {
        get: function () {
            return this._pid;
        },
        //==============pid======================
        set: function (pid) {
            log('requestId#%d set pid: %d', this._request.requestId, pid);
            this._pid = pid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "isNotScheduled", {
        /**
         * 当前上下文是不是么有被处理被调度
         */
        get: function () {
            return this._pid === NO_PID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "isSupportedDubbox", {
        get: function () {
            return this._isSupportedDubbox;
        },
        //======================isSupportedDubbox================
        set: function (isSupportedDubbox) {
            this._isSupportedDubbox = isSupportedDubbox;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "attachments", {
        /**
         * 获取当前的attachments
         */
        get: function () {
            return this._attachments;
        },
        //=====================attachments=======================
        /**
         * 设置当前的attachments
         * @param key
         * @param value
         */
        set: function (param) {
            log('set attachments->%o', param);
            //auto merge
            this._attachments = __assign({}, this._attachments, param);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestContext.prototype, "providerAttachments", {
        /**
         * 设置provider传递过来的attachments
         * @since dubbo2.6.3
         */
        get: function () {
            return this._providerAttachments;
        },
        /**
         * 设置provider传递过来的attachments
         * @since dubbo2.6.3
         */
        set: function (param) {
            log('set provider attachments->%o', param);
            this._providerAttachments = param;
        },
        enumerable: true,
        configurable: true
    });
    return RequestContext;
}());
exports["default"] = RequestContext;
