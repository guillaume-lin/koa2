/**
 * 处理轮播图和活动图
 *
 */
const ConstType = require('../../../util/constType');
const logger = require('../../../util/log').getLogger('app');

let PictureHandler = function(){

}
let pro = PictureHandler.prototype;
// 获取轮播图
pro.getCarouselPic = async function(ctx, next){
    let app = ctx.app;
    let ret = await app.userCenter.getCarouselPic();
    ctx.body = ret;
    return await next();
};
// 获取活动图
pro.getActivityPic = async function(ctx, next){
    let app = ctx.app;
    let ret = await app.userCenter.getActivityPic();
    ctx.body = ret;
    return await next();

}
module.exports = PictureHandler;