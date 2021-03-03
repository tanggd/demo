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
var hessian_js_1 = require("hessian.js");
var util_1 = require("../common/util");
var constants_1 = require("./constants");
var log = debug_1["default"]('dubbo:heartbeat');
// Reference
//com.alibaba.dubbo.remoting.exchange.codec.ExchangeCodec
//encodeRequest
//心跳频率
var HEART_BEAT = 60 * 1000;
// retry heartbeat
var RETRY_HEARD_BEAT_TIME = 3;
/**
 * Heartbeat Manager
 */
var HeartBeat = /** @class */ (function () {
    function HeartBeat(props) {
        var _this = this;
        this._lastReadTimestamp = -1;
        this._lastWriteTimestamp = -1;
        // ==========================private method=====================================
        this.init = function () {
            // init read/write timestamp
            _this.setWriteTimestamp();
            _this.setReadTimestamp();
            //heartbeart
            //when network is close, the connection maybe not close, so check the heart beat times
            _this._heartBeatTimer = setInterval(function () {
                var now = Date.now();
                if (now - _this._lastReadTimestamp > HEART_BEAT * RETRY_HEARD_BEAT_TIME) {
                    _this._onTimeout();
                }
                else if (now - _this._lastWriteTimestamp > HEART_BEAT ||
                    now - _this._lastReadTimestamp > HEART_BEAT) {
                    _this.emit();
                }
            }, HEART_BEAT);
            _this._transport
                .on('data', function () {
                _this.setReadTimestamp();
            })
                .on('close', function () {
                _this.destroy();
            });
        };
        this.destroy = function () {
            clearTimeout(_this._heartBeatTimer);
            _this._transport = null;
            _this._lastReadTimestamp = -1;
            _this._lastWriteTimestamp = -1;
        };
        var transport = props.transport, onTimeout = props.onTimeout, type = props.type;
        this._type = type;
        this._transport = transport;
        this._onTimeout = onTimeout || util_1.noop;
        var who = this._type === 'request' ? 'dubbo-consumer' : 'dubbo-server';
        log('%s init heartbeat manager', who);
        // init heartbaet
        this.init();
    }
    HeartBeat.prototype.emit = function () {
        var who = this._type === 'request' ? 'dubbo-consumer' : 'dubbo-server';
        log(who + " emit heartbeat");
        this.setWriteTimestamp();
        this._transport.write(this.encode());
    };
    HeartBeat.prototype.setReadTimestamp = function () {
        this._lastReadTimestamp = Date.now();
    };
    HeartBeat.prototype.setWriteTimestamp = function () {
        this._lastWriteTimestamp = Date.now();
    };
    // ========================static method=============================
    HeartBeat.from = function (props) {
        return new HeartBeat(props);
    };
    /**
     * encode heartbeat
     */
    HeartBeat.prototype.encode = function () {
        var who = this._type === 'request' ? 'dubbo-consumer' : 'dubbo-server';
        log('%s encode heartbeat', who);
        var buffer = Buffer.alloc(constants_1.DUBBO_HEADER_LENGTH + 1);
        //magic header
        buffer[0] = constants_1.DUBBO_MAGIC_HIGH;
        buffer[1] = constants_1.DUBBO_MAGIC_LOW;
        // set request and serialization flag.
        if (this._type === 'request') {
            buffer[2] =
                constants_1.DUBBO_FLAG_REQUEST |
                    constants_1.HESSIAN2_SERIALIZATION_CONTENT_ID |
                    constants_1.DUBBO_FLAG_TWOWAY |
                    constants_1.DUBBO_FLAG_EVENT;
        }
        else if (this._type === 'response') {
            buffer[2] =
                constants_1.HESSIAN2_SERIALIZATION_CONTENT_ID |
                    constants_1.DUBBO_FLAG_TWOWAY |
                    constants_1.DUBBO_FLAG_EVENT;
        }
        //set request id
        //暂时不设置
        //set body length
        buffer[15] = 1;
        //body
        // new Hessian.EncoderV2().write(null);
        buffer[16] = 0x4e;
        return buffer;
    };
    //com.alibaba.dubbo.remoting.exchange.codec.ExchangeCodec.decodeBody
    HeartBeat.isHeartBeat = function (buf) {
        // get flag position
        var flag = buf[2];
        if ((flag & constants_1.DUBBO_FLAG_EVENT) !== 0) {
            var decoder = new hessian_js_1["default"].DecoderV2(buf.slice(constants_1.DUBBO_HEADER_LENGTH));
            var data = decoder.read();
            return data === null;
        }
        return false;
    };
    return HeartBeat;
}());
exports["default"] = HeartBeat;
