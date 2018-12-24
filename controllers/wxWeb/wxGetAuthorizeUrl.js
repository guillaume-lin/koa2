const ConstType = require('../../util/constType');
const logger = require('../../util/log').getLogger('app');

/**
 * 获取授权url
 */
let wxGetAuthorizeUrl = async function(ctx,next){
    let app = ctx.app;
    let client = ctx.client;
    let openId = ctx.session.uid || '';
    if(openId !== ''){
        // 已经登录
        ctx.body =  {code: ConstType.USER_CENTER.ALREADY_LOGIN};
        return;
    }
    let targetUrl = ctx.request.body.targetUrl || '';     // 透传数据    
    // 未登录，构造url让客户端向微信发起授权
    let redirectUrl = ctx.request.href.replace('wxGetAuthorizeUrl','wxLoginCallback');
    let url = client.getAuthorizeURL(redirectUrl, targetUrl, 'snsapi_userinfo');
    logger.debug("return authorize  url:%j",url);
    ctx.body = {code: ConstType.OK,url:url};
};
module.exports = {
    method: 'post',
    fn: wxGetAuthorizeUrl
}