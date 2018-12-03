/**
 * 查询用户是否已经关注，是否已经注册
 */
const logger = require('../../../util/log').getLogger('app');
const daoUser = require('../../../domain/dao/mongoose/user');
/**
 * 
 *
 * @param {*} ctx 
 * @param {*} next 
 * @return {*} 
 *   code 
 *   subscribe  
 *   register
 */
let queryUserStatus = async function(ctx,next){
    let openId = ctx.session.uid;
    let user = await daoUser.findUser(openId);
    logger.debug('user doc: %j',user);
    let info = await ctx.wechatAPI.getUser(openId);
    logger.debug('wechat api userInfo: %j',info);
    if(!user || !info){
        ctx.body =  {
            code: 1,
        };
        return;
    }
    let status = {
        code: 0,
        subscribe: info.subscribe,
    }
    if(user.phoneNumber != ''){
        status.register = 1;
    }else{
        status.register = 0;
    }
    ctx.body = status;
    logger.debug('queryUserStatus: %j',ctx.body);
    await next();
}
module.exports = {
    method: 'get',
    fn: queryUserStatus
}