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
const postcard = require('./routes/web/postcard')
const service = require('./routes/web/service')
/**
 * 后台接口路由定义
 */
// 热门图片模块
const hot = require('./routes/admin/hot')
// 相册模块
const adminIndex = require('./routes/admin/index')
// 上传图片模块
const upload = require('./routes/admin/modules/upload')
// 留言板模块
const messageBoard = require('./routes/admin/messageBoard')
// 获取图片Exif信息模块
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
app.use(postcard.routes(), postcard.allowedMethods())
app.use(service.routes(), service.allowedMethods())
// 后台路由
app.use(hot.routes(), hot.allowedMethods())
app.use(adminIndex.routes(), adminIndex.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())
app.use(messageBoard.routes(), messageBoard.allowedMethods())
app.use(getExif.routes(), getExif.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
