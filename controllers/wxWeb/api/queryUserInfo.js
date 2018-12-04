/**
 * 查询会员信息
 */
const logger  = require('../../../util/log').getLogger('app');

let queryUserInfo = async function(ctx, next){
    let app = ctx.app;
    let openId = ctx.session.uid;
    
    let userInfo = await app.userCenter.findUser(openId);
    logger.debug("queryUserInfo. openId: %j, userInfo: %j",openId,userInfo);
    ctx.body = userInfo;
    await next();
}
module.exports = {
    method: 'get',    
    fn: queryUserInfo
}