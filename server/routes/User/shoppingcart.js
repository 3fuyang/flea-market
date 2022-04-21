/* ShoppingCart 页面 */
const express = require('express')
const app = express()

const connection = require('../../database/db')

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 接口16 获取购物车：传入（用户ID） 返回（购物车数据:商品ID）
app.get('/getCart/:user_id', (req, res) => {
  connection.query(
    "select * from shoppingcart where user_id = '" + req.params.user_id + "'",
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))    
    }
  )
})

// 接口17 从购物车移除某商品：传入（用户ID，商品ID） 返回（null）
app.get('/removeCart/:user_id/:goods_id', (req, res) => {
  connection.query(
    "delete from shoppingcart where user_id ='" + req.params.user_id + "' and goods_id ='" + req.params.goods_id + "'",
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

module.exports = app