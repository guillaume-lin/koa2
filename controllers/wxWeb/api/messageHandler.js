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
    let pageCount = await app.userCenter.getMessagePageCount(receiver);
    ctx.body = {code: ConstType.OK,pageCount:pageCount};
};

/**
 * 获取消息页
 */
pro.getMessagePage = async function(ctx,next){
    let app = ctx.app;
    let receiver = ctx.session.uid;
    let pageNumber = ctx.request.body.pageNumber;
    let ret = await app.userCenter.getMessagePage(receiver,pageNumber);
    logger.debug("getMessagePage:%j",ret);
    ctx.body = {code:0,message:ret};
};
/**
 * 发送消息给用户
 */
pro.sendMessage = async function(ctx, next){
    let app = ctx.app;
    let receiver = ctx.session.uid;
    let title = ctx.request.body.title || '';
    let content = ctx.request.body.content || '';
    let ret = app.userCenter.sendMessage(receiver,title,content);
    ctx.body = ret;
};
/**
 * 标注用户已经完成阅读
 */
pro.markMessageRead = async function(ctx,next){
    let app = ctx.app;
    let receiver = ctx.session.uid;
    let msgId = ctx.request.body.msgId;
    let ret = app.userCenter.markMessageRead(receiver,msgId);
    ctx.body = ret;
}
module.exports = MessageHandler;