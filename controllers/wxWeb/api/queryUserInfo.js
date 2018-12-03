/**
 * 查询会员信息
 */
const logger  = require('../../../util/log').getLogger('app');
const daoUser = require('../../../domain/dao/mongoose/user');

let queryUserInfo = async function(ctx, next){
    logger.debug("queryUserInfo at %j",Date.now());
    
    let app = ctx.app;
    let openId = ctx.session.uid;
    
    let userInfo = await daoUser.findUser(openId);
    ctx.body = userInfo;
    await next();
}
module.exports = {
    method: 'get',    
    fn: drawAward
}