/* Goods 页面 */
const express = require('express')
const app = express()

const connection = require('../../database/db')

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 获取上架中商品
app.get('/onShelfGoods/:user_id', (req, res) => {
  new Promise((resolve, reject) => {
    connection.query(
      `select * from goodInfo where seller_id='${req.params.user_id}' and available='0'`,
      (err, result) => {
        if(err) throw err
        resolve(JSON.parse(JSON.stringify(result)))
      }
    )
  })
    .then((halfResult) => {
      const promises = []
      halfResult.forEach(item => {
        promises.push(
          new Promise((resolve, reject) => {
            connection.query(
              `select count(*) as cnt1 from collectionBox where good_id='${item.good_id}';
               select count(*) as cnt2 from browseTrack where good_id='${item.good_id}'`,
              (err, result) => {
                if(err) throw err
                let data = JSON.parse(JSON.stringify(result))
                item.likes = JSON.parse(JSON.stringify(data[0]))[0].cnt1
                item.browsed = JSON.parse(JSON.stringify(data[1]))[0].cnt2
                resolve(item)
              }
            )
          })
        )
      })
      Promise.all(promises)
        .then(result => {
          res.end(JSON.stringify(result))
        })
    })
})

// 获取已售出商品
app.get('/soldGoods/:user_id', (req, res) => {
  new Promise((resolve, reject) => {
    connection.query(
      `select * from goodInfo where seller_id='${req.params.user_id}' and available='1'`,
      (err, result) => {
        if(err) throw err
        resolve(JSON.parse(JSON.stringify(result)))
      }
    )
  })
    .then((halfResult) => {
      const promises = []
      halfResult.forEach(item => {
        promises.push(
          new Promise((resolve, reject) => {
            connection.query(
              `select count(*) as cnt1 from collectionBox where good_id='${item.good_id}';
               select count(*) as cnt2 from browseTrack where good_id='${item.good_id}'`,
              (err, result) => {
                if(err) throw err
                let data = JSON.parse(JSON.stringify(result))
                item.likes = JSON.parse(JSON.stringify(data[0]))[0].cnt1
                item.browsed = JSON.parse(JSON.stringify(data[1]))[0].cnt2
                resolve(item)
              }
            )
          })
        )
      })
      Promise.all(promises)
        .then(result => {
          res.end(JSON.stringify(result))
        })
    })
})

module.exports = app