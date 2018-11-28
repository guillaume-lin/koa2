/**
 * cdkey schema
 */
const mongoose = require('mongoose');
let CdkeySchema = new mongoose.Schema({
    "cdkey": {type:String,unique: true}, // the cdkey, 必须唯一
    "expireTime":{type:Number},   // 过期时间,unix TimeStamp
    "openId": {type:String,default:''}, // 扫码微信id
    "scanTime":{type:Number,default:0}, // 扫码日期
});

// define method for this model
/**
 * 判断二维码是否存在并且处于有效期内
 */
CdkeySchema.statics.isValidKey = function(cdkey,cb){
    this.find({cdkey:cdkey},function(err,doc){
        if(err){
            return cb(err);
        }
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
let model = mongoose.model('Cdkey',CdkeySchema);
module.exports = model;