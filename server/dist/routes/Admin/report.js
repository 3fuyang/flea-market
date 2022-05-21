"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// DealingReports页面的接口
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../../database/db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// 获取管理员昵称
app.get(`/getAdminName/:admin_id`, (req, res) => {
    db_1.default.query(`select nickname from adminAccount where user_id=?`, [req.params.admin_id], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 获取未处理的举报列表
app.post(`/getReports`, (req, res) => {
    let data;
    const promises = [];
    new Promise((resolve, reject) => {
        db_1.default.query(`select order_id,reason,report_time,stat from reportData where stat='待处理' order by report_time desc`, (err, result) => {
            if (err)
                throw err;
            data = JSON.parse(JSON.stringify(result));
            resolve('');
        });
    })
        .then(() => {
        for (let item of data) {
            promises.push(new Promise((resolve) => {
                db_1.default.query(`select buyer,seller,good_id from orderData where order_id = ?;
               select title from goodInfo where good_id=(select good_id from orderData where order_id=?)`, [item.order_id, item.order_id], (err, result) => {
                    if (err)
                        throw err;
                    let raw = JSON.parse(JSON.stringify(result)).flat(2);
                    let anotherHalf = Object.assign(raw[0], raw[1]);
                    for (let property in anotherHalf) {
                        item[property] = anotherHalf[property];
                    }
                    resolve('');
                });
            }));
        }
        Promise.all(promises).then(() => {
            res.end(JSON.stringify(data));
        });
    });
});
// 封禁被举报用户
app.post(`/banAccusedAccount`, (req, res) => {
    db_1.default.query(`update userAccount set available='1' where user_id=?;
     update reportData set reply=?,reply_time=?,replyer=? where order_id=?`, [req.body.userID, req.body.reply, req.body.replyTime, req.body.replyer, req.body.orderID], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 修改被举报订单的举报状态
app.post(`/modifyOrderReported`, (req, res) => {
    db_1.default.query(`update orderData set reported=? where order_id=?`, [req.body.reported, req.body.orderID], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 驳回举报
app.post(`/refuseReport`, (req, res) => {
    db_1.default.query(`update reportData set reply=?,reply_time=?,replyer=?,stat='已驳回' where order_id=?;`, [req.body.reply, req.body.replyTime, req.body.replyer, req.body.orderID], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
exports.default = app;
