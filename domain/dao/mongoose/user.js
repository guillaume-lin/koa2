/**
 * user schema
 */
const mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
    "openId": {type:String},
    "nickName": {type:String},
    "sex": {type:String},
    "score": {type:Number,default:0},
    "level": {type:Number,default:1},
    "phoneNumber": {type:String,default:''},
    "phoneModel": {type:String, default:''}
});

let model = mongoose.Model('User',UserSchema);
module.exports = model;
