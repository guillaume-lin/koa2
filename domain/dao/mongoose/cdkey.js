/**
 * cdkey schema
 */
const logger = require('../../../util/log').getLogger('app');
const mongoose = require('mongoose');
let CdkeySchema = new mongoose.Schema({
    "cdkey": {type:String,unique: true}, // the cdkey, 必须唯一
    "expireTime":{type:Number,default:Number.MAX_SAFE_INTEGER},   // 过期时间,unix TimeStamp
    "openId": {type:String,default:''}, // 扫码微信id
    "scanTime":{type:Number,default:0}, // 扫码日期
    "useTime":{type:Number,default:0},  // 使用时间
    "isUsed": {type: Number, default: 0}, // 0 表示未使用， 1表示使用
});

// define method for this model
/**
 * 尝试获得二维码，需考虑并发操作
 * 返回
 *
 */
CdkeySchema.statics.acquireCdkey = async function(openId,cdkey){
    let scanTime = Date.now();
    let ret = await this.updateOne({cdkey:cdkey, expireTime:{$gt:scanTime},openId:''},
        {$set: {openId: openId, scanTime:scanTime}},
        {upsert:false});
    
    if(ret.nModified === 1){
        return 0;
    }else{
        return 1;
    }
}

/**
 * 判断用户拥有cdkey的状态
 * 返回
 *  0 拥有cdkey，且在有效期内
 *  1 不拥有cdkey,或cdkey不合法
 *  2 cdkey 已过期
 *  3 cdkey 已使用
 */
CdkeySchema.statics.checkCdkey = async function(openId,cdkey){
    let doc = await this.findOne({openId:openId,cdkey:cdkey});
    logger.debug("checkCdkey:%j,%j result:%j",openId,cdkey,doc);
    if(doc === null){
        return 1;
    }
    if(doc.expireTime < Date.now()){
        return 2;
    }
    if(doc.isUsed === 1){
        return 3; // 
    }
    return 0;
};
/**
 *  标注cdkey使用
 * 返回:
 *   0  - 表示成功
 *   1  - 表示失败
 */
CdkeySchema.statics.markCdkeyUsed = async function(openId,cdkey){
    let ct = Date.now();
    let doc = await this.updateOne({openId:openId,cdkey:cdkey,isUsed:0,expireTime:{$gt:Date.now()}},{$set:{isUsed:1,useTime:ct}});
    logger.debug("markCdkey Used:%j",doc);
    if(doc.nModified === 1 && doc.ok === 1){
        return 0;
    }
    return 1;
}
let model = mongoose.model('Cdkey',CdkeySchema);
module.exports = model;