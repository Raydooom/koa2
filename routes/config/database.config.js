const wrapper = require('co-mysql');
const mysql = require('mysql');
var options = {
    host: 'localhost',
    port: 3306,
    database: 'koa2',
    user: 'root',
    password: 'Wang619281505'
};

var pool = mysql.createPool(options);
var sql = wrapper(pool);

exports.sql = sql;