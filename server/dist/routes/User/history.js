"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* History 页面 */
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../../database/db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// 添加浏览记录：传入（用户ID，商品ID，时间） 返回（null）
app.post('/addTrack', (req, res) => {
    const newTrack = [req.body.userID, req.body.goodID, req.body.time];
    db_1.default.query("insert into browseTrack(user_id,good_id,day_time) value(?,?,?)", newTrack, (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 接口11 获取浏览记录：传入（用户ID） 返回（浏览记录数据:商品ID、浏览日期）
app.get('/getTrack/:user_id', (req, res) => {
    let data;
    const promises = [];
    new Promise((resolve, reject) => {
        db_1.default.query(`select * from browseTrack where user_id = ? order by day_time desc`, [req.params.user_id], (err, result) => {
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
// 接口13 清空浏览记录：传入（用户ID） 返回（null）
app.get('/clearTrack/:user_id', (req, res) => {
    db_1.default.query(`delete from browseTrack where user_id = ?`, [req.params.user_id], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
exports.default = app;
