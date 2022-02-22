/* eslint-disable */

var express = require('express')
var events = require('events')
var app = express()
var models = require('./db')
var mysql = require('mysql')
var connection = mysql.createConnection(models.mysql)
connection.connect()


app.use(express.json()); 
app.use(express.urlencoded({extended:  false}));

/* Login 页面 */

// 接口1 用户登录：传入（账号、密码） 返回（登录结果）
app.post('/userlogin',(req,res) => {
  var doesExist = false;
  connection.query("select count(*) as cnt from userAccount where user_id = '" + req.body.id + "' and mypassword = '" + req.body.password + "'", (err,result) => {
    if (err) throw err
    doesExist = (result[0].cnt > 0)?true:false
    res.end(JSON.stringify(doesExist))
  })
})

// 接口2 管理员登录：传入（账号、密码） 返回（登录结果）
app.post('/adminlogin',(req,res) => {
  var doesExist = false;
  connection.query("select count(*) as cnt from adminAccount where admin_id = '" + req.body.id + "' and mypassword = '" + req.body.password + "'", (err,result) => {
    if (err) throw err;
    doesExist = (result[0].cnt > 0)?true:false;
    res.end(JSON.stringify(doesExist));
  })
})

// 接口3 校验学号或手机号是否已被注册：传入（学号、手机号） 返回（是否已被注册）
app.post('/isRepeated',(req,res) => {
  var isRepeated = false;
  connection.query("select count(*) as cnt from userAccount where user_id = '" + req.body.id + "' or telnum = '" + req.body.telnum + "'", (err,result) => {
    if (err) throw err;
    isRepeated = (result[0].cnt > 0)?true:false;
    res.end(JSON.stringify(isRepeated));
  })
})

// 接口4 用户注册：传入（账号、密码、姓名、手机号、性别、学院、生日） 返回（null）
app.post('/register',(req,res) => {
  let newAccount = [req.body.user_id,req.body.mypassword,req.body.myname,req.body.telnum,req.body.gender,req.body.college,req.body.birthday];
  connection.query("insert into userAccount(user_id,mypassword,myname,telnum,gender,college,birthday) value(?,?,?,?,?,?,?)",newAccount,(err,result)=>{
    if (err) throw err;
    res.end(JSON.stringify(result));
  })
})

// 接口5 校验学号和手机号是否已被注册且匹配：传入（学号、手机号） 返回（是否已被注册且匹配）
app.post('/',(req,res) => {
  var isCoupled = false;
  connection.query("select count(*) as cnt from userAccount where user_id = '" + req.body.id + "' and telnum = '" + req.body.telnum + "'", (err,result) => {
    if (err) throw err;
    isCoupled = (result[0].cnt > 0)?true:false;
    res.end(JSON.stringify(isCoupled));
  })
})

// 接口6 用户修改密码：传入（ID、新密码） 返回（null）
app.post('/modifyPassword',(req,res) => {
  connection.query("update userAccount set mypassword = '" + req.body.newpassword + "' where user_id ='" + req.body.id + "'",(err,result)=>{
    if (err) throw err;
    res.end(JSON.stringify(result));
  })
})

/* Home 页面 */

// 接口7 主页信息：传入（用户ID）  返回（获取用户购物车中商品数量,进行中订单数,未评价订单数）
app.get('/homeinfo/:user_id', (req,res) => {
  let homeinfo = {shoppingCartNum: 0,notPaidNum: 0,notEvaluateNum: 0}
  connection.query("select count(*) as cnt from shoppingcart where " + "user_id='" + req.params.user_id + "'", (err,result) => {
    if (err) throw err
    homeinfo.shoppingCartNum= result[0].cnt;
  });
  connection.query("select count(*) as cnt_ from orders where buyer_id='" + req.params.user_id + "' and status='进行中'",(err,result)=>{
    if (err) throw err
    homeinfo.notPaidNum = result[0].cnt_;
  })
  connection.query("select count(*) as cntt from orders where buyer_id='" + req.params.user_id + "' and status='未评价'",(err,result)=>{
    if (err) throw err
    homeinfo.notEvaluateNum = result[0].cntt;
    res.end(JSON.stringify(homeinfo));  
  })
})

// 接口8 获取商品信息：传入（商品ID） 返回（商品标题、价格、图片url）
app.get('/goodsBriefInfo/:goods_id',(req,res)=>{
  connection.query("select goods_title,price,url from goods where goods_id='" + req.params.goods_id + "'", (err,result) => {
    if (err) throw err
    res.end(JSON.stringify(result)); 
  });
})

/* Security 页面 */

// 接口9 获取绑定手机号: 传入（用户id） 返回（绑定手机号）
app.get('/usertel/:user_id', (req,res) => {
  connection.query("select telnum from userAccount where user_id='" + req.params.user_id + "'",(err,result)=>{
    if (err) throw err
    res.end(JSON.stringify(result[0].telnum));  
  })
})

// 接口10 修改绑定手机：传入（用户ID，新手机号） 返回（null）
app.post('/modifyTel',(req,res) => {
  connection.query("update userAccount set telnum = '" + req.body.newtel + "' where user_id ='" + req.body.id + "'",(err,result)=>{
    if (err) throw err;
    res.end(JSON.stringify(result));
  })
})

