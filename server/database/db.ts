import{ createConnection, type ConnectionConfig } from 'mysql'

const mysql_flea: ConnectionConfig = {
  host: '106.15.78.201',
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
}

const connection = createConnection(mysql_flea)
connection.connect()

export default connection