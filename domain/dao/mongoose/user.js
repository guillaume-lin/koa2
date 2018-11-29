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
    "phoneModel": {type:String, default:''}
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


UserSchema.statics.findUser = async function(openId){
    return await this.findOne({openId:openId});
};

let model = mongoose.model('User',UserSchema);
module.exports = model;
