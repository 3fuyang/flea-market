// Confirm 页面
import express from 'express'
import connection from '../../database/db'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 获取买家姓名、手机号
app.get(`/getBuyerInfo/:user_id`, (req, res) => {
  connection.query(
    `select real_name,telnum from userAccount where user_id=?`,
    [req.params.user_id],
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 获取商品信息
app.post(`/goodsToConfirm`, (req, res) => {
  const promises: any[] = []
  req.body.forEach((item: any) => {
    promises.push(new Promise((resolve) => {
      connection.query(
        `select good_id,title,price,images,seller_id from goodInfo where good_id=? and available=0;
         select nickname from userAccount where user_id=(select seller_id from goodInfo where good_id=? and available=0)`,
         [item, item],
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

// 生成订单
app.post(`/generateOrder`, (req, res) => {
  const {buyer, seller, goodID, price, generatedTime, stat} = req.body
  // 向orderData插入新订单，在goodInfo中更新商品为不可访问，从买家的shoppingCart中删除商品
  connection.query(
    `insert into orderData(buyer, seller, good_id, price, generated_time, stat) values (?, ?, ?, ?, ?, ?);
     update goodInfo set available=1 where good_id=?;
     delete from shoppingCart where good_id=? and user_id=?`,
     [buyer, seller, goodID, price, generatedTime, stat, goodID, goodID, buyer],
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

export default app