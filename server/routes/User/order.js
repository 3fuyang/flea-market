// Order 页面
const express = require('express')
const app = express()

const connection = require('../../database/db')

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 获取用户购买商品的订单
app.get('/getOrders/:user_id', (req, res) => {
  let data
  const promises = []
  new Promise((resolve, reject) => {
    connection.query(
      `select * from orderData where buyer='${req.params.user_id}' order by generated_time desc`,
      (err, result) => {
        if (err) throw err
        data = JSON.parse(JSON.stringify(result))
        resolve()
      }
    )
  })
    .then(() => {
      for(let item of data){
        promises.push(
          new Promise((resolve) =>{
            connection.query(
              `select title,price,images,seller_id from goodInfo where good_id = '${item.good_id}'`,
              (err, result) => {
                if(err) throw err
                result = JSON.parse(JSON.stringify(result))[0]
                for(let property in result){
                  item[property] = result[property]
                }
                resolve()
              }
            )
          })
        )
      }
      Promise.all(promises).then(() => {
        res.end(JSON.stringify(data))
      })
    })  
})

// 获取卖家昵称，头像url
app.get('/sellerAvatarAndName/:seller_id', (req, res) => {
  connection.query(
    `select nickname,avatar from userAccount where user_id='${req.params.seller_id}'`,
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 确认完成订单
app.post(`/completeOrder`, (req, res) => {
  connection.query(
    `update orderData set stat='待评价' where order_id='${req.body.orderID}'`,
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 获取订单评价
app.get(`/getOrderEvaluation/:order_id`, (req, res) => {
  connection.query(
    `select review,rate from orderData where order_id='${req.params.order_id}'`,
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 提交评价
app.post(`/submitEvaluation`, (req, res) => {
  connection.query(
    `update orderData set review='${req.body.review}',rate='${req.body.grade}',review_time='${req.body.time}',stat='已完成' where order_id='${req.body.orderID}';`,
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

module.exports = app