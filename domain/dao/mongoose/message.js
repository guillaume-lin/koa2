const logger = require('../../../util/log').getLogger('app');

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
let MessageSchema = new mongoose.Schema({
    "receiver": {type:String}, // 消息接收人的openId
    "receiveTime":{type:Number,default:0},   // 接收时间
    "isRead": {type:Number,default:0}, //  是否已读,0表示未读,1表示已读
    "title":{type:String,default:'',maxlength:50}, // 消息标题
    "content":{type:String,default:'',maxlength:500}  // 消息内容
});

const MAX_MESSAGE_PER_PAGE = 10;  // 每次查询的消息数

MessageSchema.statics.sendMessage = async function(receiver,title,content){
    let ct = Date.now();
    let ret = await this.create({receiver:receiver,title:title,content:content,receiveTime:ct});
    if(ret && ret.title === title){
        return true;
    }else{
        return false;
    }
};
/**
 * 返回用户的消息, 最近的消息排在前面
 * 
 */
MessageSchema.statics.getMessagePage = async function(receiver,pageNumber){
    let ret = await this.find({receiver:receiver}).skip(pageNumber*MAX_MESSAGE_PER_PAGE).limit(MAX_MESSAGE_PER_PAGE).sort({receiveTime:1});
    logger.debug("getMessagePage. %j",ret);
    return ret;
};
/**
 * 消息总数
 */
MessageSchema.statics.getMessagePageCount = async function(receiver){
    let ret = await this.count({receiver:receiver});
    let pageCount = Math.ceil(ret/MAX_MESSAGE_PER_PAGE);  // 0 - pageCount-1
    return pageCount;
};
// 标记消息已读
MessageSchema.statics.markMessageRead = async function(receiver,msgId){
    let ret = await this.updateOne({receiver:receiver,_id:msgId},{$set:{isRead:1}});
    logger.debug("markMessageRead. receiver:%j, msgId:%j, ret:%j",receiver,msgId,ret);
    if(ret.ok === 1 && ret.n === 1){
        return true;
    }else{
        return false;
    }
};
/**
 * msgIds:[]
 */
MessageSchema.statics.deleteMessage = async function(receiver,msgIds){
    let ret = await this.remove({receiver:receiver,_id:{$in:msgIds}});
    logger.debug("deleteMessage: %j",ret);
    return ret;
};
/**
 * 获取未读消息数
 */
MessageSchema.statics.queryUnreadMessage = async function(receiver){
    let ret = await this.count({receiver:receiver,isRead:0});
    return ret;
}
let model = mongoose.model('Message',MessageSchema);
module.exports = model;