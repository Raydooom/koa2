/**
 * [router description]：热门图片查看管理模块
 * @type {[type]}
 */

const router = require('koa-router')()
const fs = require('fs')
const https = require('https')
const moment = require('moment')
    // 链接数据库
var sql = require('./../config/db.config.js')

// 首页展示照片接口
router.get('/admin/hotImg', async(ctx, next) => {
    await sql.query("SELECT * FROM hot_photo ORDER BY id desc")
        .then(result => {
            ctx.body = result;
        }).catch(error => {
            console.log(error);
        })
})

// 添加图片
router.get('/admin/hotImg/add', async(ctx, next) => {
    var hotImg = ctx.query;
    await sql.query("INSERT INTO hot_photo (title, description, date, img, site) VALUES ('" + hotImg.title + "','" + hotImg.description + "','" + hotImg.date + "','" + hotImg.img + "','" + hotImg.site + "')")
        .then(result => {
            ctx.body ={
                state:1,
                info:'添加成功！'
            }
        })
})

/**
 * 根据id删除热门图片数据库数据和文件
 */
router.get('/admin/hotImg/del', async(ctx, next) => {
    var hotImgId = ctx.query.hotImgId;
    var imgUrl;
    await sql.query("select * from hot_photo where id = " + hotImgId)
        .then(res => {
            imgUrl = res[0].img;
        })

    // 删除文件
    var fileUrl = imgUrl.replace("https://api.raydom.wang","public")
    await fs.readFile(fileUrl, (err, data) => {
        if (fs.existsSync(fileUrl)) {
            fs.unlinkSync(fileUrl);
        }
    });

    // 数据库删除数据
    await sql.query("delete from hot_photo where id=" + hotImgId)
        .then(result => {
            ctx.body = {
                state: 1,
                info: "删除成功！"
            }
        })
        .catch(error => {
            console.log(error);
        })
})



router.get('/admin/hotImg/edit', async(ctx, next) => {
    await sql.query("SELECT * FROM hot_photo ORDER BY id")
        .then(result => {
            ctx.body = result;
        }).catch(error => {
            console.log(error);
        })
})


module.exports = router;