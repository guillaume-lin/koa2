/**
 * access this site from wechat
 * 
 * 1. check if the client is wechat
 * 2. login this site with wechat account
 * 3. check if the user have follow us
 * 4. if not, redirect to page, ask the user to follow us(page follow), once following, redirect to 3
 * 5. check if the user have register with mobile phone 
 * 6. if not, redirect to page, ask the user to register with mobile phone(page register phone), once registered, redirect to 5
 * 7. show the user's home page (page home)
 */
const logger = require('../util/log').getLogger('app');
const WxUtil = require('../domain/wechat/util');

const WX_TOKEN = "wx";

let wx = async (ctx, next) => {
    logger.debug('wx request from: %j/%j,%j',ctx.request.ip,ctx.request.method,ctx.request);
    ctx.cookies.set("mycookie",123);
    let token = WX_TOKEN;
    let timestamp = ctx.request.query.timestamp || '';
    let nonce = ctx.request.query.nonce || '';
    let echoStr = ctx.request.query.echostr || '';
    let sign = ctx.request.query.signature || '';
    if(WxUtil.checkWxSignature(token,timestamp,nonce,sign)){
        logger.debug("wechat token verified.");
        ctx.body = echoStr;
    }else{
        ctx.body = 'failed';
    }

    await next();
}
module.exports = {
    'method':'get',
    "url": '/wx',
    'fn': wx
}