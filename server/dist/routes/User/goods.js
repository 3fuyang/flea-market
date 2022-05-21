"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileInfo = void 0;
/* Goods 页面 */
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = require("fs");
const db_1 = __importDefault(require("../../database/db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// 获取上架中商品
app.get('/onShelfGoods/:user_id', (req, res) => {
    new Promise((resolve, reject) => {
        db_1.default.query(`select * from goodInfo where seller_id=? and available='0'`, [req.params.user_id], (err, result) => {
            if (err)
                throw err;
            resolve(JSON.parse(JSON.stringify(result)));
        });
    })
        .then((halfResult) => {
        const promises = [];
        halfResult.forEach((item) => {
            promises.push(new Promise((resolve, reject) => {
                db_1.default.query(`select count(*) as cnt1 from collectionBox where good_id=?;
               select count(*) as cnt2 from browseTrack where good_id=?`, [item.good_id, item.good_id], (err, result) => {
                    if (err)
                        throw err;
                    let data = JSON.parse(JSON.stringify(result));
                    item.likes = JSON.parse(JSON.stringify(data[0]))[0].cnt1;
                    item.browsed = JSON.parse(JSON.stringify(data[1]))[0].cnt2;
                    resolve(item);
                });
            }));
        });
        Promise.all(promises)
            .then(result => {
            res.end(JSON.stringify(result));
        });
    });
});
// 获取已售出商品
app.get('/soldGoods/:user_id', (req, res) => {
    new Promise((resolve, reject) => {
        db_1.default.query(`select * from goodInfo where seller_id=? and available='1'`, [req.params.user_id], (err, result) => {
            if (err)
                throw err;
            resolve(JSON.parse(JSON.stringify(result)));
        });
    })
        .then((halfResult) => {
        const promises = [];
        halfResult.forEach((item) => {
            promises.push(new Promise((resolve, reject) => {
                db_1.default.query(`select count(*) as cnt1 from collectionBox where good_id=?;
               select count(*) as cnt2 from browseTrack where good_id=?`, [item.good_id, item.good_id], (err, result) => {
                    if (err)
                        throw err;
                    let data = JSON.parse(JSON.stringify(result));
                    item.likes = JSON.parse(JSON.stringify(data[0]))[0].cnt1;
                    item.browsed = JSON.parse(JSON.stringify(data[1]))[0].cnt2;
                    resolve(item);
                });
            }));
        });
        Promise.all(promises)
            .then(result => {
            res.end(JSON.stringify(result));
        });
    });
});
// 文件信息类
class FileInfo {
    constructor() {
        this.type = '';
        this.name = '';
        this.size = 0;
        this.path = '';
    }
}
exports.FileInfo = FileInfo;
// 上传图片
app.post('/uploadImage', (0, multer_1.default)({
    // 设置文件存储路径
    dest: './public/images',
}).array('file', 3), // 注意：这里的字段必须与前端formdata的字段名相同
(req, res, next) => {
    const fileInfoList = [];
    req.files.forEach((file) => {
        let fileInfo = new FileInfo();
        let path = './public/images/' + Date.now().toString() + '_' + file.originalname;
        (0, fs_1.renameSync)('./public/images/' + file.filename, path);
        // 获取文件基本信息
        fileInfo.type = file.mimetype;
        fileInfo.name = file.originalname;
        fileInfo.size = file.size;
        fileInfo.path = path;
        fileInfoList.push(fileInfo);
    });
    res.end(JSON.stringify(fileInfoList));
});
// 上架新商品
app.post('/addGood', (req, res) => {
    db_1.default.query(`insert into goodInfo(seller_id, price, category, good_name, title, keywords, campus, intro, detail, images, onshelf_time)
     value(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, req.body, (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
// 修改上架中商品信息
app.post('/modifyGood', (req, res) => {
    db_1.default.query(`update goodInfo set price=?, category=?, good_name=?, 
     title=?, keywords=?, campus=?, intro=?,
     detail=?, images=? where good_id=?`, req.body, (err, result) => {
        if (err)
            throw err;
        res.end(JSON.stringify(result));
    });
});
exports.default = app;
