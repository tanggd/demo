const Koa = require("koa");
const path = require("path");
const static = require("koa-static");
// const Router = require("koa-router");
const c2k = require("koa-connect");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = new Koa();
const staticPath = "./public";

app.use(static(path.join(__dirname, staticPath)));

// 转发统一网关
app.use(async (ctx, next) => {
  console.log(ctx.path);
  const path = ctx.path;
  if (path.startsWith("/serviceApi")) {
    await c2k(
      createProxyMiddleware({
        target: "http://10.10.77.93:8008/",
        changeOrigin: false,
        ws: true,
        pathRewrite: {
          "^/serviceApi": "",
        },
      })
    )(ctx, next)
  }
  if (path.startsWith("/api")) {
    console.log(123)
    await c2k(
      createProxyMiddleware({
        target: "http://10.2.5.76:7001",
        changeOrigin: false,
        ws: true,
        pathRewrite: {
          "^/api": "",
        },
      })
    )(ctx, next)
  }
  await next();
});


// const router = new Router();
// app
//   .use(router.routes())
//   .use(router.allowedMethods());

app.listen(3000, () => {
  console.log("[demo] static-use-middleware is starting at port 3000");
});
