const router = require('koa-router')()
const httpsRequest = require('../utils/utils.js')
const https = require('https');
router.prefix('/users')

router.get('/', async(ctx, next) => {
    var result = 1;
    https.get(
        "https://api.weixin.qq.com/sns/jscode2session?appid=wx2984c3354dfc51d6&secret=586d3d6ccac49d3229ec03040d958c4b&js_code=0611HOwS0yNQoW16SFwS0ZYHwS01HOw6&grant_type=authorization_code", 
    (res) => {
        var buffers = [];
        res.on('data', (d) => {
            buffers.push(d);
        });
        res.on('end',(d)=>{
            var wholeData = Buffer.concat(buffers);
            result = wholeData.toString('utf8');
            sendRes(result)
        })
    }).on('error', (e) => {
        console.error(e);
    });
    function sendRes(res){
        ctx.body = {a:1,res:res}
        console.log(res)
    }
    
});

router.get('/bar', function(ctx, next) {
    ctx.body = 'this is a users/bar response'
})

module.exports = router
