const mysql = require('mysql')

const mysql_flea = {
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '12345',
  database: 'flea',
  multipleStatements: true
}

const connection = mysql.createConnection(mysql_flea)
connection.connect()

module.exports = connection