const router = require('koa-router')()
const https = require('https')
const moment = require('moment')
// 链接数据库
var sql = require('./../config/db.config.js')

// 首页展示照片接口
router.get('/hotImg', async(ctx, next) => {
    await sql.query("SELECT * FROM hot_photo")
        .then(result => {
            ctx.body = result;
        }).catch(error => {
            console.log(error);
        })
})


/**
 * 查询所有分类
 */
router.get('/kinds', async(ctx, next) => {
    var res = [];
    await sql.query("SELECT * FROM categorys")
        .then(result => {
            kinds = result;
            // console.log(kinds)
        }).catch(error => {
            console.log(error);
        })
    for (var item in kinds) {
        await sql.query("SELECT * FROM album_list WHERE categoryId = " + kinds[item].id + " ORDER BY date")
            .then(result => {
                res[item] = {
                    id: kinds[item].id,
                    kindName: kinds[item].name,
                    albumLength: result.length,
                    localAlbum: result[result.length - 1].title,
                    kindCover: result[result.length - 1].cover
                }
                console.log(kinds[item].id)
            }).catch(error => {
                console.log(error);
            })
    }
    ctx.body = res;
})

/**
 *   根据分类id查询该分类下所有相册
 */
router.get('/kinds/album', async(ctx, next) => {
    var id = ctx.query.id;
    await sql.query("SELECT * FROM album_list WHERE categoryId = " + id)
        .then(result => {
            albumList = result;
        }).catch(error => {
            console.log(error);
        })

    ctx.body = albumList;
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

// banner图展示相册
router.get('/mainShow', async(ctx, next) => {
    await sql.query("SELECT * FROM album_list WHERE main_show = 1")
        .then(result => {
            res = result;
        }).catch(error => {
            console.log(error)
        })
    ctx.body = res;
})

// 根据相册id查询该相册下所有内容
router.get('/album', async(ctx, next) => {
    await sql.query("SELECT * FROM album_detail WHERE list_id = " + ctx.query.id)
        .then(result => {
            res = result;
        }).catch(error => {
            console.log(error);
        })
    console.log(res)
    ctx.body = res;
})

// 根据图片id查询图片详细信息
router.get('/album/photo', async(ctx, next) => {
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
        detail: res[0],
        commentsCount: comments.length,
        comments: comments
    };
})

//获取留言列表
router.get('/getMsg', async(ctx, next) => {
    await sql.query("SELECT * FROM message_board ORDER BY date desc")
        .then(result => {
            ctx.body=result;
        }).catch(error => {
            console.log(error);
        })
})

//用户留言
router.get('/sendMsg', async(ctx, next) => {
    let getInfo = ctx.query;
    let userInfo = JSON.parse(getInfo.userInfo);
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    var nickName = userInfo.nickName || "未知用户";
    var avatarUrl = userInfo.avatarUrl || "https://api.raydom.wang/icons/default_avatar.jpg";
    await sql.query("INSERT INTO message_board (user_name, user_gender, user_avatar, user_msg, user_country, user_province, user_city, user_language, date) VALUES ('"+nickName+"','"+userInfo.gender+"','"+avatarUrl+"','"+getInfo.msg+"','"+userInfo.country+"','"+userInfo.province+"','"+userInfo.city+"','"+userInfo.language+"','"+date+"')")
        .then(result => {
            ctx.body={
                state:1,
                info:"留言成功！"
            }
        }).catch(error => {
            console.log(error);
        })
})

// 获取微信用户信息
router.get('/getWechatUser', async(ctx, next) => {
    https.get('https://api.raydom.wang', (res) => {
        console.log(res)
    }).on('error', (e) => {
        console.error(e);
    });
   /* var data;
    var size;
    https.get('https://api.raydom.wang', (res) => {
        var datas = [];  
        res.on('data', function (data) {  
            datas.push(data);  
            size += data.length;
            var resa = data.toString();
            sendres(ctx,resa);
        });  
        res.on("end", function () {  
            var buff = Buffer.concat(datas, size);
            var resa = buff.toString();
            // console.log(buff)
            // sendres(resa);
        });
    }).on('error', (e) => {
        console.error(e);
    });*/
    
   
    // console.log(data)
    /*let code = ctx.query.code;
    var data = {
        appid: "wx2984c3354dfc51d6",
        secret: "3d3dfda01d38ace499effaf512faa58c",
        js_code: code,
        grant_type: "authorization_code"
    }*/

    /*var opt = {
        method: "GET",
        host: "https://api.raydom.wang"
    };

    var req = http.request(opt, function(data) {
        if (serverFeedback.statusCode == 200) {
            console.log(data)
            var res={};
            serverFeedback.on('data', function (data) { res.push(data) })  
                          .on('end', function () { console.log(res) });
        } else {
            console.log(500)
            // res.send(500, "error");
        }
    });*/



    /*await sql.query("SELECT * FROM album_detail WHERE list_id = " + ctx.query.id)
        .then(result => {
            res = result;
        }).catch(error => {
            console.log(error);
        })
        console.log(res)
    ctx.body = res;*/
})
function sendres(ctx,res){
    ctx.body=res;
}
module.exports = router
