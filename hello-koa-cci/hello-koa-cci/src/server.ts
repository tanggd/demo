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

import Koa from 'koa';
import Router from 'koa-router';
import dubbo from './dubbo/consumer/dubbo';

const app = new Koa();
const router = new Router();

// ~~~~~~~~~~~~~~~~~~ router ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get('/', ctx => {
  ctx.body = 'hello, dubbo.js';
});

router.get('/hello', async ctx => {
  // console.log('server.ts第31行::: dubbo.service.demoProvider.assdddd==========================',ctx, dubbo.service.demoProvider.test('test'));
  // debugger
  // let a = await dubbo.service.demoProvider.test('test');
  // console.log('server.ts第33行:::aaaaaaaaaaaaaaaaaaa', a);
  const {res, err} = await dubbo.service.demoProvider.test('test');
  ctx.body = err ? err.message : res;
});

// use route
app.use(router.routes()).use(router.allowedMethods());

// listen server
app.listen(4000);
