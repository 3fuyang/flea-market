"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./database/db"));
const login_1 = __importDefault(require("./routes/login"));
const home_1 = __importDefault(require("./routes/home"));
const details_1 = __importDefault(require("./routes/details"));
const security_1 = __importDefault(require("./routes/User/security"));
const chat_1 = __importDefault(require("./routes/User/chat"));
const history_1 = __importDefault(require("./routes/User/history"));
const favorite_1 = __importDefault(require("./routes/User/favorite"));
const shoppingcart_1 = __importDefault(require("./routes/User/shoppingcart"));
const info_1 = __importDefault(require("./routes/User/info"));
const goods_1 = __importDefault(require("./routes/User/goods"));
const result_1 = __importDefault(require("./routes/result"));
const confirm_1 = __importDefault(require("./routes/User/confirm"));
const order_1 = __importDefault(require("./routes/User/order"));
const trade_1 = __importDefault(require("./routes/User/trade"));
const report_1 = __importDefault(require("./routes/Admin/report"));
const app = (0, express_1.default)();
app
    // 配置图片等静态资源  
    .use('/public', express_1.default.static('public'))
    // 配置各API路由
    .use('/api', login_1.default)
    .use('/api', home_1.default)
    .use('/api', details_1.default)
    .use('/api', security_1.default)
    .use('/api', chat_1.default)
    .use('/api', history_1.default)
    .use('/api', favorite_1.default)
    .use('/api', shoppingcart_1.default)
    .use('/api', info_1.default)
    .use('/api', goods_1.default)
    .use('/api', result_1.default)
    .use('/api', confirm_1.default)
    .use('/api', order_1.default)
    .use('/api', trade_1.default)
    .use('/api', report_1.default);
// 开启服务器
const server = app.listen(8082, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server is running at http://%s:%s`, host, port);
});
//const server = createServer(app)
// 配置 Socket.io
const io = new socket_io_1.Server({
    cors: {
        origin: 'http://127.0.0.1:8084'
    }
}).listen(server);
// WebSocket 连接桶
const sessionBucket = new Map();
io.on('connection', (socket) => {
    // 建立 WebSocket 连接时，将用户ID和socket id加入map中，以便广播
    let userID = socket.handshake.headers.userid;
    // 获取用户ID对应的连接集合
    let userSockets = sessionBucket.get(userID);
    if (!userSockets) {
        // 如果桶中不存在该用户对应的连接，则新建集合
        sessionBucket.set(userID, userSockets = new Set([socket.id]));
    }
    else {
        // 桶中存在该用户对应的连接集合，将 socket 连接加入集合
        userSockets.add(socket.id);
    }
    //console.log(`connect: ${socket.id}, userID: ${socket.handshake.headers.userid}`)
    // 用户发送消息
    socket.on('send message', (msg) => {
        // 调试：打印消息
        //console.log(msg)
        // 将消息加入数据库
        let newMessage = [msg.a_user_id, msg.b_user_id, msg.speaker, msg.date_time, msg.details];
        db_1.default.query("insert into chatRecord(a_user_id,b_user_id,speaker,date_time,details) value(?,?,?,?,?)", newMessage, (err, result) => {
            if (err)
                throw err;
            // 广播消息（仅针对消息双方）
            // 获取消息双方ID建立的所有socket连接
            const aSockets = sessionBucket.get(msg.a_user_id);
            const bSockets = sessionBucket.get(msg.b_user_id);
            const relatedSockets = [...(aSockets ? Array.from(aSockets) : []), ...(bSockets ? Array.from(bSockets) : [])];
            if (relatedSockets.length) {
                // 向相关连接发送消息
                io.to(relatedSockets).emit('deliver message', msg);
            }
        });
    });
    socket.on('disconnect', () => {
        // 断开连接时，从集合中删除该连接
        userSockets.delete(socket.id);
        //console.log(`disconnect: ${socket.id}`)
    });
});
// 启动服务器
/* server.listen(8082, () => {
  const host = (server.address() as AddressInfo).address
  const port = (server.address() as AddressInfo).port
  console.log(`Server is running at http://%s:%s`, host, port)
}) */ 
