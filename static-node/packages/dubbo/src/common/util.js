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
var events_1 = require("events");
var ip_1 = require("ip");
var pid = process.pid;
var ipAddr = ip_1.address();
exports.msg = new events_1.EventEmitter();
exports.noop = function () { };
exports.isDevEnv = process.env.NODE_ENV !== 'production';
/**
 * check param is hessian type
 * @param param
 */
function checkHessianParam(param) {
    return (typeof param === 'object' &&
        typeof param['$class'] !== 'undefined' &&
        typeof param['$'] !== 'undefined');
}
exports.checkHessianParam = checkHessianParam;
/**
 * trace log
 * @param info
 */
exports.trace = function (obj) {
    setImmediate(function () {
        exports.msg.emit('sys:trace', __assign({
            time: new Date().toISOString(),
            pid: pid,
            host: ipAddr
        }, obj));
    });
};
exports.traceInfo = function (info) {
    exports.trace({ type: 'INFO', msg: info });
};
exports.traceErr = function (err) {
    exports.trace({ type: 'ERR', msg: err });
};
exports.eqSet = function (as, bs) {
    //equal size?
    if (as.size !== bs.size) {
        return false;
    }
    //different element
    for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
        var a = as_1[_i];
        if (!bs.has(a)) {
            return false;
        }
    }
    //same
    return true;
};
exports.delay = function (timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
};
/**
 * Dubbo Version
 */
var Version = /** @class */ (function () {
    function Version() {
    }
    Version.isSupportResponseAttachment = function (version) {
        if (!version) {
            return false;
        }
        var v = Version.getIntVersion(version);
        if (v >= Version.LOWEST_VERSION_FOR_RESPONSE_ATTACHMENT &&
            v <= Version.HIGHEST_PROTOCOL_VERSION) {
            return true;
        }
        return false;
    };
    Version.getIntVersion = function (version) {
        var v = Version.version2Int.get(version);
        if (!v) {
            try {
                v = Version.parseInt(version);
                if (version.split('.').length == 3) {
                    v = v * 100;
                }
            }
            catch (err) {
                console.error('Please make sure your version value has the right format: ' +
                    '\n 1. only contains digital number: 2.0.0; \n 2. with string suffix: 2.6.7-stable. ' +
                    '\nIf you are using Dubbo before v2.6.2, the version value is the same with the jar version.');
                v = this.LEGACY_DUBBO_PROTOCOL_VERSION;
            }
            this.version2Int.set(version, v);
        }
        return v;
    };
    Version.parseInt = function (version) {
        var v = 0;
        var vArr = version.split('.');
        var len = vArr.length;
        for (var i = 0; i < len; i++) {
            var subv = Version.getPrefixDigits(vArr[i]);
            if (subv) {
                v += parseInt(subv) * Math.pow(10, (len - i - 1) * 2);
            }
        }
        return v;
    };
    Version.getPrefixDigits = function (v) {
        var match = v.match(/^([0-9]*).*/);
        return match ? match[1] : '';
    };
    Version.version2Int = new Map();
    Version.LEGACY_DUBBO_PROTOCOL_VERSION = 10000;
    Version.LOWEST_VERSION_FOR_RESPONSE_ATTACHMENT = 2000200; // 2.0.2
    Version.HIGHEST_PROTOCOL_VERSION = 2009900; // 2.0.99
    return Version;
}());
exports.Version = Version;
