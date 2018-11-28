/**
 * user schema
 */
const mongoose = require('mongoose');

const Util = require('../../../util/util');
let UserSchema = new mongoose.Schema({
    "openId": {type:String,default:''},
    "nickName": {type:String,default:''},
    "sex": {type:Number,default: 0},
    "vipLevel": {type:Number,default:1},
    "phoneNumber": {type:String,default:''},
    "phoneModel": {type:String, default:''}
});

// define method for this model
UserSchema.statics.createUser = function(openId,nickName,sex){
    let userInfo = {
        openId: openId,
        nickName: nickName,
        sex:sex
    }
    return await this.create(userInfo);
};


UserSchema.statics.findUser = function(openId){
    return await this.findOne({openId:openId});
};

let model = mongoose.model('User',UserSchema);
module.exports = model;
