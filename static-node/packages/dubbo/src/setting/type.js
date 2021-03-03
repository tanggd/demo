"use strict";
exports.__esModule = true;
var toString = Object.prototype.toString;
exports.type = function (arg) {
    return toString.call(arg);
};
exports.isArray = function (arg) {
    return exports.type(arg) === '[object Array]';
};
exports.isString = function (arg) {
    return exports.type(arg) === '[object String]';
};
exports.isRegExp = function (arg) {
    return exports.type(arg) === '[object RegExp]';
};
exports.isFn = function (arg) {
    return exports.type(arg) === '[object Function]';
};
