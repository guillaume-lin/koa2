/**
 * 活动页获取积分以及奖品
 * 
 * 返回本次请求获取到的积分
 * 如果已经获取到积分，则提示错误
 */
const logger  = require('../util/log').getLogger('app');
let acquirePoint = async function(ctx, next){
    logger.debug("acquirePoint at %j",Date.now());
    
    let clickCount = Number.parseInt(ctx.request.body.clickCount || '0');
    let app = ctx.app;

    // 从配置表中抽取物品给用户，下发给客户端
    
    app.scanActivityService.drawAward(clickCount);

    await next();
}
module.exports = {
    method: 'post',
    url: '/acquirePoint',
    fn: acquirePoint
}