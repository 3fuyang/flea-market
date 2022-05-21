"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Home页面的接口
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../database/db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// 接口7 主页信息：传入（用户ID）  返回（获取用户购物车中商品数量, 进行中订单数, 未评价订单数）
app.get('/homeinfo/:user_id', (req, res) => {
    let homeinfo = { shoppingCartNum: 0, notPaidNum: 0, notEvaluateNum: 0 };
    db_1.default.query(`select count(*) as cnt from shoppingCart where user_id=?`, [req.params.user_id], (err, result) => {
        if (err)
            throw err;
        homeinfo.shoppingCartNum = result[0].cnt;
    });
    db_1.default.query(`select count(*) as cnt_ from orderData where buyer=? and stat='进行中'`, [req.params.user_id], (err, result) => {
        if (err)
            throw err;
        homeinfo.notPaidNum = result[0].cnt_;
    });
    db_1.default.query(`select count(*) as cntt from orderData where buyer=? and stat='未评价'`, [req.params.user_id], (err, result) => {
        if (err)
            throw err;
        homeinfo.notEvaluateNum = result[0].cntt;
        res.end(JSON.stringify(homeinfo));
    });
});
// 接口8 获取商品信息：传入（商品ID） 返回（商品标题、价格、图片url）
app.get('/goodsbriefinfo/:good_id', (req, res) => {
    db_1.default.query(`select title,price,images from goodInfo where good_id=?`, [req.params.good_id], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
exports.default = app;
