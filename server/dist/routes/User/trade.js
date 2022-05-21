"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Trade 页面 */
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../../database/db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// 获取买家昵称，头像
app.get(`/getBuyerAvatarAndName/:user_id`, (req, res) => {
    db_1.default.query(`select nickname,avatar from userAccount where user_id=?`, [req.params.user_id], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 获取卖出的订单
app.get(`/getSoldOrders/:user_id`, (req, res) => {
    let data;
    const promises = [];
    new Promise((resolve, reject) => {
        db_1.default.query(`select * from orderData where seller=? order by generated_time desc`, [req.params.user_id], (err, result) => {
            if (err)
                reject(err);
            data = JSON.parse(JSON.stringify(result));
            resolve('');
        });
    })
        .then(() => {
        for (let item of data) {
            promises.push(new Promise((resolve) => {
                db_1.default.query(`select title,images from goodInfo where good_id = ?;
               select nickname from userAccount where user_id = ?`, [item.good_id, item.buyer], (err, result) => {
                    if (err)
                        throw err;
                    const separatedResult = JSON.parse(JSON.stringify(result)).flat(2);
                    result = Object.assign(separatedResult[0], separatedResult[1]);
                    for (let property in result) {
                        item[property] = result[property];
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
// 拒接订单
app.post(`/rejectOrder`, (req, res) => {
    db_1.default.query(`update orderData set stat='已取消' where order_id=?;
     update goodInfo set available=0 where good_id=(select good_id from orderData where order_id=?)`, [req.body.orderID, req.body.orderID], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
exports.default = app;
