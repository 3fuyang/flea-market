// Security页面的接口
import express from 'express'
import connection from '../../database/db'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 接口9 获取绑定手机号: 传入（用户id） 返回（绑定手机号）
app.get('/usertel/:user_id', (req, res) => {
    connection.query(
      `select telnum from userAccount where user_id=?`,
      [req.params.user_id],
      (err, result) => {
        if (err) throw err
        res.end(JSON.stringify(result[0].telnum))  
      }
  )
})

// 接口10 修改绑定手机：传入（用户ID，新手机号） 返回（null）
app.post('/modifytel',(req,res) => {
  connection.query(
    `update userAccount set telnum = ? where user_id = ?`,
    [req.body.newtel, req.body.id],
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

export default app