"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
const mysql_flea = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    // 数据库根据实际情况配置
    password: '12345',
    database: 'tj-flea',
    //database: 'flea',
    multipleStatements: true,
    // 注意时区的设置
    timezone: '08:00',
    charset: 'utf8mb4'
};
const connection = (0, mysql_1.createConnection)(mysql_flea);
connection.connect();
exports.default = connection;
