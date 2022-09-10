# TJ flea

Fwio

一个基于 `<span style="color: #42D392;">`Vue 和 `<span style="color: #CA3430;">`Express 的经典 `<span style="text-decoration: line-through">`土味的二手交易平台项目 `<span style="text-decoration: line-through">`屎山

## 技术栈

* 前端：Vue 3 + TypeScript + Pinia + Element Plus + Naive UI
* 后端：Express + MySQL + Socket.IO

Online Demo: [http://106.15.78.201:8084/](http://106.15.78.201:8084/)

## Changelog

> 2022/7/4 TypeORM 后端集成完毕，已经同步到生产模式。
>
> 2022/7/1 修复了编辑个人信息页面的日期选择校验bug，由于正在对接 TypeORM 后端，还未同步到生产模式。

## 运行方法

### 后端

后端 `/database/db.ts`中的数据库配置请根据自己的实际情况修改，目录中提供了数据库的DDL语句。

    # 进入后端根目录
    cd server
    
    # 安装依赖
    npm install
    
    # 运行后端
    # 直接运行ts
    ts-node(nodemon) app.ts
    # 运行转译后的js
    npm run build
    # 注意图片等资源
    cd dist
    node(nodemon) app.js

### 前端

    # 进入项目根目录
    npm install
    
    # 运行前端
    npm run dev

## 开发所遇问题与解决方案

### Highlights

#### 使用 Socket.IO 实现用户间实时聊天

项目的聊天功能其实就是**Web 实时通信问题**，分为两个阶段实现。

第一个阶段，使用古老的**短轮询**方式（short polling），即聊天页面初始化时就用 `window.setInterval`设置一个定时器，以每秒一次的频率向服务端请求数据，显然，不断地发送和关闭请求会为服务器造成较大的压力，而这之中的绝大多数请求是不必要的。

第二个阶段，使用 **WebSocket** 协议实现。项目使用 **[Socket.IO](https://socket.io/docs/v4/)** 框架，Socket.IO 是一个在客户端、服务端间建立低延迟、全双工、**基于事件**的连接的库，它构建在 WebSocket 协议之上，且提供了在需要时回退到**长轮询**（long polling）的额外保证。

**服务端**：在服务端开启了 Socket.IO 服务后，参考 Vue 3 响应式系统使用“**订阅--发布模式**”的设计，项目使用一个**桶** (bucket)来管理所有 socket 连接。

```typescript
type UserID = string
type SocketID = string
// 消息类型
interface Message {
  a_user_id: string
  b_user_id: string
  speaker: number
  date_time: string
  details: string
}

// WebSocket 连接桶
const sessionBucket = new Map<UserID, Set<SocketID>>()

// 每当建立socket连接时
io.on('connection', (socket) => {
    // 客户端使用额外头部userid在建立连接时返回用户ID
    let userID = socket.handshake.headers.userid
    // 在桶中获取该userID对应的连接集合
    let userSockets = sessionBucket.get(userID as UserID)
    if (!userSockets) {
        // 桶中不存在该userID对应的集合，新建集合
        sessionBuskct.set(userID as string, userSockets = new Set([socket.id]))
    } else {
        // 桶中存在该对应集合，将新socket连接加入集合
        userSockets.add(socket.id)
    }
  
    // 用户发送消息
    socket.on('send message', (msg: Message) => {
        // 将消息加入数据库
        // 对消息双方的socket连接，广播该消息
        const aSockets = sessionBucket.get(msg.a_user_id)
        const bSockets = sessionBucket.get(msg.b_user_id)
        const relatedSockets = [...(aSockets ? Array.from(aSockets) : []), ...(bSockets ? Array.from(bSockets) : [])]
        if (relatedSockets.length) {
          // 向相关连接发送消息
          io.to(relatedSockets).emit('deliver message', msg)
        }
    })
  
    socket.on('disconnect', () => {
    	// 断开连接时，从集合中删除该连接
    	(userSockets as Set<string>).delete(socket.id)
	})
})
```

**客户端**：由上可知，我们自定义了两个事件 `send message`和 `deliver message`，客户端需要对它们进行处理。

```typescript
import { io } from 'socket.io-client'

const socket = io(url, {
  // 使用额外头部传递userID
  extraHeaders: {
    'userid': userID.value
  }
})

// 发送消息
function handleSendMessage () {
      // 向 socket 连接传递"发送消息"事件
      new Promise(() => {
        socket.emit('send message', message)
      }).then(() => {
          // 获取消息列表
          getMessage()
        nextTick(() => {
            // 滚动到底部
            const scrollContainer = Array.from(document.getElementsByClassName('n-scrollbar-container'))[1]
            scrollContainer.scrollTop = scrollContainer.scrollHeight
        })
}

socket.on('deliver message', (msg) => {
	// 获取对话者 ID，将其移至对话者列表的顶端

    // 修改视图中的最新消息
  
  	// 如果目前的对话者正是发来消息的对话者，则更新消息列表

})
```

#### css-doodle 生成图案用作背景

[css-doodle](https://css-doodle.com/)是使用网格（grid）容器来生成艺术图案的一个 Web Component，本项目将其用作背景的方案是使用 `relative`和 `absolute`布局。

#### pinia 和动态路由鉴权

本项目的前端鉴权是通过动态路由(`addRoute`，`removeRoute`)和 Pinia 的全局状态管理实现的。

为 Router 添加全局导航守卫 `beforeEach`，在守卫中检查 pinia 的 store 中的 `identity`(用户身份)字段，根据该字段决定是否需要动态添加用户身份对应的路由，并删除特定路由(如登录)。

##### 循环加载的问题

为实现前端鉴权，本项目的 `@/router/index.ts`和 `@/store/user.ts`中出现了**模块循环加载**的情况（<span style="text-decoration: line-through;">现在没有了</span>），但最终却能正常工作，下面对这种经典情景进行了考察。

参考：[阮一峰 ES6 入门](https://www.bookstack.cn/read/es6-3rd/spilt.4.docs-module-loader.md)

**循环加载** (Circular dependency)指的是，`a`脚本的执行依赖 `b`脚本，而 `b`脚本的执行又依赖 `a`脚本。

###### CommonJS 模块

CommonJS 使用 `require`命令第一次加载脚本时，就会**执行整个脚本**，然后在**内存**生成一个对象。

```typescript
// Node.js 内部加载模块后生成的对象
{
    //...
    id: '...',	// 模块名
	exports: { ... },	// 模块输出的各个接口
	loaded: true,	// 该模块的脚本是否执行完毕
	//...  
}
```

以后需要使用该模块时，就会到上面的 `exports`属性中取值，即使再次执行 `require`命令，也不会再重新执行脚本，而是到**缓存**中取值。

所以，CommonJS 模块无论加载多少次，都只会在第一次加载时执行一次，以后再加载，就返回缓存中第一次执行的结果，除非手动清除系统缓存，属于**单例模式（Singleton）**。

CommonJS 模块的代码会在 `require`时**全部执行**，一旦出现某个模块被“循环加载“，就**只输出已经执行的部分**，还未执行的部分不会输出。

这里注意，ESM 和 CommonJS 的模块引入都是**同步的**（不包括 `import()`）。

所以，当发生循环加载时，内存中的 `exports`属性上便只有已经执行的代码的导出。

###### ESM 模块

ES6 Module 是**动态引用（传引用）**，如果使用 `import`从一个模块加载变量，那些变量**不会被缓存**，而是成为一个**指向被加载模块的引用**，需要开发者自己保证，真正取值时能够取到。

```js
// a.mjs
import { bar } from './b'
console.log('a.mjs')
console.log(bar)
export let foo = 'foo'

// b.mjs
import { foo } from './a'
console.log('b.mjs')
console.log(foo)
export let bar = 'bar'
```

这里执行 `node a.mjs`后，会出现：

```shell
$ node --experimental-modules a.mjs
b.mjs
ReferenceError: foo is not defined
```

流程：执行 `a.mjs`，发现引入了 `b.mjs`，所以会**优先执行 `b.mjs`**，然后再执行 `a.mjs`。执行 `b.mjs`时，已知它从 `a.mjs`中引入了 `foo`接口，此时不会去执行 `a.mjs`（估计是因为 a.mjs 已经在执行栈中），而是**认为这个接口已经存在**，**继续往下执行**（这是执行到 `import`语句时的情况，所以此时不会报错）。直到打印 `foo`时，发现该接口未定义，因此报错。

#### Promise.all() 处理 connection.query

适用于从一张表（通常是外键关系表）获取主码，再从被关系表中取得详细信息的情景（比如从收藏夹中取得商品的 ID 数组，再根据该数组从商品表中取得标题、图片等详细信息），是一个十分实用的 boilerplate。

```js
// 基本结构
app.get(url, (req, res) => {
    new Promise((resolve) => {
        // query...
        // 取得主键
        resolve(PKs)
    })
    .then((PKs) => {
        const promises = []
        PKs.forEach((PK) => {
            promises.push(
            	new Promise((resolve) => {
                    // query...
                    resolve(Data)
                })
            )
        })
        Promise.all(promises)
        	.then((Datas) => {
            // Datas 存储所有条目的详细信息
            res.end(JSON.stringify(Datas))
        })
    })
})

// 一个例子，获取上架中商品的信息
app.get('/onShelfGoods/:user_id', (req, res) => {
  new Promise((resolve, reject) => {
    connection.query(
      `select * from goodInfo where seller_id='${req.params.user_id}' and available='0'`,
      (err, result) => {
        if (err) throw err
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
              `select count(*) as cnt1 from collectionBox where good_id='${item.good_id}';
               select count(*) as cnt2 from browseTrack where good_id='${item.good_id}'`,
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
```

#### 聊天窗口的滚动条初始化置底

##### 参考资料

* Element.scrollTop：一个元素的内容垂直滚动的像素数(一个**非整数**)，其值是这个元素的**内容顶部**到其视口可见内容（**的顶部**）的距离的度量。当一个元素的内容没有产生垂直方向的滚动条，那么它的 `scrollTop`值为 0。

  * 因为 `scrollTop`是三个属性中**唯一一个可写**的，所以要注意其赋值规范：
  * 如果一个元素不能被滚动（例如，它没有溢出，或者这个元素有一个"\*\*non-scrollable"\*\*属性）， `scrollTop`将被设置为 `0`。
  * 设置 `scrollTop`的值小于0，`scrollTop` 被设为 `0`
  * **如果设置了超出这个容器可滚动的值, `scrollTop` 会被设为最大值。**

<!---->

* Element.scrollHeight：一个元素的**总高度**（**整数**），包括由于溢出而无法展示在网页的不可见部分。

![img](README.assets/scrollheight.png)

* Element.clientHeight：只读属性，是一个**整数**，即元素视口可见内容的高度。

##### 解决方案

* 在两种情况下，需要操作滚动条到底部：

  * 切换聊天对象时；
  * 未切换聊天对象，但滚动条已经处于底部，且有新消息时。
* 滚动条置底的方法：

```js
const el = document.getElementById('...')

// 将元素的 scrollTop 赋值为超出最大值的值(scrollHeight - clientHeight)，则其会转化为可能的最大值，即将滚动条置底，这里使用 scrollHeight 即可。
el.scrollTop = el.scrollHeight
```

* 如何判断滚动条已在底部？参考上面 MDN 的解答，比较 `scrollHeight - (scrollTop + clientHeight)`与一个较小的阈值(考虑到三者的取值特性，通常为 1)。

```js
if (scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 1) {
    // ...
}
```

* 因为涉及到 DOM 操作，需要使用 `nextTick()`保证获取到正确的元素。

```ts
nextTick(() => {
    const scrollContainer = Array.from(document.getElementsByClassName('n-scrollbar-container'))[1]
    const scrollContent = Array.from(document.getElementsByClassName('n-scrollbar-content'))[1]
    // 令container的scrollTop等于content的scrollHeight
    scrollContainer.scrollTop = scrollContent.scrollHeight
})
```

### Bugs

#### Socket.IO 部署到服务端后的跨域问题

原本的服务端连接代码：

```typescript
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()

const server = createServer(app)

const io = new Server(app, {
    cors: {
        origin: clientOrigin
    }
})

server.listen(port, () => {
    //...
})
```

但是在生产模式下，`io`通过 `cors`属性配置的 CORS 无法生效。

检查 socket 连接的请求分组。

* 预检请求（OPTIONS）：从请求头和响应头的匹配情况可以看出 CORS 应该是生效的，且状态码 204 代表预检通过。

<!---->

* 连接请求（GET）：`Origin`和 `Host`与上面的也对应，但连接失败，火狐浏览器的 console 明确指出是 CORS 配置的问题。

查询官方文档后，其表示在浏览器中输入 Socket.IO 服务地址出现以下输出，就说明服务端连接是正常建立的，那么就应该是 CORS 的问题。

从 StackOverflow 的[该问题](https://stackoverflow.com/questions/35713682/socket-io-gives-cors-error-even-if-i-allowed-cors-it-on-server)下找到答案：原本的服务端写法，传递给 Socket.IO 的服务器对象与最后监听的服务器对象不同。

改写为以下连接方式，即可解决问题：

```typescript
// 开启服务器
const server = app.listen(port, () => {
    // ...
})

// 配置 Socket.io
const io = new Server({
  cors: {
    origin: clientOrigin
  }
}).listen(server)
```

#### 地址栏输入 url 或刷新页面导致 Vue Router 失效

##### 问题描述

以往对于 Vue Router 的配置都是初始化时就添加所有路由，然后将鉴权的工作交由各组件的生命周期钩子(如 setup, beforeMount, beforeUpdate)或组件内路由守卫(如 beforeRouteUpdate)处理，而由于本项目使用动态路由鉴权，在地址栏导航、浏览器刷新的操作下 Vue Router 会丢失。

这是由于 Vue Router 是专门创建**单页应用程序(SPA)的，其状态存储于浏览器为该页分配的堆栈中，地址栏导航、浏览器刷新都会导致这些内存被垃圾回收程序**回收，于是导致 Vue Router 的**丢失**。

##### 解决方案

在网络查阅资料后，发现原本的在 `beforeEach`全局守卫中配合 `pinia`鉴权的动态路由方案可以解决刷新丢失路由的问题，因为刷新页面后，Vue 应用重新挂载，也会携带 Vue-Router 执行该全局守卫。

但由于在所有角色的可用路由中都添加了**末尾路由(404 Not Found)**，所以**在动态添加路由之前**，现路由(`to.path`)就**匹配**了 `404`，并重定向到 `/404`，所以控制台打印的 `to.path`永远是 `/404`。

```devTool
// url in browser: '/chat' or whatever
from: any, to: /404
```

**结论**：这说明了即便是生命周期中顶级的全局守卫 `beforeEach`（排除组件内 `beforeRouteLeave`），也是 router **在现有路由中进行一次匹配**之后的操作。

在删除了末尾路由后，即可保证页面刷新后路由的恢复，但还是要**考虑怎么安排末尾路由**。

#### 文件上传的请求头设置

在本项目中，存在“上传商品图片”一需求，项目使用 element plus 的 upload 组件，在其提供的 `before-upload`钩子中，原本添加了 `{'content-type': 'multipart/form-data'}`这一头部，意在说明载荷的类型，但引发后端(express)报错：

    Error: Multipart: Boundary not found

查询后，发现是**重复添加**了上面的头部声明，估计是 el-upload 组件已经封装了该请求头。

#### 为缩略图添加鼠标事件无效

在 Vue 组件中使用 `document.querySelector`或者其他捕获 DOM 元素的方法时，捕获范围为**整个页面**，导致一个页面内所有商品媒体对象的缩略图共享一个目前索引(currIndex)。

#### 在 beforeUpdate 中修改引用类型的响应式数据导致组件陷入 update 的无限循环

使用调试钩子 `onRenderTracked`和 `onRenderTriggered`发现问题，在初始化响应式数据时，原本的写法是：

```ts
import { ref } from 'vue'
import axios from 'axios'

interface GoodInfo {
	id: string
    title: string
    price: number
  	owner: string
    images: string
    // ...
}

const goodInfo = ref<GoodInfo | null>(null)

axios.post('#')
	.then((res: any) => {
    // 整个修改引用
    goodInfo.value = {
        id: 'Foo',
        title: 'Bar',
        // ...
    }
})
```

上面响应式数据 `goodInfo.value`的原始值为 `null`，原本已属于引用类型 `object`，而在请求到服务端的数据后又直接修改了 `goodInfo.value`的引用，这在由响应式数据改变后在 `beforeUpdate`中执行的新数据获取，重新遍历对象以绑定响应关系。

这在多组件嵌套的页面，极易引发组件无限 Update，解决方式即避免修改响应式数据的引用（如果其为引用类型的话）。

#### 无 TypeScript 版本的第三方库的类型声明

新建 `@/types/module.d.ts`，加入 `declare`对第三方模块进行声明，并在 `ts.config.json`中添加 `"include": ["types/**/*.ts"]`。

#### Pinia 持久化存储

`pinia-plugin-persist`在 [Pure Demo](https://github.com/3fuyang/pure-demo) 中有效，但本项目里却不生效，改为使用 `pinia-plugin-persistedstate`。

#### 打包时配置 rollup.js 对包进行 split

在引入了代码以外的文件的情况下，打包得到的一些包的体积会过大，对 vite 进行如下配置，使其对包进行分割：

```js
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                // rollup.js分包，控制chunk大小
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString()
                    }
                }
            }
        }
    }
})
```

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
│  ├─ app.ts  // 入口文件
│  ├─ database  // 数据库连接
│  ├─ dist  // TS转译后的JS
│  ├─ flea_now.sql  // DDL
│  ├─ flea_old.sql
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public  // 图片
│  └─ routes  // 路由
│  └─ tsconfig.json  // TSConfig
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
│  ├─ tests  // 测试脚本
│  ├─ types  // 类型定义
│  └─ views // 视图
├─ tsconfig.json
├─ tsconfig.vite-config.json
└─ vite.config.ts // 配置
```
