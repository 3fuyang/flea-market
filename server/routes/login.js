// Login页面的接口
const express = require('express')
const app = express()

const connection = require('../database/db')

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 接口1 用户登录：传入（账号、密码） 返回（登录结果）
app.post('/userlogin', (req, res) => {
  let doesExist = false
  connection.query(
    `select count(*) as cnt from userAccount where user_id = ? and mypassword = ?` ,
    [req.body.id, req.body.password],
    (err, result) => {
      if (err) throw err
      doesExist = (result[0].cnt > 0) ? true : false
      res.end(JSON.stringify(doesExist))
    }
  )
})

// 接口2 管理员登录：传入（账号、密码） 返回（登录结果）
app.post('/adminlogin', (req, res) => {
  let doesExist = false
  connection.query(
    `select count(*) as cnt from adminAccount where user_id = ? and mypassword = ?`, 
    [req.body.id, req.body.password],
    (err, result) => {
      if (err) throw err
      doesExist = (result[0].cnt > 0) ? true : false
      res.end(JSON.stringify(doesExist))
    }
  )
})

// 接口3 校验学号或手机号是否已被注册：传入（学号、手机号） 返回（是否已被注册）
app.post('/isrepeated', (req, res) => {
  let isRepeated = false
  connection.query(
    `select count(*) as cnt from userAccount where user_id = ? or telnum = ?`, 
    [req.body.id, req.body.telnum],
    (err, result) => {
      if (err) throw err
      isRepeated = (result[0].cnt > 0) ? true : false
      res.end(JSON.stringify(isRepeated))
    }
  )
})

// 接口4 用户注册：传入（账号、密码、姓名、手机号、性别、学院、生日） 返回（null）
app.post('/register', (req, res) => {
  let newAccount = [
    req.body.user_id,
    req.body.mypassword,
    req.body.myname,
    req.body.telnum,
    req.body.gender,
    req.body.college,
    req.body.birthday,
    req.body.myname
  ]
  connection.query(
    "insert into userAccount(user_id,mypassword,real_name,telnum,gender,college,birthday,nickname) value(?,?,?,?,?,?,?,?)", 
    newAccount, 
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 接口5 校验学号和手机号是否已被注册且匹配：传入（学号、手机号） 返回（是否已被注册且匹配）
app.post('/idcoupletel', (req, res) => {
  let isCoupled = false
  connection.query(
    `select count(*) as cnt from userAccount where user_id = ? and telnum = ?`,
    [req.body.id, req.body.telnum],
    (err, result) => {
      if (err) throw err
      isCoupled = (result[0].cnt > 0) ? true : false
      res.end(JSON.stringify(isCoupled))
    }
  )
})

// 接口6 用户修改密码：传入（ID、新密码） 返回（null）
app.post('/modifypassword', (req, res) => {
  connection.query(
    `update userAccount set mypassword = ? where user_id = ?`,
    [req.body.newpassword, req.body.id],
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

module.exports = app 