/**
 * 留言板模块管理接口
 */
const router = require('koa-router')()
const fs = require('fs')
// 链接数据库
const sql = require('./../config/db.config.js')
const moment = require('moment')

router.get("/admin/messageBoard", async(ctx, next) => {
    await sql.query("SELECT * FROM other WHERE type = 'message_board'")
        .then(result => {
            ctx.body = result[0];
        })
        .catch(error => {
            console.log(error);
        })
})



module.exports = router
