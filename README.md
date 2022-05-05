# TJ flea

一个基于 <span style="color: #42D392;">Vue</span> 和 <span style="color: #CA3430;">Express</span> 的经典<span style="text-decoration: line-through">土味</span>的二手交易平台项目<span style="text-decoration: line-through">屎山</span>

## 技术栈

+ 前端：Vue 3 + TypeScript + Pinia + Element Plus + Naive UI
+ 后端：Express + MySQL

## 运行方法

### 后端

后端`/database/db.js`中的数据库配置请根据自己的实际情况修改，目录中提供了数据库的DDL语句。

```
# 进入后端根目录
cd server

# 安装依赖
npm install

# 运行后端
node(nodemon) app.js
```

### 前端

```
# 进入项目根目录
npm install

# 运行前端
npm run dev
```

## 开发所遇问题与解决方案

### Highlights

#### css-doodle 生成图案用作背景

todo

#### pinia 和动态路由鉴权

todo

#### Promise.all() 处理 connection.query

todo

#### 聊天窗口的滚动条初始化置底

使用`nextTick()`在聊天角色变化时操作滚动条，在此基础上，一个更自动化的设想是对滚动条置底进行监听，检测到置底后便一直置底，直到检测到上滑的操作。

### Bugs

#### 地址栏输入url或刷新页面导致 Vue Router 失效

#### 文件上传的请求头设置

todo

#### 为缩略图添加鼠标事件无效

在 Vue 组件中使用`document.querySelector`或者其他捕获 DOM 元素的方法时，捕获范围为**整个页面**，导致一个页面内所有商品媒体对象的缩略图共享一个目前索引。

#### 修改引用类型的响应式数据导致组件陷入 update 的无限循环

使用调试钩子`onRenderTracked`和`onRenderTriggered`发现问题。

#### 无 TypeScript 版本的第三方库的类型声明

新建`@/types/module.d.ts`，加入`declare`对第三方模块进行声明，并在`ts.config.json`中添加`"include": ["types/**/*.ts"]`。

#### Pinia 持久化存储

`pinia-plugin-persist`在另一个 demo 中能用，但本项目里 doesn't work，改为使用`pinia-plugin-persistedstate`。

#### 打包时配置 rollup.js 对包进行 split

todo

## 项目架构

```

flea-market // 前端根目录
├─ .git
├─ .gitignore
├─ env.d.ts
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
├─ README.md
├─ server // 后端根目录
│  ├─ app.js  // 入口文件
│  ├─ database  // 数据库连接
│  ├─ flea_now.sql  // DDL
│  ├─ flea_old.sql
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public  // 图片
│  └─ routes  // 路由
├─ src
│  ├─ App.vue // 应用实例
│  ├─ assets  // 字体、背景图片
│  │  ├─ fonts
│  ├─ components  // 组件
│  ├─ main.ts // 入口
│  ├─ router  // 路由
│  │  └─ index.ts
│  ├─ stores  // 状态管理
│  │  └─ user.ts
│  ├─ types  // 类型定义
│  └─ views // 视图
├─ tsconfig.json
├─ tsconfig.vite-config.json
└─ vite.config.ts // 配置

```
