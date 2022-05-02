# flea-market

## Front-end
```
npm install
npm run dev
```

### Back-end
```
cd server
npm install
node app.js
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
flea-market // 前端根目录
├─ .git
├─ .gitignore
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ favicon.ico
├─ README.md
├─ server // 后端根目录
│  ├─ app.js  // 入口文件
│  ├─ database  // 数据库连接
│  │  └─ db.js
│  ├─ flea_now.sql  // DDL
│  ├─ flea_old.sql
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public  // 图片
│  │  ├─ avatars
│  │  └─ images
│  └─ routes  // 路由
│     ├─ Admin
│     │  └─ report.js
│     ├─ details.js
│     ├─ home.js
│     ├─ login.js
│     ├─ result.js
│     └─ User
│        ├─ chat.js
│        ├─ confirm.js
│        ├─ favorite.js
│        ├─ goods.js
│        ├─ history.js
│        ├─ info.js
│        ├─ order.js
│        ├─ security.js
│        ├─ shoppingcart.js
│        └─ trade.js
├─ src
│  ├─ App.vue // 应用实例
│  ├─ assets  // 字体、背景图片
│  │  ├─ fonts
│  ├─ components  // 组件
│  │  ├─ Admin
│  │  │  └─ HelloBar.vue
│  │  ├─ Confirm
│  │  │  ├─ GoodMediaObject.vue
│  │  │  └─ PayQRCode.vue
│  │  ├─ Goods
│  │  │  ├─ Comments.vue
│  │  │  ├─ GoodSellerPanel.vue
│  │  │  ├─ GoodsInfoModal.vue
│  │  │  ├─ GoodsListTable.vue
│  │  │  └─ UploadGoodModal.vue
│  │  ├─ Order
│  │  │  ├─ EvaluateModal.vue
│  │  │  ├─ OrderListTable.vue
│  │  │  └─ ReportModal.vue
│  │  ├─ Result
│  │  │  ├─ FilterTable.vue
│  │  │  ├─ GoodCard.vue
│  │  │  ├─ RecommendList.vue
│  │  │  └─ ResultList.vue
│  │  ├─ TopNav.vue
│  │  ├─ Trade
│  │  │  └─ TradeOrders.vue
│  │  └─ UserInfo
│  │     ├─ CommentList.vue
│  │     └─ InfoPanel.vue
│  ├─ decrepted // 废弃组件
│  ├─ main.js // 入口
│  ├─ router  // 路由
│  │  └─ index.js
│  └─ views // 视图
│     ├─ Administrator
│     │  └─ DealingReports.vue
│     ├─ Details.vue
│     ├─ Login.vue
│     ├─ NewHome.vue
│     ├─ NewResult.vue
│     ├─ Report.vue
│     └─ User
│        ├─ Chat.vue
│        ├─ Favorite.vue
│        ├─ Goods.vue
│        ├─ History.vue
│        ├─ Info.vue
│        ├─ NewConfirm.vue
│        ├─ Order.vue
│        ├─ Security.vue
│        ├─ ShoppingCart.vue
│        └─ Trade.vue
└─ vite.config.js // 配置

```