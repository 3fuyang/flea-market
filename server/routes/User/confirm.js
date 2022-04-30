// Confirm 页面
const express = require('express')
const { result } = require('lodash')
const app = express()

const connection = require('../../database/db')

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 获取买家姓名、手机号
app.get(`/getBuyerInfo/:user_id`, (req, res) => {
  connection.query(
    `select real_name,telnum from userAccount where user_id='${req.params.user_id}'`,
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 获取商品信息
app.post(`/goodsToConfirm`, (req, res) => {
  const promises = []
  req.body.forEach(item => {
    promises.push(new Promise((resolve) => {
      connection.query(
        `select good_id,title,price,images from goodInfo where good_id='${item}';
         select nickname from userAccount where user_id=(select seller_id from goodInfo where good_id='${item}')`,
        (err, result) => {
          if (err) throw err
          let raw = JSON.parse(JSON.stringify(result)).flat(2)
          resolve(Object.assign(raw[0], raw[1]))
        }
      )
    }))
  })
  Promise.all(promises)
    .then(result => {
      res.end(JSON.stringify(result))
    })
})

module.exports = app