const router = require('koa-router')()
    // 链接数据库
const sql = require('./../../config/db.config.js')
const multer = require('koa-multer')

var storage = multer.diskStorage({
    //文件保存路径  
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
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
    if (ctx.request.method == "OPTIONS") {
        ctx.response.status = 200
    }
    ctx.body = {
        filename: '/uploads/'+ctx.req.file.filename, //返回文件路径
    }
})

module.exports = router
