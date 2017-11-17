/**
 * [router description] [图片上传模块]
 * @type {[type]} 
 * @returns {[json]} [图片文件名]
 */
const router = require('koa-router')()
    // 链接数据库
const sql = require('./../config/db.config.js')
const multer = require('koa-multer')

/**
 * 文件上传
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
router.post('/postcardUpload', upload.single('file'), async(ctx, next) => {
    // console.log(ctx.req)
    ctx.body = '/postCard/' + ctx.req.file.filename //返回文件名

})

/**
 * 存入数据库
 */
router.get('/postcard', async(ctx, next) => {
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
 * 根据key获取生成的card
 */
router.get('/getPostcard', async(ctx, next) => {
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
