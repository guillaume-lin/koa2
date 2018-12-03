/**
 * 活动页请求获取奖品
 * 
 * 返回本次请求获取到的积分
 * 如果已经获取到积分，则提示错误
 */
const logger  = require('../../../util/log').getLogger('app');
let drawAward = async function(ctx, next){
    logger.debug("drawAward at %j",Date.now());
    
    let app = ctx.app;
    let openId = ctx.session.uid;
    let cdkey = ctx.session.cdkey || '';
    let award = await app.scanActivityService.drawAward(openId,cdkey);
    ctx.body = award;
    await next();
}
module.exports = {
    method: 'get',    
    fn: drawAward
}