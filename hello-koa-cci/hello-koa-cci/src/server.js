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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const dubbo_1 = __importDefault(require("./dubbo/consumer/dubbo"));
const app = new koa_1.default();
const router = new koa_router_1.default();
// ~~~~~~~~~~~~~~~~~~ router ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get('/', ctx => {
    ctx.body = 'hello, dubbo.js';
});
router.get('/hello', async (ctx) => {
    console.log('server.ts第31行::: dubbo.service.demoProvider.test==========================', ctx, dubbo_1.default.service.demoProvider.test('test'));
    let a = await dubbo_1.default.service.demoProvider.test('test');
    console.log('server.ts第33行:::aaaaaaaaaaaaaaaaaaa', a);
    const { res, err } = await dubbo_1.default.service.demoProvider.test('test');
    ctx.body = err ? err.message : res;
});
// use route
app.use(router.routes()).use(router.allowedMethods());
// listen server
app.listen(4000);
//# sourceMappingURL=server.js.map