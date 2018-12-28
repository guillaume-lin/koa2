const logger = require('../../../util/log').getLogger('app');
const daoCdkey = require('../../../domain/dao/mongoose/cdkey');

/**
 * 
 * 查询用户所扫cdkey的使用情况
 *
 * @param {*} ctx 
 * @param {*} next 
 */
let queryCdkeyUsage = async function(ctx,next){
    let cdkey = ctx.session.cdkey;
    let openId = ctx.session.uid;
    let ret = await daoCdkey.checkCdkey(openId,cdkey);
    ctx.body = { code:ret,cdkey:cdkey};
    logger.debug('queryCdkeyUsage: %j',ctx.body);
    await next();
}
module.exports = {
    method: 'get',
    fn: queryCdkeyUsage
}