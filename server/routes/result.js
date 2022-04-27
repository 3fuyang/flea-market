// Result页面的接口
const express = require('express')
const app = express()

const connection = require('../database/db')

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

app.post('/getResult', (req, res) => {
  const reqBody = req.body
  if ('keywords' in reqBody) {
    // 有关键词
    if ('filters' in reqBody) {
      // 有关键词，有筛选条件
      let sql = `select good_id,price,title,images from goodInfo where available=0 and title like '%${reqBody.keywords.split('').join('%')}%'`
      for (let property in reqBody.filters) {
        if (property === 'onShelfTime') {
          sql += ` and onShelf='${reqBody[property]}'`
        } else if (property === 'minPrice') {
          sql += ` and price>=${reqBody[property]}`
        } else if (property === 'maxPrice') {
          sql += ` and price<=${reqBody[property]}`
        } else {
          sql += `and (`
          reqBody[property].forEach((item) => {
            sql += ` ${property}=${item} or`
          })
          sql = sql.substring(0, -2)
          sql += ')'
        }
      }
      connection.query(
        sql,
        (err, result) => {
          if (err) throw err
          res.end(JSON.stringify(result))
        }
      )
    } else {
      // 有关键词，无筛选条件
      connection.query(
        `select good_id,price,title,images from goodInfo where available=0 and title like '%${reqBody.keywords.split('').join('%')}%'`,
        (err, result) => {
          if (err) throw err
          res.end(JSON.stringify(result))
        }
      )
    }
  } else if ('filters' in reqBody) {
    // 无关键词，有筛选条件
    let sql = `select good_id,price,title,images from goodInfo where availabel=0`
    for (let property in reqBody.filters) {
      if (property === 'onShelfTime') {
        sql += ` and onShelf='${reqBody[property]}'`
      } else if (property === 'minPrice') {
        sql += ` and price>=${reqBody[property]}`
      } else if (property === 'maxPrice') {
        sql += ` and price<=${reqBody[property]}`
      } else {
        sql += `and (`
        reqBody[property].forEach((item) => {
          sql += ` ${property}=${item} or`
        })
        sql = sql.substring(0, -2)
        sql += ')'
      }
    }
    connection.query(
      sql,
      (err, result) => {
        if (err) throw err
        res.end(JSON.stringify(result))
      }
    )
  } else {
    // 无关键词，无筛选条件
    res.end(JSON.stringify(null))
  }
})

module.exports = app