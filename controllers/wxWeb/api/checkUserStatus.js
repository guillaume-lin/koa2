/**
 * 查询用户是否已经关注，是否已经注册
 */
const logger = require('../../../util/log').getLogger('app');

/**
 * 判断用户是否已微信授权登录
 *
 * @param {*} ctx 
 * @param {*} next 
 */
let queryUserStatus = async function(ctx,next){
    let cdkey = ctx.session.cdkey;
    let usage = ctx.session.cdkeyUsage;
    ctx.body = {cdkey:cdkey,usage:usage};
    logger.debug('queryUserStatus: %j',ctx.body);
    await next();
}
module.exports = {
    method: 'get',
    fn: queryUserStatus
}