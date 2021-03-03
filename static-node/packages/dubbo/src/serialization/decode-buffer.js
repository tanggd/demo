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
var byte_1 = require("../common/byte");
var util_1 = require("../common/util");
var constants_1 = require("./constants");
var log = debug_1["default"]('dubbo:decode-buffer');
/**
 * 在并发的tcp数据传输中，会出现少包，粘包的现象
 * 好在tcp的传输是可以保证顺序的
 * 我们需要抽取一个buffer来统一处理这些数据
 */
var DecodeBuffer = /** @class */ (function () {
    function DecodeBuffer(transport, flag) {
        var _this = this;
        this.flag = flag;
        log('%s new DecodeBuffer', this.flag);
        this._subscriber = util_1.noop;
        this._buffer = Buffer.alloc(0);
        this._transport = transport;
        process.nextTick(function () {
            _this._transport
                .on('data', function (data) { return _this.receive(data); })
                .on('close', function () {
                _this.clearBuffer();
            });
        });
    }
    DecodeBuffer.from = function (transport, flag) {
        return new DecodeBuffer(transport, flag);
    };
    DecodeBuffer.prototype.receive = function (data) {
        //concat bytes
        this._buffer = Buffer.concat([this._buffer, data]);
        var bufferLength = this._buffer.length;
        while (bufferLength >= constants_1.DUBBO_HEADER_LENGTH) {
            //判断buffer 0, 1 是不是dubbo的magic high , magic low
            var magicHigh = this._buffer[0];
            var magicLow = this._buffer[1];
            //如果不是magichight magiclow 做个容错
            if (magicHigh != constants_1.DUBBO_MAGIC_HIGH || magicLow != constants_1.DUBBO_MAGIC_LOW) {
                log("%s receive server data error, buffer[0] is 0xda " + (magicHigh ==
                    0xda) + " buffer[1] is 0xbb " + (magicLow == 0xbb), this.flag);
                var magicHighIndex = this._buffer.indexOf(constants_1.DUBBO_MAGIC_HIGH);
                var magicLowIndex = this._buffer.indexOf(constants_1.DUBBO_MAGIC_LOW);
                log("%s magicHigh index#" + magicHighIndex, this.flag);
                log("%s magicLow index#" + magicLowIndex, this.flag);
                if (magicHighIndex === -1) {
                    // 没有找到magicHigh,则将整个buffer清空
                    this._buffer = this._buffer.slice(bufferLength);
                }
                else if (magicLowIndex === -1) {
                    if (magicHighIndex === bufferLength - 1) {
                        // 如果magicHigh是buffer最后一位，则整个buffer只保留最后一位
                        this._buffer = this._buffer.slice(magicHighIndex);
                    }
                    else {
                        // 如果magicHigh不是buffer最后一位，而且整个buffer里没有magicLow,则清空buffer
                        this._buffer = this._buffer.slice(bufferLength);
                    }
                }
                else {
                    if (magicLowIndex - magicHighIndex === 1) {
                        // magicHigh和magicLow在buffer中间相邻位置，则buffer移动到magicHigh的位置
                        this._buffer = this._buffer.slice(magicHighIndex);
                    }
                    else {
                        // magicHigh和magicLow不相邻，则buffer移动到magicHigh的下一个位置
                        this._buffer = this._buffer.slice(magicHighIndex + 1);
                    }
                }
                bufferLength = this._buffer.length;
                if (bufferLength < constants_1.DUBBO_HEADER_LENGTH) {
                    return;
                }
            }
            else {
                //数据量还不够头部的长度
                if (bufferLength < constants_1.DUBBO_HEADER_LENGTH) {
                    //waiting
                    log('%s bufferLength < header length', this.flag);
                    return;
                }
                //取出头部字节
                var header = this._buffer.slice(0, constants_1.DUBBO_HEADER_LENGTH);
                //计算body的长度字节位置[12-15]
                var bodyLengthBuff = Buffer.from([
                    header[12],
                    header[13],
                    header[14],
                    header[15],
                ]);
                var bodyLength = byte_1.fromBytes4(bodyLengthBuff);
                log('%s body length %d', this.flag, bodyLength);
                if (constants_1.DUBBO_HEADER_LENGTH + bodyLength > bufferLength) {
                    //waiting
                    log('%s header length + body length > buffer length', this.flag);
                    return;
                }
                var dataBuffer = this._buffer.slice(0, constants_1.DUBBO_HEADER_LENGTH + bodyLength);
                this._buffer = this._buffer.slice(constants_1.DUBBO_HEADER_LENGTH + bodyLength);
                bufferLength = this._buffer.length;
                this._subscriber(dataBuffer);
            }
        }
    };
    DecodeBuffer.prototype.clearBuffer = function () {
        //reduce memory alloc
        if (this._buffer.length > 0) {
            this._buffer = Buffer.alloc(0);
        }
    };
    DecodeBuffer.prototype.subscribe = function (subscriber) {
        this._subscriber = subscriber;
        return this;
    };
    return DecodeBuffer;
}());
exports["default"] = DecodeBuffer;
