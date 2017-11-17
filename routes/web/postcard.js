const router = require('koa-router')()
const sql = require('./../config/db.config.js')
const httpsRequest = require('../utils/utils.js')
const multer = require('koa-multer')
const https = require('https')

router.prefix('/postcard')

/**
 * [明信片图片预设接口]
 * @param  {[type]}   '/getImg'  [description]
 * @param  {Function} async(ctx, next)         [description]
 * @return {[type]}              [图片数组]
 */
router.get('/getImg', async(ctx, next) => {
    await sql.query("SELECT * FROM card_default_img")
        .then(res => {
            ctx.body = {
                state: 1,
                data: res
            }
        })
        .catch((error) => {
            ctx.body = {
                state: 0,
                info: '数据查询错误！'
            }
        })
})

/**
 * [图片上传接口]
 * @param  {[type]} req       [description] 接收图片
 * @return {[type]}           [description] 图片url
 */
var storage = multer.diskStorage({
        //文件保存路径  
        destination: function(req, file, cb) {
            cb(null, 'public/postCard/')
        },
        //修改文件名称  
        filename: function(req, file, cb) {
            var fileFormat = (file.originalname).split(".");
            cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    })
    //加载配置  
var upload = multer({ storage: storage });
//路由  
router.post('/upload', upload.single('file'), async(ctx, next) => {
    // console.log(ctx.req)
    ctx.body = '/postCard/' + ctx.req.file.filename //返回文件名
})

/**
 * [明信片路径，本次会话code出入数据库]
 * @param  {[type]} '/postcard' [接口url]
 * @return {[type]}             [结果]
 */
router.get('/add', async(ctx, next) => {
    console.log(ctx.query)
    var img = 'https://api.raydom.wang' + ctx.query.card;
    await sql.query("INSERT INTO postcard (card_key, card) VALUES ('" + ctx.query.key + "','" + img + "')")
        .then(res => {
            ctx.body = {
                state: 1,
                info: '插入数据成功！'
            }
        }).catch(error => {
            console.log(error);
        })
})

/**
 * [收到明信片查看接口]
 * @param  {[type]} '/receive' [description]
 * @param  {[type]} async(ctx, next)         [description]
 * @return {[type]}            [图片url]
 */
router.get('/receive', async(ctx, next) => {
    var card_key = ctx.query.keyCard;
    console.log(card_key)
    await sql.query("SELECT * FROM postcard WHERE card_key = '" + card_key + "'")
        .then(res => {
            console.log(res)
            ctx.body = {
                state: 1,
                card: res[0].card
            }
        }).catch(error => {
            console.log(error);
        })
})

module.exports = router
