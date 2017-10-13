const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// 前端接口
const index = require('./routes/web/index')
const users = require('./routes/web/users')

// 后台接口
const admin = require('./routes/admin/index')
const upload = require('./routes/admin/modules/upload')
const getExif = require('./routes/admin/modules/getExif')

// error handler
onerror(app)

app.use(async (ctx, next) => {
    // 允许来自所有域名请求
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
    ctx.set("Content-Type", "application/json;charset=utf-8");
    ctx.set("Access-Control-Allow-Credentials", true);
    ctx.set("Access-Control-Max-Age", 300);
    ctx.set("Access-Control-Expose-Headers", "myData");
    await next();
})

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

/*app.use(views(__dirname + '/views', {
    extension: 'pug'
}))
*/

// logger
app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// 后台路由
app.use(admin.routes(), admin.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())
app.use(getExif.routes(), getExif.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
