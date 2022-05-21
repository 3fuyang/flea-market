"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Security页面的接口
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../../database/db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// 接口9 获取绑定手机号: 传入（用户id） 返回（绑定手机号）
app.get('/usertel/:user_id', (req, res) => {
    db_1.default.query(`select telnum from userAccount where user_id=?`, [req.params.user_id], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result[0].telnum));
    });
});
// 接口10 修改绑定手机：传入（用户ID，新手机号） 返回（null）
app.post('/modifytel', (req, res) => {
    db_1.default.query(`update userAccount set telnum = ? where user_id = ?`, [req.body.newtel, req.body.id], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
exports.default = app;
