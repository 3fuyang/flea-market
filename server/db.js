//建立连接池
var mysql = {
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '12345',
  database: 'flea',
  multipleStatements: true
}

module.exports = {mysql}