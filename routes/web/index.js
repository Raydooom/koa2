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
 * 其他东西接口
 */
router.get('/other', async(ctx, next) => {
    await sql.query("SELECT * FROM other")
        .then(res => {
            ctx.body = res
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
        }).catch(error => {
            console.log(error);
        })
    for (var item in kinds) {
        await sql.query("SELECT * FROM album_list WHERE categoryId = " + kinds[item].id + " ORDER BY date")
            .then(result => {
                if (result.length != 0)
                    res[item] = {
                        id: kinds[item].id,
                        kindName: kinds[item].name,
                        albumLength: result.length,
                        localAlbum: result[result.length - 1].title,
                        kindCover: result[result.length - 1].cover
                    }
            }).catch(error => {
                console.log(error);
            })
    }
    // console.log(res)
    ctx.body = res;
})

// 所有分类页banner图展示相册
router.get('/mainShow', async(ctx, next) => {
    await sql.query("SELECT * FROM album_list WHERE main_show = 1 ORDER BY date desc")
        .then(result => {
            res = result;
        }).catch(error => {
            console.log(error)
        })
    ctx.body = res;
})

/**
 *   根据分类id查询该分类下所有相册
 */
router.get('/kinds/album', async(ctx, next) => {
    var id = ctx.query.id;
    await sql.query("SELECT * FROM album_list WHERE categoryId = " + id + " ORDER BY date desc")
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

/**
 * 获取相册详情
 */

// 根据相册id查询该相册下所有内容
router.get('/albumDetail', async(ctx, next) => {
    var album, albumPhoto, comments;
    await sql.query("SELECT * FROM album_list WHERE id = " + ctx.query.id)
        .then(result => {
            album = result;
        }).catch(error => {
            console.log(error);
        })
    await sql.query("SELECT * FROM album_detail WHERE album_id = " + ctx.query.id)
        .then(result => {
            albumPhoto = result;
        }).catch(error => {
            console.log(error);
        })
    ctx.body = {
        album: album[0],
        albumPhoto: albumPhoto,
    };
})

/**
 * 获取相册评论
 */
router.get('/albumComments', async(ctx, next) => {
    var comments, commentsDate = [];
    // 查询留言
    await sql.query("SELECT * FROM message_board WHERE comment_type = " + ctx.query.id + " ORDER BY date desc")
        .then(result => {
            comments = result;
            // console.log(comments)
        }).catch(error => {
            console.log(error);
        })
        // 查询每条留言下的回复
    for (var item in comments) {
        await sql.query("SELECT * FROM message_reply WHERE parent_id = " + comments[item].id)
            .then(msgReply => {
                commentsDate[item] = {
                    msgList: comments[item],
                    msgReply: msgReply
                }
            }).catch(error => {
                console.log(error);
            })
    }

    // 统计留言条数，更新到相册列表
    await sql.query("UPDATE album_list SET comments = '" + commentsDate.length + "' WHERE id = " + ctx.query.id)
        .then(res => {
            //console.log(res)
        }).catch(error => {
            console.log(error);
        })

    ctx.body = {
        commentsCount: commentsDate.length,
        comments: commentsDate
    };
})

/**
 * 评论相册
 * @获取id
 */
router.get('/sendComments', async(ctx, next) => {
    let getInfo = ctx.query;
    let userInfo = JSON.parse(getInfo.userInfo);
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    var nickName = userInfo.nickName || "未知用户";
    var avatarUrl = userInfo.avatarUrl || "https://api.raydom.wang/icons/default_avatar.jpg";
    await sql.query("INSERT INTO message_board (comment_type, user_name, user_gender, user_avatar, user_msg, user_country, user_province, user_city, user_language, date) VALUES ('" + getInfo.albumId + "','" + nickName + "','" + userInfo.gender + "','" + avatarUrl + "','" + getInfo.msg + "','" + userInfo.country + "','" + userInfo.province + "','" + userInfo.city + "','" + userInfo.language + "','" + date + "')")
        .then(result => {
            ctx.body = {
                state: 1,
                info: "留言成功！"
            }
        }).catch(error => {
            console.log(error);
        })
})


/**
 * 浏览量统计
 */
router.get('/albumViews', async(ctx, next) => {
    var resData = ctx.query;
    // console.log(resData)
    await sql.query("UPDATE album_list SET views='" + resData.views + "' WHERE ID='" + resData.id + "'")
        .then(result => {
            ctx.body = {
                state: 1,
                info: '浏览统计成功'
            };
        }).catch(error => {
            console.log(error);
        })


})

/**
 * 点赞统计
 */
router.get('/albumPraise', async(ctx, next) => {
    var resData = ctx.query;
    await sql.query("UPDATE album_list SET praises='" + resData.praises + "' WHERE id='" + resData.id + "'")
        .then(result => {
            console.log(result)
            ctx.body = {
                state: 1,
                info: '点赞成功'
            };
        }).catch(error => {
            console.log(error);
        })

})

/**
 * 分享统计
 */
router.get('/albumShare', async(ctx, next) => {
    var resData = ctx.query;
    await sql.query("UPDATE album_list SET shares='" + resData.shares + "' WHERE id='" + resData.id + "'")
        .then(result => {
            console.log(result)
            ctx.body = {
                state: 1,
                info: '分享统计成功'
            };
        }).catch(error => {
            console.log(error);
        })

})


/**
 * 留言板模块  ****************************
 */

//获取留言列表
router.get('/getMsg', async(ctx, next) => {
    var res = [];
    await sql.query("SELECT * FROM message_board WHERE comment_type = 0 ORDER BY date desc")
        .then(result => {
            msgList = result;
        }).catch(error => {
            console.log(error);
        })
    for (var item in msgList) {
        await sql.query("SELECT * FROM message_reply WHERE parent_id = " + msgList[item].id)
            .then(msgReply => {
                res[item] = {
                    msgList: msgList[item],
                    msgReply: msgReply
                }
            }).catch(error => {
                console.log(error);
            })
    }
    ctx.body = res;
})

//用户留言
router.get('/sendMsg', async(ctx, next) => {
    let getInfo = ctx.query;
    let userInfo = JSON.parse(getInfo.userInfo);
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    var nickName = userInfo.nickName || "未知用户";
    var avatarUrl = userInfo.avatarUrl || "https://api.raydom.wang/icons/default_avatar.jpg";
    await sql.query("INSERT INTO message_board (comment_type, user_name, user_gender, user_avatar, user_msg, user_country, user_province, user_city, user_language, date) VALUES ('0','" + nickName + "','" + userInfo.gender + "','" + avatarUrl + "','" + getInfo.msg + "','" + userInfo.country + "','" + userInfo.province + "','" + userInfo.city + "','" + userInfo.language + "','" + date + "')")
        .then(result => {
            ctx.body = {
                state: 1,
                info: "留言成功！"
            }
        }).catch(error => {
            console.log(error);
        })
})

//回复用户留言
router.get('/replyMsg', async(ctx, next) => {
    let getInfo = ctx.query;
    let userInfo = JSON.parse(getInfo.userInfo);
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    var nickName = userInfo.nickName || "未知用户";
    var avatarUrl = userInfo.avatarUrl || "https://api.raydom.wang/icons/default_avatar.jpg";
    await sql.query("INSERT INTO message_reply (user_name, parent_id, user_gender, user_avatar, user_msg, user_country, user_province, user_city, user_language, date) VALUES ('" + nickName + "','" + getInfo.msgId + "','" + userInfo.gender + "','" + avatarUrl + "','" + getInfo.msg + "','" + userInfo.country + "','" + userInfo.province + "','" + userInfo.city + "','" + userInfo.language + "','" + date + "')")
        .then(result => {
            ctx.body = {
                state: 1,
                info: "回复成功！"
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

function sendres(ctx, res) {
    ctx.body = res;
}
module.exports = router
