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
var type_1 = require("./type");
var log = debug_1["default"]('dubbo:dubbo-setting');
/**
 * Matcher
 * 多么想要一个ReasonML的match-pattern 😆
 */
var Setting = /** @class */ (function () {
    function Setting() {
        this._rules = new Map()
            .set('Array', new Array())
            .set('RegExp', new Array())
            .set('TPredictFunction', new Array());
        this._cache = new Map();
    }
    /**
     * 匹配规则
     * 规则的有限级别 string[] > fn > regexp
     * @param arg
     * @param dubboSetting
     */
    Setting.prototype.match = function (arg, dubboSetting) {
        //build rule
        var rule = {
            condition: arg,
            dubboSetting: dubboSetting
        };
        log('add match rule %j', rule);
        if (type_1.isString(arg)) {
            rule.condition = [arg];
            this._rules.get('Array').push(rule);
        }
        else if (type_1.isArray(arg)) {
            this._rules.get('Array').push(rule);
        }
        else if (type_1.isFn(arg)) {
            this._rules.get('TPredictFunction').push(rule);
        }
        else if (type_1.isRegExp(arg)) {
            this._rules.get('RegExp').push(rule);
        }
        return this;
    };
    Setting.prototype.getDubboSetting = function (dubboInterface) {
        //get from cache
        if (this._cache.has(dubboInterface)) {
            return this._cache.get(dubboInterface);
        }
        var matchedRule = null;
        if (!matchedRule) {
            for (var _i = 0, _a = this._rules.get('Array'); _i < _a.length; _i++) {
                var rule = _a[_i];
                if (type_1.isArray(rule.condition) &&
                    rule.condition.indexOf(dubboInterface) !== -1) {
                    matchedRule = rule;
                    break;
                }
            }
        }
        if (!matchedRule) {
            for (var _b = 0, _c = this._rules.get('TPredictFunction'); _b < _c.length; _b++) {
                var rule = _c[_b];
                if (type_1.isFn(rule.condition) && rule.condition(dubboInterface)) {
                    rule.dubboSetting = rule.condition(dubboInterface);
                    matchedRule = rule;
                    break;
                }
            }
        }
        if (!matchedRule) {
            for (var _d = 0, _e = this._rules.get('RegExp'); _d < _e.length; _d++) {
                var rule = _e[_d];
                if (type_1.isRegExp(rule.condition) && rule.condition.test(dubboInterface)) {
                    matchedRule = rule;
                    break;
                }
            }
        }
        if (matchedRule) {
            log('%s =match=> rule %s result=> %j', dubboInterface, matchedRule.condition, matchedRule.dubboSetting);
            this._cache.set(dubboInterface, matchedRule.dubboSetting);
            return matchedRule.dubboSetting;
        }
        log('oops, %s can not find any match rule', dubboInterface);
        return null;
    };
    return Setting;
}());
exports.Setting = Setting;
exports["default"] = new Setting();
