/**
 * 处理来自微信的请求
 */
const logger = require('../../util/log').getLogger('app');

let MessageDispatcher = function(app){
    this.app = app;
}
let pro = MessageDispatcher.prototype;

/**
 * 处理微信消息
 */
pro.processMessage = function(ctx){
    let openId = ctx.request.query.openid;
    let ct = Math.ceil(Date.now()/1000);
    let toUserName = openId;
    let fromUserName = ctx.request.body.xml.ToUserName[0];
    ctx.type = 'application/xml';
    ctx.body = "<xml><ToUserName><![CDATA["+ toUserName +"]]></ToUserName><FromUserName><![CDATA["+fromUserName+"]]> </FromUserName><CreateTime>"+ct+"</CreateTime> <MsgType><![CDATA[text]]></MsgType> <Content><![CDATA[你好]]></Content></xml>";
    //ctx.body = "success";
    logger.debug("reply to user: %j",ctx.body);
}

module.exports = MessageDispatcher;