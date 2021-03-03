"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["OK"] = 20] = "OK";
    ResponseStatus[ResponseStatus["BAD_REQUEST"] = 40] = "BAD_REQUEST";
    ResponseStatus[ResponseStatus["BAD_RESPONSE"] = 50] = "BAD_RESPONSE";
    ResponseStatus[ResponseStatus["SERVICE_NOT_FOUND"] = 60] = "SERVICE_NOT_FOUND";
    ResponseStatus[ResponseStatus["SERVER_ERROR"] = 80] = "SERVER_ERROR";
})(ResponseStatus = exports.ResponseStatus || (exports.ResponseStatus = {}));
var ResponseContext = /** @class */ (function () {
    function ResponseContext(req) {
        this._req = req;
        this._attachments = {};
        this._body = { res: null, err: null };
    }
    Object.defineProperty(ResponseContext.prototype, "request", {
        get: function () {
            return this._req;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContext.prototype, "body", {
        get: function () {
            return this._body;
        },
        set: function (body) {
            this._body = body;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContext.prototype, "attachments", {
        get: function () {
            return this._attachments;
        },
        set: function (val) {
            this._attachments = __assign({}, this._attachments, val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContext.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (code) {
            this._status = code;
        },
        enumerable: true,
        configurable: true
    });
    return ResponseContext;
}());
exports["default"] = ResponseContext;
