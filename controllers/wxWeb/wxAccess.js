/**
 * handle wechat message and event
 */
const logger = require('../../util/log').getLogger('app');
const WxUtil = require('../../domain/wechat/util');

const WX_TOKEN = "wx@ha-ecommence";

let wx = async (ctx, next) => {
    logger.debug('wx request from: %j/%j,%j',ctx.request.ip,ctx.request.method,ctx.request);
   

    let token = WX_TOKEN;
    let timestamp = ctx.request.query.timestamp || '';
    let nonce = ctx.request.query.nonce || '';
    let echoStr = ctx.request.query.echostr || '';
    let sign = ctx.request.query.signature || '';
    if(!WxUtil.checkWxSignature(token,timestamp,nonce,sign)){
        ctx.body = 'failed';
        return await next();
    }

    logger.debug("wechat token verified.");
    if(ctx.request.method === 'GET'){  // 处理验证消息
        ctx.body = echoStr;
        await next();
        return;
    }
    
    // FIXME: 处理正常消息, 根据消息类型进行回复
    logger.debug('post from wechat: %j',ctx.request.body);
    await ctx.app.messageDispatcher.processMessage(ctx);
    await next();
    
}
module.exports = {
    'method':'get|post',
    'fn': wx
}