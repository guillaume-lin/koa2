/**
 * 微信网页登录
 * 登录成功后，跳转到指定的页面
 */

const logger = require('../../util/log').getLogger('app');
const daoUser = require('../../domain/dao/mongoose/user');


let wxLogin = async function(ctx, next){
    logger.debug("wxLogin here");
    let client = ctx.client;
    let code = ctx.request.query.code || '';
    let app = ctx.app;
    
    
    let userInfo = null;
    if(code === ''){
        // FIXME: 发起授权请求
        let redirectUrl = ctx.request.href;
        let targetUrl = ctx.request.query.targetUrl || '';     // 透传数据
        let url = client.getAuthorizeURL(redirectUrl, targetUrl, 'snsapi_userinfo');
        logger.debug("redirect to url:%j",url);
        ctx.response.redirect(url);
        await next();
        return;
    }

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
        let isUserCreated = await daoUser.findUser(userInfo.openid);
        if(!isUserCreated){
            let createResult =  await daoUser.createUser(userInfo.openid,userInfo.nickname,userInfo.sex);
            logger.info('createUser: %j',userInfo);
            app.eventBus.emit('createUser',userInfo.openid); // 通知创建用户
        }
        // FIXME: 正常
        let state = ctx.request.query.state || '';
        ctx.response.redirect(state); //FIXME: 定向到目标地址
    }else{
        ctx.body = ctx.renderString("<h1>authorize failed.code: {{ret}}</h1>",{ret:ret});
    }
    await next();    
    
}
module.exports = {
    method: 'get',
    fn: wxLogin
}