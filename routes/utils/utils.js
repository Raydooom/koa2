const https = require('https');

var httpsRequest = function(url) {
    var result;
    https.get(url, (res) => {
        // console.log('statusCode:', res.statusCode);
        // console.log('headers:', res.headers);
        res.on('data', (d) => {
            result = d.toString()

            return result;
                //  result = process.stdout.write(d);
        });
    }).on('error', (e) => {
        console.error(e);
    });
}

module.exports = httpsRequest
