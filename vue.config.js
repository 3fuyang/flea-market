module.exports = {
  //设置前端跨域访问后端
  devServer: {
    disableHostCheck: true,
    port: 8090,
    proxy: {
      '/api': {
        target: 'http://106.15.78.201:8082/api',
        ws: true,
        changeOrigin: true,
        pathRewrite:{  // 路径重写，把api接口替换为''
          '^/api': ''  
        }
      },
    }
  }
}