/* History 页面 */

// 接口11 获取浏览记录：传入（用户ID） 返回（浏览记录数据:商品ID、浏览日期）
app.get('/getTrack/:user_id',(req,res) => {
  connection.query("select * from track where user_id = '" + req.params.user_id + "' order by day_time desc",(err,result)=>{
    if (err) throw err;
    res.end(JSON.stringify(result));    
  })
})

// 接口12 获取商品信息：传入（商品ID） 返回 （商品标题、价格）
app.get('/getBriefInfo/:goods_id',(req,res) => {
  connection.query("select goods_title,price from goods where goods_id ='" + req.params.goods_id + "'",(err,result)=>{
    if (err) throw err
    res.end(JSON.stringify(result));
  })
})

// 接口13 清空浏览记录：传入（用户ID） 返回（null）
app.get('/clearTrack/:user_id',(req,res) => {
  connection.query("delete from track where user_id ='" + req.params.user_id + "'",(err,result)=>{
    if (err) throw err
    res.end(JSON.stringify(result));
  })
})

/* Favorite 页面 */

// 接口14 获取收藏夹：传入（用户ID） 返回（收藏夹数据:商品ID）
app.get('/getFavorite/:user_id',(req,res) => {
  connection.query("select * from favorite where user_id = '" + req.params.user_id + "'",(err,result)=>{
    if (err) throw err;
    res.end(JSON.stringify(result));    
  })
})

// 接口15 取消收藏某商品：传入（用户ID，商品ID） 返回（null）
app.get('/cancelFavorite/:user_id/:goods_id',(req,res) => {
  connection.query("delete from favorite where user_id ='" + req.params.user_id + "' and goods_id ='" + req.params.goods_id + "'",
  (err,result)=>{
    if (err) throw err
    res.end(JSON.stringify(result));
  })
})

/* ShoppingCart 页面 */

// 接口16 获取购物车：传入（用户ID） 返回（购物车数据:商品ID）
app.get('/getCart/:user_id',(req,res) => {
  connection.query("select * from shoppingcart where user_id = '" + req.params.user_id + "'",(err,result)=>{
    if (err) throw err;
    res.end(JSON.stringify(result));    
  })
})

// 接口17 从购物车移除某商品：传入（用户ID，商品ID） 返回（null）
app.get('/removeCart/:user_id/:goods_id',(req,res) => {
  connection.query("delete from shoppingcart where user_id ='" + req.params.user_id + "' and goods_id ='" + req.params.goods_id + "'",
  (err,result)=>{
    if (err) throw err
    res.end(JSON.stringify(result));
  })
})

/* Chat 页面 */

// 接口18 获取与用户有消息的对象列表：传入（用户ID）  返回（对方用户列表：对方ID）
app.get('/getChatOponent/:user_id',(req,res) => {
  connection.query("select distinct user_a_id from chat where user_b_id ='"+ req.params.user_id + "'",(err,result) =>{
    if (err) throw err
    res.end(JSON.stringify(result));    
  })
})

// 接口19 获取与某个用户的消息列表
app.get('/getMessage/:user_a_id/:user_b_id',(req,res) => {
  // 较小的账号为 user_a_id , 较大的账号为 user_b_id
  if(req.params.user_a_id > req.params.user_b_id){
    let temp = req.params.user_b_id;
    req.params.user_b_id = req.params.user_a_id;
    req.params.user_a_id = temp;
  }
  connection.query("select * from chat where user_a_id ='"+ req.params.user_a_id + "' and user_b_id ='" + req.params.user_b_id + "'",(err,result) =>{
    if (err) throw err
    res.end(JSON.stringify(result));    
  })
})

// 接口20 向某个用户发送消息
app.post('/sendMessage',(req,res) => {
  let new_message=[req.body.user_a_id,req.body.user_b_id,req.body.speaker,req.body.day_time,req.body.details]
  connection.query("insert into chatrecord(user_a_id,user_b_id,speaker,day_time,details) value(?,?,?,?,?)",new_message,
  function(err,result){
      if(err) throw err
      res.end(JSON.stringify(result)); 
  })
})

/* Detail 页面 */
// 接口21 获取商品详情
app.get('/getGoods/:goods_id',(req,res) => {
  connection.query("select * from goods where goods_id ='"+ req.params.goods_id + "'" ,(err,result) =>{
    if (err) throw err
    res.end(JSON.stringify(result));    
  })
})

// 接口22 获取卖家昵称
app.get('/getSellerNickname/:user_id',(req,res) => {
  connection.query("select nickname from useraccount where user_id ='"+ req.params.user_id + "'" ,(err,result) =>{
    if (err) throw err 
    res.end(JSON.stringify(result));
  });
})

// 接口23 获取卖家销售订单数
app.get('/getSellNum/:user_id',(req,res) => {
  connection.query("select count(*) as cnt from orders where seller_id ='"+ req.params.user_id + "'" ,(err,result) =>{
    if (err) throw err  
    res.end(JSON.stringify(result)); 
  });  
})


module.exports = app    