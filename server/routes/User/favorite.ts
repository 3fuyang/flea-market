// Favorite 页面
import express from 'express'
import connection from '../../database/db'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 检查是否收藏商品
app.post('/checkCollected', (req, res) => {
  connection.query(
    `select count(*) as cnt from collectionBox where user_id = ? and good_id = ?`,
    [req.body.userID, req.body.goodID],
    (err, result) => {
      if(err) throw(err)
      if(JSON.parse(JSON.stringify(result))[0].cnt > 0){
        res.end('true')
      }else{
        res.end('false')
      }
    }
  )
})

// 收藏商品
app.post('/collectGood', (req, res) => {
  const input = [req.body.userID, req.body.goodID, req.body.time]
  connection.query(
    "insert into collectionBox(user_id,good_id,day_time) value(?,?,?)",
    input,
    (err, result) => {
      if(err) throw err
      res.end(JSON.stringify(result))
    }
  )
})

// 接口14 获取收藏夹：传入（用户ID） 返回（收藏夹数据:商品ID）
app.get('/getCollection/:user_id',(req,res) => {  
  let data: any
  const promises: any[] = []
  new Promise((resolve, reject) => {
    connection.query(
      `select * from collectionBox where user_id = ? order by day_time desc`,
      [req.params.user_id],
      (err, result) => {
        if (err) throw err
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
              `select title,price,images from goodInfo where good_id = ?`,
              [item.good_id],
              (err, result) => {
                if(err) throw err
                result = JSON.parse(JSON.stringify(result))[0]
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

// 接口15 取消收藏某商品：传入（用户ID，商品ID） 返回（null）
app.post('/cancelCollection',(req,res) => {
  connection.query(
    `delete from collectionBox where user_id = ? and good_id = ?`,
    [req.body.userID, req.body.goodID],
    (err, result) => {
      if (err) throw err
      res.end(JSON.stringify(result));
    }
  )
})

export default app