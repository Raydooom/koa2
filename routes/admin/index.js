const router = require('koa-router')()
    // 链接数据库
var sql = require('./../config/db.config.js')

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

// 获取相册分类
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
    var date = new Date();
    await sql.query("INSERT INTO album_list (categoryId, main_show, title, cover, date, text, keywords) VALUES ('"+albumInfo.post_kind+"','"+albumInfo.post_hot+"','"+albumInfo.post_title+"','"+albumInfo.post_guide+"','"+date+"','"+albumInfo.post_content+"','"+albumInfo.post_keywords+"')")
    .then(result=>{
        ctx.body = {
            state:1,
            info:'添加成功！'
        }
    })
})

module.exports = router
