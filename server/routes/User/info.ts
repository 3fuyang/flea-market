// Info页面的接口
import express from 'express'
import multer from 'multer'
import fs from 'fs'
import connection from '../../database/db'
import { FileInfo } from './goods'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 获取用户信息
app.get('/getUserInfo/:user_id', (req, res) => {
  connection.query(
    `select * from userAccount where user_id = ?`,
    [req.params.user_id],
    (err, result) => {
      if(err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 修改用户信息
app.post('/modifyUserInfo', (req, res) => {
  const r = req.body
  connection.query(
    `update userAccount set 
    nickname=?,
    biography=?,
    college=?,
    gender=?,
    birthday=?
    where user_id=?`,
    [r.nickName, r.selfIntro, r.college, r.gender, r.birthday, r.userID],
    (err, result) => {
      if(err) throw err
      res.end(JSON.stringify(result))  
    }
  )
})

// 上传头像
app.post(
  '/uploadAvatar',
  multer({
    // 设置文件存储路径
    dest: './public/avatars',
  }).array('file', 1),  // 注意：这里的字段必须与前端formdata的字段名相同
  (req: any, res, next) => {
    const fileInfoList = []
    let name: string = ''
    req.files.forEach((file: any) => {
      let fileInfo = new FileInfo()
      let path = './public/avatars/' + Date.now().toString() + '_' + file.originalname
      fs.renameSync('./public/avatars/' + file.filename, path)
      // 获取文件基本信息
      fileInfo.type = file.mimetype
      fileInfo.name = file.originalname
      name = fileInfo.name
      fileInfo.size = file.size
      fileInfo.path = path
      fileInfoList.push(fileInfo)
    })
    connection.query(
      `update userAccount set avatar=? where user_id=${req.get('userID')}`,
      name,
      (err, result) => {
        if (err) throw err
        res.end(JSON.stringify(result))
      }
    )    
  }
)

export default app