/* Trade 页面 */
import express from 'express'
import connection from '../../database/db'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 获取买家昵称，头像
app.get(`/getBuyerAvatarAndName/:user_id`, (req, res) => {
  connection.query(
    `select nickname,avatar from userAccount where user_id=?`,
    [req.params.user_id],
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 获取卖出的订单
app.get(`/getSoldOrders/:user_id`, (req, res) => {
  let data: any
  const promises: any[] = []
  new Promise((resolve, reject) => {
    connection.query(
      `select * from orderData where seller=? order by generated_time desc`,
      [req.params.user_id],
      (err, result) => {
        if (err) reject(err)
        data = JSON.parse(JSON.stringify(result))
        resolve('')
      }
    )
  })
    .then(() => {
      for(let item of data){
        promises.push(
          new Promise((resolve) =>{
            connection.query(
              `select title,images from goodInfo where good_id = ?;
               select nickname from userAccount where user_id = ?`,
               [item.good_id, item.buyer],
              (err, result) => {
                if(err) throw err
                const separatedResult = JSON.parse(JSON.stringify(result)).flat(2)
                result = Object.assign(separatedResult[0], separatedResult[1])
                for(let property in result){
                  item[property] = result[property]
                }
                resolve('')
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

// 拒接订单
app.post(`/rejectOrder`, (req, res) => {
  connection.query(
    `update orderData set stat='已取消' where order_id=?;
     update goodInfo set available=0 where good_id=(select good_id from orderData where order_id=?)`,
     [req.body.orderID, req.body.orderID],
     (err, result) => {
       if (err) throw err
       res.end(JSON.stringify(result))
     }
  )
})

export default app