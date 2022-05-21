"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Info页面的接口
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const db_1 = __importDefault(require("../../database/db"));
const goods_1 = require("./goods");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// 获取用户信息
app.get('/getUserInfo/:user_id', (req, res) => {
    db_1.default.query(`select * from userAccount where user_id = ?`, [req.params.user_id], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 修改用户信息
app.post('/modifyUserInfo', (req, res) => {
    const r = req.body;
    db_1.default.query(`update userAccount set 
    nickname=?,
    biography=?,
    college=?,
    gender=?,
    birthday=?
    where user_id=?`, [r.nickName, r.selfIntro, r.college, r.gender, r.birthday, r.userID], (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 上传头像
app.post('/uploadAvatar', (0, multer_1.default)({
    // 设置文件存储路径
    dest: './public/avatars',
}).array('file', 1), // 注意：这里的字段必须与前端formdata的字段名相同
(req, res, next) => {
    const fileInfoList = [];
    let name = '';
    req.files.forEach((file) => {
        let fileInfo = new goods_1.FileInfo();
        let path = './public/avatars/' + Date.now().toString() + '_' + file.originalname;
        fs_1.default.renameSync('./public/avatars/' + file.filename, path);
        // 获取文件基本信息
        fileInfo.type = file.mimetype;
        fileInfo.name = file.originalname;
        name = fileInfo.name;
        fileInfo.size = file.size;
        fileInfo.path = path;
        fileInfoList.push(fileInfo);
    });
    db_1.default.query(`update userAccount set avatar=? where user_id=${req.get('userID')}`, name, (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
exports.default = app;
