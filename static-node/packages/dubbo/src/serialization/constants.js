"use strict";
exports.__esModule = true;
// magic header.
exports.DUBBO_MAGIC_HEADER = 0xdabb;
exports.DUBBO_MAGIC_HIGH = 0xda;
exports.DUBBO_MAGIC_LOW = 0xbb;
//dubbo response header length
exports.DUBBO_HEADER_LENGTH = 16;
exports.DEFAULT_DUBBO_PROTOCOL_VERSION = '2.0.2';
exports.HESSIAN2_SERIALIZATION_ID = 2;
//com.alibaba.dubbo.common.serialize.support.hessian.Hessian2Serialization
exports.HESSIAN2_SERIALIZATION_CONTENT_ID = 2;
//max dubbo response payload length
//com.alibaba.dubbo.common.Constants.DEAULT_PAY_LOAD
exports.DUBBO_DEFAULT_PAY_LOAD = 8 * 1024 * 1024; // 8M
// message flag
exports.DUBBO_FLAG_REQUEST = 0x80;
exports.DUBBO_FLAG_TWOWAY = 0x40;
exports.DUBBO_FLAG_EVENT = 0x20;
// event
exports.DUBBO_HEART_BEAT_EVENT = null;
//com.alibaba.dubbo.remoting.exchange.Response
var DUBBO_RESPONSE_STATUS;
(function (DUBBO_RESPONSE_STATUS) {
    DUBBO_RESPONSE_STATUS[DUBBO_RESPONSE_STATUS["OK"] = 20] = "OK";
    DUBBO_RESPONSE_STATUS[DUBBO_RESPONSE_STATUS["CLIENT_TIMEOUT"] = 30] = "CLIENT_TIMEOUT";
    DUBBO_RESPONSE_STATUS[DUBBO_RESPONSE_STATUS["SERVER_TIMEOUT"] = 31] = "SERVER_TIMEOUT";
    DUBBO_RESPONSE_STATUS[DUBBO_RESPONSE_STATUS["BAD_REQUEST"] = 40] = "BAD_REQUEST";
    DUBBO_RESPONSE_STATUS[DUBBO_RESPONSE_STATUS["BAD_RESPONSE"] = 50] = "BAD_RESPONSE";
    DUBBO_RESPONSE_STATUS[DUBBO_RESPONSE_STATUS["SERVICE_NOT_FOUND"] = 60] = "SERVICE_NOT_FOUND";
    DUBBO_RESPONSE_STATUS[DUBBO_RESPONSE_STATUS["SERVICE_ERROR"] = 70] = "SERVICE_ERROR";
    DUBBO_RESPONSE_STATUS[DUBBO_RESPONSE_STATUS["SERVER_ERROR"] = 80] = "SERVER_ERROR";
    DUBBO_RESPONSE_STATUS[DUBBO_RESPONSE_STATUS["CLIENT_ERROR"] = 90] = "CLIENT_ERROR";
})(DUBBO_RESPONSE_STATUS = exports.DUBBO_RESPONSE_STATUS || (exports.DUBBO_RESPONSE_STATUS = {}));
//body response status
var DUBBO_RESPONSE_BODY_FLAG;
(function (DUBBO_RESPONSE_BODY_FLAG) {
    DUBBO_RESPONSE_BODY_FLAG[DUBBO_RESPONSE_BODY_FLAG["RESPONSE_WITH_EXCEPTION"] = 0] = "RESPONSE_WITH_EXCEPTION";
    DUBBO_RESPONSE_BODY_FLAG[DUBBO_RESPONSE_BODY_FLAG["RESPONSE_VALUE"] = 1] = "RESPONSE_VALUE";
    DUBBO_RESPONSE_BODY_FLAG[DUBBO_RESPONSE_BODY_FLAG["RESPONSE_NULL_VALUE"] = 2] = "RESPONSE_NULL_VALUE";
    //@since dubbo2.6.3
    DUBBO_RESPONSE_BODY_FLAG[DUBBO_RESPONSE_BODY_FLAG["RESPONSE_WITH_EXCEPTION_WITH_ATTACHMENTS"] = 3] = "RESPONSE_WITH_EXCEPTION_WITH_ATTACHMENTS";
    DUBBO_RESPONSE_BODY_FLAG[DUBBO_RESPONSE_BODY_FLAG["RESPONSE_VALUE_WITH_ATTACHMENTS"] = 4] = "RESPONSE_VALUE_WITH_ATTACHMENTS";
    DUBBO_RESPONSE_BODY_FLAG[DUBBO_RESPONSE_BODY_FLAG["RESPONSE_NULL_VALUE_WITH_ATTACHMENTS"] = 5] = "RESPONSE_NULL_VALUE_WITH_ATTACHMENTS";
})(DUBBO_RESPONSE_BODY_FLAG = exports.DUBBO_RESPONSE_BODY_FLAG || (exports.DUBBO_RESPONSE_BODY_FLAG = {}));
