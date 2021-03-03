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
var hessian_js_1 = require("hessian.js");
var byte_1 = require("../common/byte");
var err_1 = require("../common/err");
var util_1 = require("../common/util");
var constants_1 = require("./constants");
var response_context_1 = require("../server/response-context");
var log = debug_1["default"]('dubbo:hessian:encoderV2');
var checkPayload = function (payload) {
    //check body length
    if (payload > 0 && payload > constants_1.DUBBO_DEFAULT_PAY_LOAD) {
        throw new err_1.DubboEncodeError("Data length too large: " + payload + ", max payload: " + constants_1.DUBBO_DEFAULT_PAY_LOAD);
    }
};
//dubbo hessian serialization
//com.alibaba.dubbo.remoting.exchange.codec.ExchangeCodec
//encodeRequest
var DubboRequestEncoder = /** @class */ (function () {
    function DubboRequestEncoder(ctx) {
        this._ctx = ctx;
        if (util_1.isDevEnv) {
            log('dubbo encode param request:%s', JSON.stringify(this._ctx.request, null, 2));
        }
    }
    DubboRequestEncoder.prototype.encode = function () {
        var body = this.encodeBody();
        var head = this.encodeHead(body.length);
        log("encode body length: " + body.length + " bytes");
        return Buffer.concat([head, body]);
    };
    /**
     * 根据协议，消息中写入16个字节的消息头：
     * 1-2字节，固定的魔数
     * 第3个字节，第7位存储数据类型是请求数据还是响应数据，其它8位存储序列化类型，约定和服务端的序列化-反序列化协议
     * 5-12个字节，请求id
     * 13-16个字节，请求数据长度
     *
     * @param payload body的长度
     */
    DubboRequestEncoder.prototype.encodeHead = function (payload) {
        //header
        var header = Buffer.alloc(constants_1.DUBBO_HEADER_LENGTH);
        //set magic number
        //magic high
        header[0] = constants_1.DUBBO_MAGIC_HEADER >>> 8;
        //magic low
        header[1] = constants_1.DUBBO_MAGIC_HEADER & 0xff;
        // set request and serialization flag.
        header[2] =
            constants_1.DUBBO_FLAG_REQUEST |
                constants_1.HESSIAN2_SERIALIZATION_CONTENT_ID |
                constants_1.DUBBO_FLAG_TWOWAY;
        //requestId
        this.setRequestId(header);
        //body长度int-> 4个byte
        header.writeUInt32BE(payload, 12);
        return header;
    };
    DubboRequestEncoder.prototype.setRequestId = function (header) {
        var requestId = this._ctx.requestId;
        log("encode header requestId: " + requestId);
        var buffer = byte_1.toBytes8(requestId);
        header[4] = buffer[0];
        header[5] = buffer[1];
        header[6] = buffer[2];
        header[7] = buffer[3];
        header[8] = buffer[4];
        header[9] = buffer[5];
        header[10] = buffer[6];
        header[11] = buffer[7];
    };
    DubboRequestEncoder.prototype.encodeBody = function () {
        //hessian v2
        var encoder = new hessian_js_1["default"].EncoderV2();
        var _a = this._ctx, dubboVersion = _a.dubboVersion, dubboInterface = _a.dubboInterface, version = _a.version, methodName = _a.methodName, methodArgs = _a.methodArgs;
        //dubbo version
        encoder.write(dubboVersion);
        //path interface
        encoder.write(dubboInterface);
        //interface version
        encoder.write(version);
        //method name
        encoder.write(methodName);
        //supported dubbox
        if (this._ctx.isSupportedDubbox) {
            encoder.write(-1);
        }
        //parameter types
        encoder.write(DubboRequestEncoder.getParameterTypes(methodArgs));
        //arguments
        if (methodArgs && methodArgs.length) {
            for (var _i = 0, methodArgs_1 = methodArgs; _i < methodArgs_1.length; _i++) {
                var arg = methodArgs_1[_i];
                encoder.write(arg);
            }
        }
        //attachments
        encoder.write(this.getAttachments());
        // check payload lenght
        checkPayload(encoder.byteBuffer._offset);
        return encoder.byteBuffer._bytes.slice(0, encoder.byteBuffer._offset);
    };
    DubboRequestEncoder.getParameterTypes = function (args) {
        if (!(args && args.length)) {
            return '';
        }
        var primitiveTypeRef = {
            "void": 'V',
            boolean: 'Z',
            byte: 'B',
            char: 'C',
            double: 'D',
            float: 'F',
            int: 'I',
            long: 'J',
            short: 'S'
        };
        var desc = [];
        for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
            var arg = args_1[_i];
            var type = arg['$class'];
            //暂时不支持二维数组
            //如果将来支持，这个地方要while判断下
            if (type[0] === '[') {
                //1. c is array
                desc.push('[');
                type = type.slice(1);
            }
            if (primitiveTypeRef[type]) {
                //2. c is primitive
                desc.push(primitiveTypeRef[type]);
            }
            else {
                //3. c is object
                desc.push('L');
                desc.push(type.replace(/\./gi, '/'));
                desc.push(';');
            }
        }
        return desc.join('');
    };
    DubboRequestEncoder.prototype.getAttachments = function () {
        var _a = this._ctx, requestId = _a.requestId, path = _a.path, dubboInterface = _a.dubboInterface, group = _a.group, timeout = _a.timeout, version = _a.version, name = _a.application.name, attachments = _a.attachments;
        //merge dubbo attachments and customize attachments
        var map = __assign({
            path: path,
            interface: dubboInterface,
            version: version || '0.0.0'
        }, attachments);
        group && (map['group'] = group);
        timeout && (map['timeout'] = timeout);
        name && (map['application'] = name);
        var attachmentsHashMap = {
            $class: 'java.util.HashMap',
            $: map
        };
        if (util_1.isDevEnv) {
            log('request#%d attachment %s', requestId, JSON.stringify(attachmentsHashMap, null, 2));
        }
        return attachmentsHashMap;
    };
    return DubboRequestEncoder;
}());
exports.DubboRequestEncoder = DubboRequestEncoder;
// src/main/java/org/apache/dubbo/remoting/exchange/support/header/HeaderExchangeHandler.java
//com.alibaba.dubbo.remoting.exchange.codec.ExchangeCodec
//encodeRequest
var DubboResponseEncoder = /** @class */ (function () {
    function DubboResponseEncoder(ctx) {
        this._ctx = ctx;
    }
    DubboResponseEncoder.prototype.encode = function () {
        var body = this.encodeBody();
        var head = this.encodeHead(body.length);
        return Buffer.concat([head, body]);
    };
    DubboResponseEncoder.prototype.encodeHead = function (payload) {
        var header = Buffer.alloc(constants_1.DUBBO_HEADER_LENGTH);
        // set magic number
        header[0] = constants_1.DUBBO_MAGIC_HIGH;
        header[1] = constants_1.DUBBO_MAGIC_LOW;
        // set request and serialization flag.
        header[2] = constants_1.HESSIAN2_SERIALIZATION_ID;
        // set response status
        header[3] = this._ctx.status;
        //set requestId
        var reqIdBuf = byte_1.toBytes8(this._ctx.request.requestId);
        header[4] = reqIdBuf[0];
        header[5] = reqIdBuf[1];
        header[6] = reqIdBuf[2];
        header[7] = reqIdBuf[3];
        header[8] = reqIdBuf[4];
        header[9] = reqIdBuf[5];
        header[10] = reqIdBuf[6];
        header[11] = reqIdBuf[7];
        header.writeUInt32BE(payload, 12);
        return header;
    };
    DubboResponseEncoder.prototype.encodeBody = function () {
        var encoder = new hessian_js_1["default"].EncoderV2();
        // response error
        if (this._ctx.status === response_context_1.ResponseStatus.OK) {
            var isSupportAttachment = util_1.Version.isSupportResponseAttachment(this._ctx.request.version);
            if (this._ctx.body.err) {
                encoder.write(isSupportAttachment
                    ? constants_1.DUBBO_RESPONSE_BODY_FLAG.RESPONSE_WITH_EXCEPTION_WITH_ATTACHMENTS
                    : constants_1.DUBBO_RESPONSE_BODY_FLAG.RESPONSE_WITH_EXCEPTION);
                encoder.write(this._ctx.body.err.message);
            }
            else {
                if (this._ctx.body.res === null) {
                    encoder.write(isSupportAttachment
                        ? constants_1.DUBBO_RESPONSE_BODY_FLAG.RESPONSE_NULL_VALUE_WITH_ATTACHMENTS
                        : constants_1.DUBBO_RESPONSE_BODY_FLAG.RESPONSE_NULL_VALUE);
                }
                else {
                    encoder.write(isSupportAttachment
                        ? constants_1.DUBBO_RESPONSE_BODY_FLAG.RESPONSE_VALUE_WITH_ATTACHMENTS
                        : constants_1.DUBBO_RESPONSE_BODY_FLAG.RESPONSE_VALUE);
                    encoder.write(this._ctx.body.res);
                }
            }
            if (isSupportAttachment) {
                var attachments = this._ctx.attachments;
                attachments['dubbo'] = '2.0.2';
                encoder.write(attachments);
            }
        }
        else {
            encoder.write(this._ctx.body.err.message);
        }
        // check payload length
        checkPayload(encoder.byteBuffer._offset);
        // encode
        return encoder.byteBuffer._bytes.slice(0, encoder.byteBuffer._offset);
    };
    return DubboResponseEncoder;
}());
exports.DubboResponseEncoder = DubboResponseEncoder;
