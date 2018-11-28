/**
 * 用户商品表
 * 
 * 积分也是一种特殊的商品
 */
const mongoose = require('mongoose');
let ItemSchema = new mongoose.Schema({
    "id": {type:String,unique: true}, // 商品编码, 必须唯一
    "name":{type:String},   // 商品名称
    "desc": {type:String,default:''}, // 商品描述
    "amount": {type:Number,default: 0}, // 商品数量
    "acquireTime":{type:Number,default:0}, // 获得时间
    "validTime": {type: Number,default:0}, // 有效期
});

let model = mongoose.model('Item',ItemSchema);
module.exports = model;