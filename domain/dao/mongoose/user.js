/**
 * user schema
 */
const mongoose = require('mongoose');
const logger = require('../../../util/log').getLogger('app');

const Util = require('../../../util/util');
let UserSchema = new mongoose.Schema({
    "openId": {type:String,unique: true},
    "nickName": {type:String,default:'',maxlength:20},
    "sex": {type:Number,default: 0},
    "vipLevel": {type:Number,default:1},
    "lastAccess": {type:Number,default:0}, // 上次访问用户中心的时间
    "phoneNumber": {type:String,default:'',maxlength:14},
    "babyBirthDay":{type:Number,default:0},
    "babySex":{type:Number,default:0},  // 0 - 未知 1 - 男生 2 - 女生
    "consignee":{type:String,default:'',maxlength:10}, // 收货人
    "province":{type:String,default:'',maxlength:10}, // 所在省
    "city":{type:String,default:'',maxlength:10}, // 所在市
    "address":{type:String,default:'',maxlength:50}, // 地址
    "postCode":{type:String,default:'',maxlength:6} // 邮政编码
});

// define method for this model
UserSchema.statics.isAddressComplete = async function(openId){
    let ret = await this.findOne({openId:openId},{openId:1,phoneNumber:1,province:1,city:1,consignee:1,address:1});
    if(ret.phoneNumber.length === 11 && ret.province.length > 0 && ret.city.length > 0 && ret.consignee.length > 0 && ret.address.length > 0){
        return 0;
    }else{
        logger.error("address not complete: %j",ret);
        return 1;
    }
}
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
    return await this.findOne({openId:openId}).lean();
};
// 修改用户信息
UserSchema.statics.updateUserInfo = async function(openId,userInfo){
    let info = userInfo;
    let ret = await this.updateOne({openId:openId},{$set:info});
    logger.debug("UserSchema updateUserInfo. openId:%j,info:%j,ret:%j",openId,info,ret);
    if(ret.ok === 1 && ret.n === 1){
        return 0;
    }else{
        return 1;
    }
}

let model = mongoose.model('User',UserSchema);
module.exports = model;
