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
exports.__esModule = true;
var ZookeeperTimeoutError = /** @class */ (function (_super) {
    __extends(ZookeeperTimeoutError, _super);
    function ZookeeperTimeoutError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ZookeeperTimeoutError;
}(Error));
exports.ZookeeperTimeoutError = ZookeeperTimeoutError;
var ClientTimeoutError = /** @class */ (function (_super) {
    __extends(ClientTimeoutError, _super);
    function ClientTimeoutError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ClientTimeoutError;
}(Error));
exports.ClientTimeoutError = ClientTimeoutError;
var ZookeeperDisconnectedError = /** @class */ (function (_super) {
    __extends(ZookeeperDisconnectedError, _super);
    function ZookeeperDisconnectedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ZookeeperDisconnectedError;
}(Error));
exports.ZookeeperDisconnectedError = ZookeeperDisconnectedError;
var DubboDecodeError = /** @class */ (function (_super) {
    __extends(DubboDecodeError, _super);
    function DubboDecodeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DubboDecodeError;
}(Error));
exports.DubboDecodeError = DubboDecodeError;
var DubboServiceError = /** @class */ (function (_super) {
    __extends(DubboServiceError, _super);
    function DubboServiceError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DubboServiceError;
}(Error));
exports.DubboServiceError = DubboServiceError;
var DubboEncodeError = /** @class */ (function (_super) {
    __extends(DubboEncodeError, _super);
    function DubboEncodeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DubboEncodeError;
}(Error));
exports.DubboEncodeError = DubboEncodeError;
var DubboTimeoutError = /** @class */ (function (_super) {
    __extends(DubboTimeoutError, _super);
    function DubboTimeoutError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DubboTimeoutError;
}(Error));
exports.DubboTimeoutError = DubboTimeoutError;
var DubboMethodParamHessianTypeError = /** @class */ (function (_super) {
    __extends(DubboMethodParamHessianTypeError, _super);
    function DubboMethodParamHessianTypeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DubboMethodParamHessianTypeError;
}(Error));
exports.DubboMethodParamHessianTypeError = DubboMethodParamHessianTypeError;
var ScheduleError = /** @class */ (function (_super) {
    __extends(ScheduleError, _super);
    function ScheduleError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ScheduleError;
}(Error));
exports.ScheduleError = ScheduleError;
var SocketError = /** @class */ (function (_super) {
    __extends(SocketError, _super);
    function SocketError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SocketError;
}(Error));
exports.SocketError = SocketError;
var ZookeeperExpiredError = /** @class */ (function (_super) {
    __extends(ZookeeperExpiredError, _super);
    function ZookeeperExpiredError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ZookeeperExpiredError;
}(Error));
exports.ZookeeperExpiredError = ZookeeperExpiredError;
var FaultExitError = /** @class */ (function (_super) {
    __extends(FaultExitError, _super);
    //copy message and stack
    function FaultExitError(err) {
        var _this = _super.call(this, err.message) || this;
        _this.message = err.message;
        _this.stack = err.stack;
        _this.name = err.name;
        return _this;
    }
    return FaultExitError;
}(Error));
exports.FaultExitError = FaultExitError;
