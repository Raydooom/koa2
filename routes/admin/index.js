const router = require('koa-router')()
    // 链接数据库
const sql = require('./../config/db.config.js')
const moment = require('moment')

/**
 * 后台登录
 */
// 管理员账号密码验证
router.get('/admin/login', async(ctx, next) => {
    var user = ctx.query.user;
    var password = ctx.query.password;
    await sql.query("SELECT user,password FROM admin")
        .then(result => {
            if (result[0].user == user && result[0].password == password) {
                ctx.body = {
                    state: 1,
                    info: '验证成功！'
                }
            } else {
                ctx.body = {
                    state: 0,
                    info: '验证失败！'
                }
            }
        })
        .catch(error => {
            console.log(error);
        })
})

/**
 * 获取所有相册
 */
router.get('/admin/allAlbum', async(ctx, next) => {
    await sql.query("SELECT * FROM album_list limit 0,10")
        .then(result => {
            ctx.body = result;
        })
        .catch(error => {
            console.log(error);
        })
})



/**
 * 添加相册
 * 1.添加相册封面图、标题、描述、关键词等
 */

// 获取相册分类（添加相册时）
router.get('/admin/album/categorys', async(ctx, next) => {
    await sql.query("SELECT * FROM categorys")
        .then(result => {
            ctx.body = result
        })
        .catch(error => {
            console.log(error);
        })
})

// 添加相册分类
router.get('/admin/categorys/add', async(ctx, next) => {
    var name = ctx.query.name;
    await sql.query("INSERT INTO categorys (name) VALUES ('" + name + "')")
        .then(result => {
            ctx.body = {
                state: 1,
                info: '添加成功！'
            }
        })
        .catch(error => {
            console.log(error);
        })
})

// 添加相册
router.get('/admin/album/add', async(ctx, next) => {
    let albumInfo = ctx.query;
    console.log(albumInfo)
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    await sql.query("INSERT INTO album_list (categoryId, main_show, title, cover, date, text, keywords) VALUES ('" + albumInfo.post_kind + "','" + albumInfo.post_hot + "','" + albumInfo.post_title + "','" + albumInfo.post_guide + "','" + date + "','" + albumInfo.post_content + "','" + albumInfo.post_keywords + "')")
        .then(result => {
            res = "添加成功!"
        })
    await sql.query("select max(id) from album_list")
        .then(result => {
            ctx.body = {
                state: 1,
                info: res,
                albumId: result[0]['max(id)']
            }
        })
})

/**
 * 添加相册
 * 2.添加相册中图片内容文字
 */
// 根据相册id查询该相册信息
router.get('/admin/album/albumInfo', async(ctx, next) => {
    var album;
    await sql.query("SELECT * FROM album_list WHERE id = " + ctx.query.id)
        .then(result => {
            album = result;
        }).catch(error => {
            console.log(error);
        })
    ctx.body = {
        album: album[0],
    };
})

// 添加相册内容
router.get('/admin/album/addDetail', async(ctx, next) => {
    var photoList = ctx.query;
    console.log(photoList, photoList.album_id, photoList.title)
    await sql.query("INSERT INTO album_detail (album_id, title, description, img) VALUES ('" + photoList.album_id + "','" + photoList.title + "','" + photoList.description + "','" + photoList.imgUrl + "')")
        .then(result => {
            res = "添加成功!"
        })
    ctx.body = res;
})


module.exports = router
