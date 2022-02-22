/* eslint-disable */

//搭建服务器
var express = require('express')
var app = express()
var api = require('./api')
app.use('/api',api)
var server = app.listen(8082,function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Server has running at http://%s:%s',host,port)
})