const router = require('koa-router')()
    // 链接数据库
var sql = require('./../config/db.config.js')

/**
 * 查询所有分类
 * @return {[type]} [description]
 */
router.get('/kinds', async(ctx, next) => {
    var res = [];
    await sql.query("SELECT * FROM categorys")
        .then(result => {
            kinds = result;
            console.log(kinds)
        }).catch(error => {
            console.log(error);
        })
        for (var item in kinds) {
            await sql.query("SELECT * FROM album_list WHERE categoryId = "+ kinds[item].id +" ORDER BY date")
            .then(result => {
                res[item] = {
                    kindName: kinds[item].name,
                    albumLength: result.length,
                    localAlbum:result[result.length-1].title,
                    kindCover:result[result.length-1].cover
                }
            }).catch(error => {
                console.log(error);
            })
        }
    ctx.body = res;
})


// 查询所有相册及所属分类
router.get('/', async(ctx, next) => {
    var res = [];
    await sql.query("SELECT * FROM album_list")
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
    await sql.query("SELECT * FROM post_list WHERE main_show = 1")
        .then(result => {
            res = result;
        }).catch(error => {
            console.log(error)
        })
    ctx.body = res;
})

// 查询相册包含图片
router.get('/post', async(ctx, next) => {
    await sql.query("SELECT * FROM album_detail WHERE list_id = " + ctx.query.id)
        .then(result => {
            res = result;
        }).catch(error => {
            console.log(error);
        })
    ctx.body = res;
})

// 根据id查询图片详细信息
router.get('/detail', async(ctx, next) => {
    await sql.query("SELECT * FROM album_detail WHERE id = " + ctx.query.id)
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
