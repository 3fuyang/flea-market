const mysql = require('mysql')

const mysql_flea = {
  host: '106.15.78.201',
  port: '3306',
  user: 'root',
  // 数据库根据实际情况配置
  password: '12345',
  database: 'tj-flea',
  multipleStatements: true,
  // 注意时区的设置
  timezone: '08:00'
}

const connection = mysql.createConnection(mysql_flea)
connection.connect()

module.exports = connection