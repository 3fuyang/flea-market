/* Chat 页面 */
const express = require('express')
const events = require('events')
const EventEmitter = new events.EventEmitter()
const app = express()

const connection = require('../../database/db')

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 接口18 获取与用户有消息的对象列表：传入（用户ID）  返回（对方用户列表：对方ID）
app.get('/getChatOponent/:user_id', (req, res) => {
  let finalResult
  EventEmitter.on('done', () => {
    const promises = []
    finalResult.forEach((id) => {
      promises.push(
        new Promise((resolve) => {
          connection.query(
            `select nickname,avatar from userAccount where user_id = '${id}'`,
            (err, result) => {
              if(err) throw err
              resolve({
                user_id: id,
                nickname: JSON.parse(JSON.stringify(result))[0]['nickname'],
                avatar: JSON.parse(JSON.stringify(result))[0]['avatar']
              })
            }
          )
        })
      )
    })
    Promise.all(promises)
      .then(result => res.end(JSON.stringify(result)))
  })  
  new Promise((resolve, reject) => {
    connection.query(
      "select a_user_id,date_time from chatRecord where b_user_id ='"+ req.params.user_id + "' order by date_time desc",
      (err, result) => {
        if (err) throw err
        result = JSON.parse(JSON.stringify(result))
        resolve(result)  
      }
    )
  })
    .then((halfResult) => {
      connection.query(
        "select b_user_id,date_time from chatRecord where a_user_id ='"+ req.params.user_id + "'",
        (err, result) => {
          if(err) throw err
          result = halfResult
            .concat(JSON.parse(JSON.stringify(result)))
            .sort((first, second) => 
              Date.parse(second.date_time.substr(0, 19)) - Date.parse(first.date_time.substr(0, 19))
            )
          finalResult = Array.from(new Set(result.map(item => item.a_user_id || item.b_user_id)))
          EventEmitter.emit('done')
        }
      )
    })
})

// 接口19 获取与某个用户的消息列表
app.get('/getMessage/:a_user_id/:b_user_id',(req,res) => {
  // 较小的账号为 a_user_id , 较大的账号为 b_user_id
  if(req.params.a_user_id > req.params.b_user_id){
    let temp = req.params.b_user_id
    req.params.b_user_id = req.params.a_user_id
    req.params.a_user_id = temp
  }
  connection.query(
    "select * from chatrecord where a_user_id ='"+ req.params.a_user_id + "' and b_user_id ='" + req.params.b_user_id + "' order by date_time asc",
    (err, result) =>{
      if (err) throw err
      res.end(JSON.stringify(result))    
    }
  )
})

// 接口20 向某个用户发送消息
app.post('/sendMessage',(req,res) => {
  let new_message = [req.body.a_user_id, req.body.b_user_id, req.body.speaker, req.body.date_time, req.body.details]
  connection.query(
    "insert into chatRecord(a_user_id,b_user_id,speaker,date_time,details) value(?,?,?,?,?)",
    new_message,
    (err,result) => {
      if(err) throw err
      res.end(JSON.stringify(result)) 
    }
  )
})

module.exports = app