"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Login页面的接口
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../database/db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// 接口1 用户登录：传入（账号、密码） 返回（登录结果）
app.post('/userlogin', (req, res) => {
    let doesExist = false;
    db_1.default.query(`select count(*) as cnt from userAccount where user_id = ? and mypassword = ?`, [req.body.id, req.body.password], (err, result) => {
        if (err)
            throw err;
        doesExist = (result[0].cnt > 0) ? true : false;
        res.end(JSON.stringify(doesExist));
    });
});
// 接口2 管理员登录：传入（账号、密码） 返回（登录结果）
app.post('/adminlogin', (req, res) => {
    let doesExist = false;
    db_1.default.query(`select count(*) as cnt from adminAccount where user_id = ? and mypassword = ?`, [req.body.id, req.body.password], (err, result) => {
        if (err)
            throw err;
        doesExist = (result[0].cnt > 0) ? true : false;
        res.end(JSON.stringify(doesExist));
    });
});
// 接口3 校验学号或手机号是否已被注册：传入（学号、手机号） 返回（是否已被注册）
app.post('/isrepeated', (req, res) => {
    let isRepeated = false;
    db_1.default.query(`select count(*) as cnt from userAccount where user_id = ? or telnum = ?`, [req.body.id, req.body.telnum], (err, result) => {
        if (err)
            throw err;
        isRepeated = (result[0].cnt > 0) ? true : false;
        res.end(JSON.stringify(isRepeated));
    });
});
// 接口4 用户注册：传入（账号、密码、姓名、手机号、性别、学院、生日） 返回（null）
app.post('/register', (req, res) => {
    let newAccount = [
        req.body.user_id,
        req.body.mypassword,
        req.body.myname,
        req.body.telnum,
        req.body.gender,
        req.body.college,
        req.body.birthday,
        req.body.myname
    ];
    db_1.default.query("insert into userAccount(user_id,mypassword,real_name,telnum,gender,college,birthday,nickname) value(?,?,?,?,?,?,?,?)", newAccount, (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 接口5 校验学号和手机号是否已被注册且匹配：传入（学号、手机号） 返回（是否已被注册且匹配）
app.post('/idcoupletel', (req, res) => {
    let isCoupled = false;
    db_1.default.query(`select count(*) as cnt from userAccount where user_id = ? and telnum = ?`, [req.body.id, req.body.telnum], (err, result) => {
        if (err)
            throw err;
        isCoupled = (result[0].cnt > 0) ? true : false;
        res.end(JSON.stringify(isCoupled));
    });
});
// 接口6 用户修改密码：传入（ID、新密码） 返回（null）
app.post('/modifypassword', (req, res) => {
    db_1.default.query(`update userAccount set mypassword = ? where user_id = ?`, [req.body.newpassword, req.body.id], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
exports.default = app;
