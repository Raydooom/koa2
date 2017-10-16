const router = require('koa-router')()
    // 链接数据库
var sql = require('./config/db.config.js')

// 查询所有相册及所属分类
router.get('/', async(ctx, next) => {
    var res = [];
    await sql.query("SELECT * FROM post_list")
        .then(result => {
            postList = result;
        }).catch(error => {
            console.log(error);
        })
    for (var item in postList) {
        await sql.query("SELECT name FROM categorys WHERE id = " + postList[item].categoryId)
            .then(result => {
                res[item] = {
                    category: result[0].name,
                    post: postList[item]
                }
            }).catch(error => {
                console.log(error);
            })
    }
    ctx.body = res;
})

// banner图展示内容
router.get('/mainShow', async(ctx, next) => {
    await sql.query("SELECT * FROM album_list WHERE main_show = 1")
        .then(result => {
            console.log(result)
            // res = result;
        }).catch(error => {
            console.log(error)
        })
    ctx.body = "123";
})

// 查询相册包含图片
router.get('/post', async(ctx, next) => {
    await sql.query("SELECT * FROM post_detail WHERE list_id = " + ctx.query.id)
        .then(result => {
            res = result;
        }).catch(error => {
            console.log(error);
        })
    ctx.body = res;
})

// 根据id查询图片详细信息
router.get('/detail', async(ctx, next) => {
    await sql.query("SELECT * FROM post_detail WHERE id = " + ctx.query.id)
        .then(result => {
            res = result;
        }).catch(error => {
            console.log(error);
        })
    await sql.query("SELECT * FROM comments WHERE post_id = " + res[0].comment_id)
        .then(result => {
            comments = result;
        }).catch(error => {
            console.log(error);
        })
    ctx.body = {
        detail: res,
        commentsCount: comments.length,
        comments: comments
    };
})

module.exports = router
