/**
 * 查询用户cdkey的使用情况
 */
const logger = require('../../../util/log').getLogger('app');

/**
 * 判断用户是否已微信授权登录
 * 从用户的session里面找到用户所扫二维码，返回给用户 
 * @param {*} ctx 
 * @param {*} next 
 */
let queryCdkeyUsage = async function(ctx,next){
    let cdkey = ctx.session.cdkey;
    let usage = ctx.session.cdkeyUsage;
    ctx.body = {cdkey:cdkey,usage:usage};
    logger.debug('queryCdkeyUsage: %j',ctx.body);
    await next();
}
module.exports = {
    method: 'get',
    fn: queryCdkeyUsage
}