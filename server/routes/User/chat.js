/* Chat 页面 */
const express = require('express')
const app = express()

const connection = require('../../database/db')

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 接口18 获取与用户有消息的对象列表：传入（用户ID）  返回（对方用户列表：对方ID）
app.get('/getChatOponent/:user_id', (req, res) => {
  connection.query(
    "select distinct user_a_id from chatrecord where user_b_id ='"+ req.params.user_id + "'",
    (err, result) =>{
      if (err) throw err
      res.end(JSON.stringify(result))    
    }
  )
})

// 接口19 获取与某个用户的消息列表
app.get('/getMessage/:user_a_id/:user_b_id',(req,res) => {
  // 较小的账号为 user_a_id , 较大的账号为 user_b_id
  if(req.params.user_a_id > req.params.user_b_id){
    let temp = req.params.user_b_id
    req.params.user_b_id = req.params.user_a_id
    req.params.user_a_id = temp
  }
  connection.query(
    "select * from chatrecord where user_a_id ='"+ req.params.user_a_id + "' and user_b_id ='" + req.params.user_b_id + "'",
    (err, result) =>{
      if (err) throw err
      res.end(JSON.stringify(result))    
    }
  )
})

// 接口20 向某个用户发送消息
app.post('/sendMessage',(req,res) => {
  let new_message=[req.body.user_a_id,req.body.user_b_id,req.body.speaker,req.body.day_time,req.body.details]
  connection.query(
    "insert into chatrecord(user_a_id,user_b_id,speaker,day_time,details) value(?,?,?,?,?)",
    new_message,
    (err,result) => {
      if(err) throw err
      res.end(JSON.stringify(result)) 
    }
  )
})

module.exports = app