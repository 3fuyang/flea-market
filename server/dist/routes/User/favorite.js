"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Favorite 页面
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../../database/db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// 检查是否收藏商品
app.post('/checkCollected', (req, res) => {
    db_1.default.query(`select count(*) as cnt from collectionBox where user_id = ? and good_id = ?`, [req.body.userID, req.body.goodID], (err, result) => {
        if (err)
            throw (err);
        if (JSON.parse(JSON.stringify(result))[0].cnt > 0) {
            res.end('true');
        }
        else {
            res.end('false');
        }
    });
});
// 收藏商品
app.post('/collectGood', (req, res) => {
    const input = [req.body.userID, req.body.goodID, req.body.time];
    db_1.default.query("insert into collectionBox(user_id,good_id,day_time) value(?,?,?)", input, (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 接口14 获取收藏夹：传入（用户ID） 返回（收藏夹数据:商品ID）
app.get('/getCollection/:user_id', (req, res) => {
    let data;
    const promises = [];
    new Promise((resolve, reject) => {
        db_1.default.query(`select * from collectionBox where user_id = ? order by day_time desc`, [req.params.user_id], (err, result) => {
            if (err)
                throw err;
            data = JSON.parse(JSON.stringify(result));
            resolve('');
        });
    })
        .then(() => {
        for (let item of data) {
            promises.push(new Promise((resolve) => {
                db_1.default.query(`select title,price,images from goodInfo where good_id = ?`, [item.good_id], (err, result) => {
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
        Promise.all(promises).then(() => {
            res.end(JSON.stringify(data));
        });
    });
});
// 接口15 取消收藏某商品：传入（用户ID，商品ID） 返回（null）
app.post('/cancelCollection', (req, res) => {
    db_1.default.query(`delete from collectionBox where user_id = ? and good_id = ?`, [req.body.userID, req.body.goodID], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
exports.default = app;
