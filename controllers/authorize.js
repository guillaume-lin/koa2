/**
 * 微信网页授权
 * 获取用户的微信账号信息
 */
let logger = require('../util/log').getLogger('app');
let authroize = async (ctx,next) => {
    let client = ctx.client;
    let code = ctx.request.query.code || '';
    let cdkey = ctx.request.query.cdkey || ''; // 兑换码
    if(code !== ''){
        // 已经获得授权
        let userInfo = await new Promise(function(resolve,reject){
            client.getAccessToken(code, function (err, result) {
                if(err){
                    logger.error("getAccessToken error: %j",err.stack);
                    reject(err);
                    return;
                }
                var accessToken = result.data.access_token;
                var openId = result.data.openid;
                logger.debug("accessToken: %j, openId: %j",accessToken,openId);
                client.getUser(openId, function (err, result) {
                    var userInfo = result;
                    resolve(userInfo);
                  });
              }); 
        })
        logger.debug("userInfo:%j",userInfo);
        ctx.body = userInfo;
        await next();
        return;
    }
    
    let redirectUrl = "https://43aefd66.ngrok.io/authorize";
    let url = client.getAuthorizeURL(redirectUrl, 'myState', 'snsapi_userinfo');
    logger.debug("redirect to url:%j",url);
    //ctx.body = "<a href="+url+"> click here</a>";
    ctx.response.redirect(url);
    await next();
};

module.exports = {
    'method':'get',
    "url": '/authorize',
    'fn': authroize
}