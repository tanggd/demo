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
var net_1 = require("net");
var debug_1 = require("debug");
var util_1 = require("../common/util");
var decode_buffer_1 = require("../serialization/decode-buffer");
var decode_hessian2_1 = require("../serialization/decode-hessian2");
var encode_hessian2_1 = require("../serialization/encode-hessian2");
var heartbeat_1 = require("../serialization/heartbeat");
var statistics_1 = require("./statistics");
var pid = 0;
var RETRY_NUM = 20;
var RETRY_TIME = 3000;
var log = debug_1["default"]('dubbo:socket-worker');
/**
 * 具体处理tcp底层通信的模块
 * 1 负责socket的创建和通信
 * 2.负责dubbo的序列化和反序列化
 * 3.socket断开自动重试
 */
var SocketWorker = /** @class */ (function () {
    function SocketWorker(host, port) {
        var _this = this;
        this._onConnected = function () {
            log("socket-worker#" + _this.pid + " <=connected=> " + _this.host + ":" + _this.port);
            //set current status
            _this._status = "CONNECTED" /* CONNECTED */;
            //reset retry number
            _this._retry = RETRY_NUM;
            _this._heartBeat = heartbeat_1["default"].from({
                type: 'request',
                transport: _this._socket,
                onTimeout: function () { return _this._onClose(false); }
            });
            //notifiy subscriber, the socketworker was connected successfully
            _this._subscriber.onConnect({
                pid: _this.pid,
                host: _this.host,
                port: _this.port
            });
        };
        this._onError = function (error) {
            log("socket-worker#" + _this.pid + " <=occur error=> " + _this.host + ":" + _this.port + " " + error);
        };
        this._onClose = function (hadError) {
            log("socket-worker#" + _this.pid + " <=closed=> " + _this.host + ":" + _this.port + " hasError: " + hadError + " retry: " + _this._retry);
            if (_this._retry > 0) {
                //set current status
                _this._status = "RETRY" /* RETRY */;
                //retry when delay RETRY_TIME
                clearTimeout(_this._retryTimeoutId);
                _this._retryTimeoutId = setTimeout(function () {
                    _this._retry--;
                    _this._initSocket();
                }, RETRY_TIME);
            }
            else {
                _this._status = "CLOSED" /* CLOSED */;
                _this._socket.destroy();
                //set state closed and notified socket-pool
                _this._subscriber.onClose({
                    pid: _this.pid,
                    host: _this.host,
                    port: _this.port
                });
            }
        };
        this.pid = ++pid;
        //statistics info
        statistics_1["default"]['pid#' + this.pid] = 0;
        this.host = host;
        this.port = port;
        this._retry = RETRY_NUM;
        this._status = "PADDING" /* PADDING */;
        log('new socket-worker#%d|> %s %s', pid, host + ':' + port, this._status);
        //init subscriber
        this._subscriber = {
            onConnect: util_1.noop,
            onData: util_1.noop,
            onClose: util_1.noop
        };
        //init socket
        this._initSocket();
    }
    //==================================public method==========================
    /**
     * static factory method
     * @param url(host:port)
     */
    SocketWorker.from = function (url) {
        var _a = url.split(':'), host = _a[0], port = _a[1];
        return new SocketWorker(host, Number(port));
    };
    /**
     * send data to dubbo service
     * @param ctx dubbo context
     */
    SocketWorker.prototype.write = function (ctx) {
        log("socket-worker#" + this.pid + " =invoked=> " + ctx.requestId);
        statistics_1["default"]['pid#' + this.pid] = ++statistics_1["default"]['pid#' + this.pid];
        // update heartbeat lastWriteTimestamp
        this._heartBeat.setWriteTimestamp();
        //current dubbo context record the pid
        //when current worker close, fail dubbo request
        ctx.pid = this.pid;
        var encoder = new encode_hessian2_1.DubboRequestEncoder(ctx);
        this._socket.write(encoder.encode());
    };
    Object.defineProperty(SocketWorker.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SocketWorker.prototype, "isAvaliable", {
        /**
         * current status is whether avaliable or not
         */
        get: function () {
            return this._status === "CONNECTED" /* CONNECTED */;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SocketWorker.prototype, "isRetry", {
        /**
         * current status whether retry or not
         */
        get: function () {
            return this._status === "RETRY" /* RETRY */;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * reset retry number
     */
    SocketWorker.prototype.resetRetry = function () {
        this._retry = RETRY_NUM;
        if (this._status === "CLOSED" /* CLOSED */) {
            this._initSocket();
        }
    };
    /**
     * subscribe the socket worker events
     * @param subscriber
     */
    SocketWorker.prototype.subscribe = function (subscriber) {
        this._subscriber = subscriber;
        return this;
    };
    //==========================private method================================
    SocketWorker.prototype._initSocket = function () {
        var _this = this;
        log("socket-worker#" + this.pid + " =connecting=> " + this.host + ":" + this.port);
        if (this._socket) {
            this._socket.destroy();
        }
        // init socket
        this._socket = new net_1["default"].Socket();
        this._socket.setNoDelay();
        this._socket
            .connect(this.port, this.host, this._onConnected)
            .on('data', function () {
            log("socket-worker#" + _this.pid + "  =receive data=> " + _this.host + ":" + _this.port);
        })
            .on('error', this._onError)
            .on('close', this._onClose);
        // init decode
        decode_buffer_1["default"].from(this._socket, "socket-worker#" + this.pid).subscribe(function (data) {
            if (heartbeat_1["default"].isHeartBeat(data)) {
                log("socket-worker#" + _this.pid + " <=receive= heartbeat data.");
            }
            else {
                var json = decode_hessian2_1.decodeDubboResponse(data);
                log("socket-worker#" + _this.pid + " <=received=> dubbo result %O", json);
                _this._subscriber.onData(json);
            }
        });
    };
    return SocketWorker;
}());
exports["default"] = SocketWorker;
