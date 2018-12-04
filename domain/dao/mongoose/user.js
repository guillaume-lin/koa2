/**
 * user schema
 */
const mongoose = require('mongoose');
const logger = require('../../../util/log').getLogger('app');

const Util = require('../../../util/util');
let UserSchema = new mongoose.Schema({
    "openId": {type:String,unique: true},
    "nickName": {type:String,default:''},
    "sex": {type:Number,default: 0},
    "vipLevel": {type:Number,default:1},
    "phoneNumber": {type:String,default:''},
    "babyBirthDay":{type:Number,default:0},
    "babySex":{type:Number,default:0},
    "consignee":{type:String,default:''}, // 收货人
    "province":{type:Number,default:0}, // 所在省
    "city":{type:Number,default:0}, // 所在市
    "address":{type:String,default:''}, // 地址
    "postCode":{type:String,default:''} // 邮政编码
});

// define method for this model
UserSchema.statics.createUser = async function(openId,nickName,sex){
    let userInfo = {
        openId: openId,
        nickName: nickName,
        sex:sex
    }
    logger.debug('createUser:%j',userInfo);
    return await this.create(userInfo);
};

UserSchema.statics.setPhoneNumber = async function(openId,phoneNumber){
    let ret = await this.updateOne({openId:openId},{$set:{phoneNumber:phoneNumber}});
    logger.debug("UserSchema setPhoneNumber. openId:%j,phoneNumber:%j,ret:%j",openId,phoneNumber,ret);
    if(ret.ok === 1 && ret.nModified === 1){
        return 0;
    }else{
        return 1;
    }
}
UserSchema.statics.findUser = async function(openId){
    return await this.findOne({openId:openId});
};
// 修改用户信息
UserSchema.statics.updateUserInfo = async function(openId,userInfo){
    let info = {};
    if(userInfo.nickName){
        info.nickName;
    };
    let ret = await this.updateOne({openId:openId},{$set:info});
    logger.debug("UserSchema updateUserInfo. openId:%j,info:%j,ret:%j",openId,info,ret);
    if(ret.ok === 1 && ret.nModified === 1){
        return 0;
    }else{
        return 1;
    }
}

let model = mongoose.model('User',UserSchema);
module.exports = model;
