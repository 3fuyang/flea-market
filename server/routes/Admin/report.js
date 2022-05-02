// DealingReports页面的接口
const express = require('express')
const app = express()

const connection = require('../../database/db')

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 获取管理员昵称
app.get(`/getAdminName/:admin_id`, (req, res) => {
  connection.query(
    `select nickname from adminAccount where user_id='${req.params.admin_id}'`,
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 获取未处理的举报列表
app.post(`/getReports`, (req, res) => {
  let data
  const promises = []
  new Promise((resolve, reject) => {
    connection.query(
      `select order_id,reason,report_time,stat from reportData where stat='待处理' order by report_time desc`,
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
              `select buyer,seller,good_id from orderData where order_id = '${item.order_id}';
               select title from goodInfo where good_id=(select good_id from orderData where order_id='${item.order_id}')`,
              (err, result) => {
                if(err) throw err
                let raw = JSON.parse(JSON.stringify(result)).flat(2)
                let anotherHalf = Object.assign(raw[0], raw[1])
                for(let property in anotherHalf){
                  item[property] = anotherHalf[property]
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

// 封禁被举报用户
app.post(`/banAccusedAccount`, (req, res) => {
  connection.query(
    `update userAccount set available='1' where user_id='${req.body.userID}';
     update reportData set reply='${req.body.reply}',reply_time='${req.body.replyTime}',replyer='${req.body.replyer}' where order_id='${req.body.orderID}'`,
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 修改被举报订单的举报状态
app.post(`/modifyOrderReported`, (req, res) => {
  connection.query(
    `update orderData set reported='${req.body.reported}' where order_id='${req.body.orderID}'`,
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 驳回举报
app.post(`/refuseReport`, (req, res) => {
  connection.query(
    `update reportData set reply='${req.body.reply}',reply_time='${req.body.replyTime}',replyer='${req.body.replyer}',stat='已驳回' where order_id='${req.body.orderID}';`,
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

module.exports = app