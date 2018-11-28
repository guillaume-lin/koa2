/**
 * 微信扫码参加活动
 * 返回二维码状态给客户端
 * 0：二维码可用
 * 1: 已过期 / 或者不存在
 * 2: 已被使用
 */
const logger = require('../util/log').getLogger('app');
const async  = require('async');
const daoUser = require('../domain/dao/mongoose/user');
const daoCdkey = require('../domain/dao/mongoose/cdkey');

let scanActivity = async function(ctx, next){
    let client = ctx.client;
    let code = ctx.request.query.code || '';
    let cdkey = ctx.request.query.cdkey || ''; // 兑换码
    let state = ctx.request.query.state || ''; // 跳转后的cdkey
    let userInfo = null;
    if(code !== ''){
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
                    daoCdkey.isValidKey(state,function(err,res){
                        if(err){
                            logger.error("check valid key. err:%j",err.stack);
                            return reject(err);
                        }
                        if(!res){
                            return resolve(1);
                        }

                        // 更新cdkey
                        daoCdkey.acquireCdkey(state,userInfo.openid,function(err,res){
                            if(err){
                                logger.error('acquireCdkey: %j',err.stack);
                                reject(err);
                                return;
                            }
                            logger.debug("acquireCdkey: %j",res);
                            if(res){
                                resolve(0);
                            }else{
                                resolve(2);
                            }
                        })
                    })                   
                  });
              }); 
        })
        if(ret === 0){
            // 看看是否已经创建用户记录，如果没有的话，要先创建
            let isUserCreated = await daoUser.findUser(userInfo.openid);
            if(!isUserCreated){
                let createResult =  await daoUser.createUser(userInfo.openId,userInfo.nickName,userInfo.sex);
                logger.info('createUser: %j',userInfo);
            }
        }
        ctx.render('index.html',{result:ret}); // test 
        
        await next();
        return;
    }
    
    let redirectUrl = ctx.request.href;
    let url = client.getAuthorizeURL(redirectUrl, cdkey, 'snsapi_userinfo');
    logger.debug("redirect to url:%j",url);
    //ctx.body = "<a href="+url+"> click here</a>";
    ctx.response.redirect(url);
    await next();
    
}
module.exports = {
    method: 'get',
    url: '/scanActivity',
    fn: scanActivity
}