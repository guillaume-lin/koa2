/**
 * user schema
 */
const mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
    "userId": {type:String,unique: true}, // the uuid of this user
    "openId": {type:String,default:''},
    "nickName": {type:String,default:''},
    "sex": {type:String,default:'female'},
    "score": {type:Number,default:0},
    "level": {type:Number,default:1},
    "phoneNumber": {type:String,default:''},
    "phoneModel": {type:String, default:''}
});

// define method for this model

let model = mongoose.model('User',UserSchema);
module.exports = model;
