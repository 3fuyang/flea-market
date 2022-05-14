/* Goods 页面 */
const express = require('express')
const app = express()
const multer = require('multer')
const fs = require('fs')
const connection = require('../../database/db')

app.use(express.json())
app.use(express.urlencoded({extended:  false}))

// 获取上架中商品
app.get('/onShelfGoods/:user_id', (req, res) => {
  new Promise((resolve, reject) => {
    connection.query(
      `select * from goodInfo where seller_id=? and available='0'`,
      [req.params.user_id],
      (err, result) => {
        if(err) throw err
        resolve(JSON.parse(JSON.stringify(result)))
      }
    )
  })
    .then((halfResult) => {
      const promises = []
      halfResult.forEach(item => {
        promises.push(
          new Promise((resolve, reject) => {
            connection.query(
              `select count(*) as cnt1 from collectionBox where good_id=?;
               select count(*) as cnt2 from browseTrack where good_id=?`,
               [item.good_id, item.good_id],
              (err, result) => {
                if(err) throw err
                let data = JSON.parse(JSON.stringify(result))
                item.likes = JSON.parse(JSON.stringify(data[0]))[0].cnt1
                item.browsed = JSON.parse(JSON.stringify(data[1]))[0].cnt2
                resolve(item)
              }
            )
          })
        )
      })
      Promise.all(promises)
        .then(result => {
          res.end(JSON.stringify(result))
        })
    })
})

// 获取已售出商品
app.get('/soldGoods/:user_id', (req, res) => {
  new Promise((resolve, reject) => {
    connection.query(
      `select * from goodInfo where seller_id=? and available='1'`,
      [req.params.user_id],
      (err, result) => {
        if(err) throw err
        resolve(JSON.parse(JSON.stringify(result)))
      }
    )
  })
    .then((halfResult) => {
      const promises = []
      halfResult.forEach(item => {
        promises.push(
          new Promise((resolve, reject) => {
            connection.query(
              `select count(*) as cnt1 from collectionBox where good_id=?;
               select count(*) as cnt2 from browseTrack where good_id=?`,
               [item.good_id, item.good_id],
              (err, result) => {
                if (err) throw err
                let data = JSON.parse(JSON.stringify(result))
                item.likes = JSON.parse(JSON.stringify(data[0]))[0].cnt1
                item.browsed = JSON.parse(JSON.stringify(data[1]))[0].cnt2
                resolve(item)
              }
            )
          })
        )
      })
      Promise.all(promises)
        .then(result => {
          res.end(JSON.stringify(result))
        })
    })
})

// 上传图片
app.post(
  '/uploadImage',
  multer({
    // 设置文件存储路径
    dest: './public/images',
  }).array('file', 3),  // 注意：这里的字段必须与前端formdata的字段名相同
  (req, res, next) => {
    const fileInfoList = []
    req.files.forEach((file) => {
      let fileInfo = {};
      let path = './public/images/' + Date.now().toString() + '_' + file.originalname
      fs.renameSync('./public/images/' + file.filename, path)
      // 获取文件基本信息
      fileInfo.type = file.mimetype
      fileInfo.name = file.originalname
      fileInfo.size = file.size
      fileInfo.path = path
      fileInfoList.push(fileInfo)
    })
    res.end(JSON.stringify(fileInfoList))
  }
)

// 上架新商品
app.post('/addGood', (req, res) => {
  connection.query(
    `insert into goodInfo(seller_id, price, category, good_name, title, keywords, campus, intro, detail, images, onshelf_time)
     value(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
     req.body,
     (err, result) => {
       if(err) throw err
       res.end(JSON.stringify(result))
     }
  )
})

// 修改上架中商品信息
app.post('/modifyGood', (req, res) => {
  connection.query(   
    `update goodInfo set price=?, category=?, good_name=?, 
     title=?, keywords=?, campus=?, intro=?,
     detail=?, images=? where good_id=?`,
     req.body,
     (err, result) => {
       if(err) throw err
       res.end(JSON.stringify(result))
     }
  )
})

module.exports = app