const router = require('koa-router')()
    // 链接数据库
const sql = require('./../../config/db.config.js')
var fs=require('fs');
const Path = require('path');
const ExifImage = require('exif').ExifImage;


router.get('/img', async(ctx, next) => {
    console.log(__dirname)
    var path=Path.join(__dirname, "1.JPG");
    console.log(path)
   try {
        new ExifImage({ image: path}, function(error, exifData) {
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
