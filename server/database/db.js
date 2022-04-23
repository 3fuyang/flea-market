const mysql = require('mysql')

const mysql_flea = {
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  // 数据库根据实际情况配置
  password: '12345',
  database: 'flea',
  multipleStatements: true,
  // 注意时区的设置
  timezone: '08:00'
}

const connection = mysql.createConnection(mysql_flea)
connection.connect()

module.exports = connection