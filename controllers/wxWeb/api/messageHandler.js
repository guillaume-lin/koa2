const ConstType = require('../../../util/constType');
const logger = require('../../../util/log').getLogger('app');

let MessageHandler = function(){

}

let pro = MessageHandler.prototype;
/**
 * 获取消息页数
 */
pro.getMessagePageCount = async function(ctx,next){
    let app = ctx.app;
    let receiver = ctx.session.uid;
    let ret = await app.userCenter.getMessagePageCount(receiver);
    ctx.body = ret;
};

/**
 * 获取消息页
 */
pro.getMessagePage = async function(ctx,next){
    let app = ctx.app;
    let receiver = ctx.session.uid;
    let pageNumber = ctx.request.body.pageNumber;
    let ret = await app.userCenter.getMessagePage(receiver,pageNumber);
    ctx.body = ret;
};
/**
 * 发送消息给用户
 */
pro.sendMessage = async function(ctx, next){
    let app = ctx.app;
    let receiver = ctx.session.uid;
    let title = ctx.request.body.title || '';
    let content = ctx.request.body.content || '';
    let ret = await app.userCenter.sendMessage(receiver,title,content);
    ctx.body = ret;    
};
/**
 * 标注用户已经完成阅读
 */
pro.markMessageRead = async function(ctx,next){
    let app = ctx.app;
    let receiver = ctx.session.uid;
    let msgId = ctx.request.body.msgId;
    let ret = await app.userCenter.markMessageRead(receiver,msgId);
    ctx.body = ret;
};
/**
 * 删除指定消息
 */
pro.deleteMessage = async function(ctx,next){
    let app = ctx.app;
    let receiver = ctx.session.uid;
    let msgIds = ctx.request.body.msgIds.split(';');  // 使用分号分隔
    let ret = await app.userCenter.deleteMessage(receiver,msgIds);
    ctx.body = ret;
}
module.exports = MessageHandler;