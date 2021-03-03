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
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
exports.__esModule = true;
var debug_1 = require("debug");
var hessian_js_1 = require("hessian.js");
var byte_1 = require("../common/byte");
var err_1 = require("../common/err");
var constants_1 = require("./constants");
var request_1 = require("./request");
function decodeDubboRequest(buff) {
    var log = debug_1["default"]('dubbo:decodeDubboRequest');
    var flag = buff[2];
    // get requestId
    var requestId = byte_1.fromBytes8(buff.slice(4, 12));
    log('decode requestId -> ', requestId);
    var req = new request_1["default"](requestId);
    // decode request
    if ((flag & constants_1.DUBBO_FLAG_REQUEST) !== 0) {
        req.version = constants_1.DEFAULT_DUBBO_PROTOCOL_VERSION;
        var decoder = new hessian_js_1["default"].DecoderV2(buff.slice(constants_1.DUBBO_HEADER_LENGTH));
        // decode request
        var dubboVersion = decoder.read();
        req.version = dubboVersion;
        req.attachment.dubbo = dubboVersion;
        var path = decoder.read();
        req.attachment.path = path;
        var version = decoder.read();
        req.attachment.version = version;
        var methodName = decoder.read();
        req.methodName = methodName;
        var desc = decoder.read();
        req.parameterTypeDesc = desc;
        if (desc.length > 0) {
            var paramaterTypes = desc.split(';').filter(Boolean);
            req.parameterTypes = paramaterTypes;
            var len = paramaterTypes.length;
            var args = [];
            for (var i = 0; i < len; i++) {
                args.push(decoder.read());
            }
            req.args = args;
        }
        // merge attachment
        var attachment_1 = decoder.read();
        if (attachment_1 !== null) {
            Object.keys(attachment_1).forEach(function (k) {
                req.attachment[k] = attachment_1[k];
            });
        }
    }
    return req;
}
exports.decodeDubboRequest = decodeDubboRequest;
//com.alibaba.dubbo.remoting.exchange.codec.ExchangeCodec.encodeResponse/decode
function decodeDubboResponse(bytes) {
    var log = debug_1["default"]('dubbo:decodeDubboResponse');
    var res = null;
    var err = null;
    var attachments = {};
    // set request and serialization flag.
    //字节位置[4-11] 8 bytes
    var requestIdBuff = bytes.slice(4, 12);
    var requestId = byte_1.fromBytes8(requestIdBuff);
    log("decode parse requestId: " + requestId);
    var typeId = bytes[2];
    if (typeId !== constants_1.HESSIAN2_SERIALIZATION_CONTENT_ID) {
        return {
            err: new err_1.DubboDecodeError("only support hessian serialization"),
            res: null,
            attachments: attachments,
            requestId: requestId
        };
    }
    // get response status.
    var status = bytes[3];
    log("parse response status: " + status + ", DUBBO_RESPONSE_STATUS: " + constants_1.DUBBO_RESPONSE_STATUS[constants_1.DUBBO_RESPONSE_STATUS.OK]);
    //com.alibaba.dubbo.rpc.protocol.dubbo.DecodeableRpcResult
    var body = new hessian_js_1["default"].DecoderV2(bytes.slice(constants_1.DUBBO_HEADER_LENGTH));
    if (status != constants_1.DUBBO_RESPONSE_STATUS.OK) {
        return {
            err: new err_1.DubboServiceError(body.read()),
            res: null,
            attachments: attachments,
            requestId: requestId
        };
    }
    // current status flag
    var flag = body.readInt();
    log("parse dubbo response body flag: " + flag + ", DUBBO_RESPONSE_BODY_FLAG: " + constants_1.DUBBO_RESPONSE_BODY_FLAG[flag]);
    switch (flag) {
        case constants_1.DUBBO_RESPONSE_BODY_FLAG.RESPONSE_VALUE:
            err = null;
            res = body.read();
            attachments = {};
            break;
        case constants_1.DUBBO_RESPONSE_BODY_FLAG.RESPONSE_NULL_VALUE:
            err = null;
            res = null;
            attachments = {};
            break;
        case constants_1.DUBBO_RESPONSE_BODY_FLAG.RESPONSE_WITH_EXCEPTION:
            var exception = body.read();
            err =
                exception instanceof Error
                    ? exception
                    : new err_1.DubboServiceError(exception);
            res = null;
            attachments = {};
            break;
        case constants_1.DUBBO_RESPONSE_BODY_FLAG.RESPONSE_NULL_VALUE_WITH_ATTACHMENTS:
            err = null;
            res = null;
            attachments = body.read();
            break;
        case constants_1.DUBBO_RESPONSE_BODY_FLAG.RESPONSE_VALUE_WITH_ATTACHMENTS:
            err = null;
            res = body.read();
            attachments = body.read();
            break;
        case constants_1.DUBBO_RESPONSE_BODY_FLAG.RESPONSE_WITH_EXCEPTION_WITH_ATTACHMENTS:
            var exp = body.read();
            err = exp instanceof Error ? exp : new err_1.DubboServiceError(exp);
            res = null;
            attachments = body.read();
            break;
        default:
            err = new err_1.DubboDecodeError("Unknown result flag, expect '0/1/2/3/4/5', get  " + flag + ")");
            res = null;
    }
    return { requestId: requestId, err: err, res: res, attachments: attachments };
}
exports.decodeDubboResponse = decodeDubboResponse;
