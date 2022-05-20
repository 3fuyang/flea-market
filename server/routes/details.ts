// Home页面的接口
import express from 'express'
import connection from '../database/db'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 商品是否可访问
app.get('/checkAvailable/:good_id', (req, res) => {
  connection.query(
    `select available from goodInfo where good_id=?`,
    [req.params.good_id],
    (err, result) => {
      if (err) throw err
      let message = true
      let available = JSON.parse(JSON.stringify(result))[0].available
      if (available == 1) {
        message = false
      }
      res.end(JSON.stringify(message))
    }
  )
})
// 接口21 获取商品详情
app.get('/getGoods/:good_id',(req,res) => {
  new Promise((resolve) => {
    connection.query(
      "select * from goodInfo where good_id =?",
      [req.params.good_id],
      (err, result) =>{
        if (err) throw err
        resolve(JSON.parse(JSON.stringify(result))[0])   
      }
    )    
  })
    .then((baseInfo: any) => {
      connection.query(
        `select count(*) as cnt from collectionBox where good_id=?`,
        [req.params.good_id],
        (err, result) => {
          if (err) throw err
          baseInfo.likes = JSON.parse(JSON.stringify(result))[0].cnt
          res.end(JSON.stringify(baseInfo))
        }
      )
    })
})

// 接口22 获取卖家信息
app.get('/getSellerInfo/:user_id',(req,res) => {
  new Promise((resolve) => {
    // 获取昵称，头像URL
    connection.query(
      "select nickname,avatar from userAccount where user_id = ?",
      [req.params.user_id],
      (err, result) => {
        if (err) throw err
        let sellerInfo =  JSON.parse(JSON.stringify(result))[0]
        resolve(sellerInfo)
      }
    )
  }).then((sellerInfo: any) => {
    // 获取信誉，评分(依赖于订单)
    sellerInfo.reputation = '良好' 
    // 完成订单接口后改写：查询所有该卖家的订单，得到它们评分的平均值，添加到sellerInfo中
    sellerInfo.score = '4.5'
    res.end(JSON.stringify(sellerInfo))
  })
})

// 获取任意4个商品的简要信息，作为趋势列表
app.get(`/getTrends`, (req, res) => {
  connection.query(
    `select good_id,price,title,images from goodInfo where available=0 order by rand() limit 4`,
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

export default app