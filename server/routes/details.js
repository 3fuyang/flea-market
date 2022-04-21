// Home页面的接口
const express = require('express')
const app = express()

const connection = require('../database/db')

app.use(express.json())
app.use(express.urlencoded({extended:  false}))
// 接口21 获取商品详情
app.get('/getGoods/:good_id',(req,res) => {
  connection.query(
    "select * from goodInfo where good_id ='"+ req.params.good_id + "'",
    (err, result) =>{
      if (err) throw err
      res.end(JSON.stringify(result))    
    }
  )
})

// 接口22 获取卖家信息
app.get('/getSellerInfo/:user_id',(req,res) => {
  new Promise((resolve) => {
    // 获取昵称，头像URL
    connection.query(
      "select nickname,avatar from useraccount where user_id ='"+ req.params.user_id + "'",
      (err, result) => {
        if (err) throw err
        let sellerInfo =  JSON.parse(JSON.stringify(result))[0]
        resolve(sellerInfo)
      }
    )
  }).then((sellerInfo) => {
    // 获取信誉，评分(依赖于订单)
    sellerInfo.reputation = '良好' 
    // 完成订单接口后改写：查询所有该卖家的订单，得到它们评分的平均值，添加到sellerInfo中
    sellerInfo.score = '4.5'
    res.end(JSON.stringify(sellerInfo))
  })
})
module.exports = app