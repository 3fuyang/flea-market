// Info页面的接口
const express = require('express')
const app = express()

const connection = require('../../database/db')

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 获取用户信息
app.get('/getUserInfo/:user_id', (req, res) => {
  connection.query(
    `select * from userAccount where user_id ='${req.params.user_id}'`,
    (err, result) => {
      if(err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 修改用户信息
app.post('/modifyUserInfo', (req, res) => {
  connection.query(
    `update userAccount set 
    nickname='${req.body.nickName}',
    biography='${req.body.selfIntro}',
    college='${req.body.college}',
    gender='${req.body.gender}',
    birthday='${req.body.birthday}'
    where user_id='${req.body.userID}'`,
    (err, result) => {
      if(err) throw err
      res.end(JSON.stringify(result))  
    }
  )
})

module.exports = app