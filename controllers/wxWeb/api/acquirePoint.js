/**
 * 活动页获取积分以及奖品
 * 
 * 返回本次请求获取到的积分
 * 如果已经获取到积分，则提示错误
 */
const logger  = require('../../../util/log').getLogger('app');
let acquirePoint = async function(ctx, next){
    logger.debug("acquirePoint at %j",Date.now());

    ctx.session.uid = ctx.session.uid || Date.now();
    logger.debug(ctx.session.uid);
    
    let app = ctx.app;
    let openId = ctx.session.uid;
    let cdkey = ctx.session.cdkey;

    let awards = await app.scanActivityService.drawAward(openId,cdkey);
    ctx.body = awards;
    await next();
}
module.exports = {
    method: 'post',    
    fn: acquirePoint
}