"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Order 页面
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../../database/db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// 获取用户购买商品的订单
app.get('/getOrders/:user_id', (req, res) => {
    let data;
    const promises = [];
    new Promise((resolve, reject) => {
        db_1.default.query(`select * from orderData where buyer=? order by generated_time desc`, [req.params.user_id], (err, result) => {
            if (err)
                throw err;
            data = JSON.parse(JSON.stringify(result));
            resolve('');
        });
    })
        .then(() => {
        for (let item of data) {
            promises.push(new Promise((resolve) => {
                db_1.default.query(`select title,price,images,seller_id from goodInfo where good_id = ?`, [item.good_id], (err, result) => {
                    if (err)
                        throw err;
                    result = JSON.parse(JSON.stringify(result))[0];
                    for (let property in result) {
                        item[property] = result[property];
                    }
                    resolve('');
                });
            }));
        }
        Promise.all(promises)
            .then(() => {
            res.end(JSON.stringify(data));
        });
    });
});
// 获取卖家昵称，头像url
app.get('/sellerAvatarAndName/:seller_id', (req, res) => {
    db_1.default.query(`select nickname,avatar from userAccount where user_id=?`, [req.params.seller_id], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 确认完成订单
app.post(`/completeOrder`, (req, res) => {
    db_1.default.query(`update orderData set stat='待评价' where order_id=?`, [req.body.orderID], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 获取订单评价
app.get(`/getOrderEvaluation/:order_id`, (req, res) => {
    db_1.default.query(`select review,rate from orderData where order_id=?`, [req.params.order_id], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 提交评价
app.post(`/submitEvaluation`, (req, res) => {
    db_1.default.query(`update orderData set review=?,rate=?,review_time=?,stat='已完成' where order_id=?;`, [req.body.review, req.body.grade, req.body.time, req.body.orderID], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 查询举报
app.get(`/getReport/:order_id`, (req, res) => {
    db_1.default.query(`select reason,stat,reply,reply_time,replyer from reportData where order_id=?`, [req.params.order_id], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 举报订单
app.post(`/reportOrder`, (req, res) => {
    const { orderID, reason, time } = req.body;
    db_1.default.query(`insert into reportData(order_id, reason, report_time, stat) values(?, ?, ?, '待处理');
     update orderData set reported='待处理' where order_id=?`, [orderID, reason, time, orderID], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 订单付款
app.post(`/payOrder`, (req, res) => {
    db_1.default.query(`update orderData set stat='待确认' where order_id=?`, [req.body.orderID], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
exports.default = app;