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
// Merge pull request #27 from hsiaosiyuan0/master
// 3ks hsiaosiyuan0
exports.toBytes4 = function (num) {
    var buf = Buffer.allocUnsafe(4);
    buf.writeUInt32BE(num, 0);
    return buf;
};
exports.fromBytes4 = function (buf) {
    return buf.readUInt32BE(0);
};
exports.toBytes8 = function (num) {
    var buf = Buffer.allocUnsafe(8);
    //2 ** 32 = 4294967296
    var high = Math.floor(num / 4294967296);
    var low = (num & 0xffffffff) >>> 0;
    buf.writeUInt32BE(high, 0);
    buf.writeUInt32BE(low, 4);
    return buf;
};
exports.fromBytes8 = function (buf) {
    var high = buf.readUInt32BE(0);
    var low = buf.readUInt32BE(4);
    //Math.pow(2, 32) = 4294967296
    return high * 4294967296 + low;
};
