/**
 * 相册管理模块
 */
const router = require('koa-router')()
const fs = require('fs')
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
    var page = parseInt(ctx.query.page) || 0;
    var pageSize = parseInt(ctx.query.pageSize) || 2;

    console.log(page * pageSize, page + pageSize)

    var count;
    await sql.query("SELECT * FROM album_list")
        .then(result => {
            count = result.length;
        })
        .catch(error => {
            console.log(error);
        })
    await sql.query("SELECT * FROM album_list ORDER BY date desc limit " + page * pageSize + "," + page + pageSize)
        .then(result => {
            ctx.body = {
                count: count,
                data: result
            }
        })
        .catch(error => {
            console.log(error);
        })
})


/**
 * 添加相册
 * 0.获取相册分类（添加相册时）
 */
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

// 1.添加相册
router.get('/admin/album/add', async(ctx, next) => {
    let albumInfo = ctx.query;
    console.log(albumInfo)
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    await sql.query("INSERT INTO album_list (categoryId, main_show, title, cover, date, text, keywords) VALUES ('" + albumInfo.post_kind + "','" + albumInfo.post_hot + "','" + albumInfo.post_title + "','" + albumInfo.post_guide + "','" + date + "','" + albumInfo.post_content + "','" + albumInfo.post_keywords + "')")
        .then(result => {
            res = "添加成功!"
        })
        // 添加成功以后获取最新添加的
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

// 相册添加照片文字内容
router.get('/admin/album/addDetail', async(ctx, next) => {
    var photoList = ctx.query;
    console.log(photoList, photoList.album_id, photoList.title)
    await sql.query("INSERT INTO album_detail (album_id, title, description, img) VALUES ('" + photoList.album_id + "','" + photoList.title + "','" + photoList.description + "','" + photoList.imgUrl + "')")
        .then(result => {
            res = "添加成功!"
        })
    ctx.body = res;
})



/**
 * 删除相册
 */
router.get('/admin/album/del', async(ctx, next) => {
    var albumId = ctx.query.albumId;
    var imgUrl;
    await sql.query("select * from album_list where id = " + albumId)
        .then(res => {
            imgUrl = res[0].cover;
        })

    // 删除文件
    var fileUrl = imgUrl.replace("https://api.raydom.wang","public")
    await fs.readFile(fileUrl, (err, data) => {
        if (fs.existsSync(fileUrl)) {
            fs.unlinkSync(fileUrl);
        }
    });

    // 数据库删除数据
    await sql.query("delete from album_list where id=" + albumId)
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


module.exports = router
