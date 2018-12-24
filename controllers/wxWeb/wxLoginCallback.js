/**
 * 微信网页登录回调
 * 登录成功后，跳转到指定的页面
 * 指定的页面存储在state里
 */

const logger = require('../../util/log').getLogger('app');

let wxLoginCallback = async function(ctx, next){
    logger.debug("wxLogin here");
    let client = ctx.client;
    let code = ctx.request.query.code || '';
    let app = ctx.app;
    
    
    let userInfo = null;

    logger.info("user authorized.");
    // 已经获得授权
    let ret = await new Promise(function(resolve,reject){
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
                if(err){
                    logger.error("getUser error: %j",err.stack);
                    reject(err);
                    return;
                }
                // 获取
                userInfo = result;
                logger.debug("userInfo:%j",userInfo);
                ctx.session.uid = userInfo.openid;   // FIXME： 用户微信登录成功
                resolve(0); 
            });
        }); 
    })
    if(ret === 0){
        // 看看是否已经创建用户记录，如果没有的话，要先创建
        let isUserCreated = await app.userCenter.isUserCreated(userInfo.openid);
        if(!isUserCreated){
            await app.userCenter.createUser(userInfo.openid,userInfo.nickname,userInfo.sex);
        }
        // FIXME: 正常
        let targetUrl = ctx.request.query.state || '';
        logger.info("login ok. goto %j",targetUrl);
        ctx.response.redirect(targetUrl); //FIXME: 定向到目标地址
    }else{
        ctx.body = ctx.renderString("<h1>authorize failed.code: {{ret}}</h1>",{ret:ret});
    }
    await next();    
    
}
module.exports = {
    method: 'get',
    fn: wxLoginCallback
}