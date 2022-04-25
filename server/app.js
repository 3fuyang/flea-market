const express = require('express')
const app = express()

const loginAPI = require('./routes/login')
const homeAPI = require('./routes/home')
const detailsAPI = require('./routes/details')
const securityAPI = require('./routes/User/security')
const chatAPI = require('./routes/User/chat')
const historyAPI = require('./routes/User/history')
const favoriteAPI = require('./routes/User/favorite')
const shoppingcartAPI = require('./routes/User/shoppingcart')
const infoAPI = require('./routes/User/info')
const goodsAPI = require('./routes/User/goods')

app
  // 配置图片等静态资源  
  .use('/public', express.static('public'))
  // 配置各API路由
  .use('/api', loginAPI)
  .use('/api', homeAPI)
  .use('/api', detailsAPI)
  .use('/api', securityAPI)
  .use('/api', chatAPI)
  .use('/api', historyAPI)
  .use('/api', favoriteAPI)
  .use('/api', shoppingcartAPI)
  .use('/api', infoAPI)
  .use('/api', goodsAPI)

// 启动服务器
const server = app.listen(8082, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Server is running at http://%s:%s`, host, port)
})