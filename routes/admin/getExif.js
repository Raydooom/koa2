const router = require('koa-router')()
    // 链接数据库
const sql = require('./../../config/db.config.js')
const ExifImage = require('exif').ExifImage;


router.get('/img', async(ctx, next) => {
    console.log(__dirname)
    try {
        new ExifImage({ image: '/myImage.jpg' }, function(error, exifData) {
            if (error)
                console.log('Error: ' + error.message);
            else
                console.log(exifData); // Do something with your data! 
        });
    } catch (error) {
        console.log('Error: ' + error.message);
    }
    ctx.body="12"
})

module.exports = router
