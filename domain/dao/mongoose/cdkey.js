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
    "isUsed": {type: Number, default: 0}, // 0 表示未使用， 1表示使用
});

// define method for this model
/**
 * 判断二维码是否存在并且处于有效期内
 */
CdkeySchema.statics.isValidKey = async function(cdkey,cb){
    this.findOne({cdkey:cdkey},function(err,doc){
        if(err){
            return cb(err);
        }
        logger.debug("isValidKey:%j, res:%j",cdkey,doc);
        if(doc && doc.expireTime > Date.now()){ 
            return cb(null,true);
        }
        return cb(null,false);
    })
}
/**
 * 扫码获得cdkey
 * 返回
 *
 */

CdkeySchema.statics.acquireCdkey = function(cdkey,openId,cb){
    let scanTime = Date.now();
    this.updateOne({cdkey:cdkey, expireTime:{$gt:scanTime}},
        {$set: {openId: openId, scanTime:scanTime}},
        {upsert:false},function(err,res){
            if(err){
                return cb(err);
            }
            if(res.nModified === 1){
                cb(null,true);
            }else{
                cb(null,false);
            }
        });
}
/**
 * 判断用户拥有cdkey的状态
 * 返回
 *  0 拥有cdkey，且在有效期内
 *  1 不拥有cdkey,或cdkey不合法
 *  2 cdkey已过期
 */
CdkeySchema.statics.checkCdkey = async function(openId,cdKey){
    let doc = await this.findOne({openId:openId,cdkey:cdkey});
    logger.debug("checkCdkey:%j,%j result:%j",openId,cdkey,doc);
    if(doc === null){
        return 1;
    }
    if(doc.expireTime < Date.now()){
        return 2;
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
    let doc = await this.updateOne({openId:openId,cdkey:cdkey,isUsed:0,expireTime:{$gt:Date.now()}},{$set:{isUsed:1}});
    logger.debug("markCdkey Used:%j",doc);
    if(doc.nModified === 1 && doc.ok === 1){
        return 0;
    }
    return 1;
}
let model = mongoose.model('Cdkey',CdkeySchema);
module.exports = model;