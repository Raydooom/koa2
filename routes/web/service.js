/**
 * 客服接口
 */

const router = require('koa-router')()
const sql = require('./../config/db.config.js')
const multer = require('koa-multer')

router.prefix('/service')

var signature= "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG";
var token = "Wang619281505";
var timeStamp = "1409304348";
var nonce = "xxxxxx";
var appId = "wxb11529c136998cb6";


router.get('/msg', async(ctx, next) => {
    console.log(ctx.query)
    ctx.body = ctx.query.echostr
})

router.put('/msg', async(ctx, next) => {
    console.log(ctx.query)
    ctx.body = "123"
    
})

module.exports = router
