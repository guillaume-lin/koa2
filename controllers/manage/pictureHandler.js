/**
 * 处理轮播图和活动图
 *
 */
const ConstType = require('../../util/constType');
const logger = require('../../util/log').getLogger('app');

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

};
// 插入轮播图
pro.insertCarouselPic = async function(ctx, next){
    let app = ctx.app;
    let picUrl = ctx.request.body.picUrl;
    let redirectUrl = ctx.request.body.redirectUrl;
    let order = ctx.request.body.order;
    let ret = await app.userCenter.insertCarouselPic(picUrl,redirectUrl,order);
    ctx.body = ret;
    return await next();
}
// 插入活动图
pro.insertActivityPic = async function(ctx, next){
    let app = ctx.app;
    let picUrl = ctx.request.body.picUrl;
    let redirectUrl = ctx.request.body.redirectUrl;
    let order = ctx.request.body.order;
    let ret = await app.userCenter.insertActivityPic(picUrl,redirectUrl,order);
    ctx.body = ret;
    return await next();
}
// 删除轮播图
pro.deleteCarouselPic = async function(ctx, next){
    let app = ctx.app;
    let picUrl = ctx.request.body.picUrl;
    let ret = await app.userCenter.deleteCarouselPic(picUrl);
    ctx.body = ret;
    return await next();
}
// 删除活动图
pro.deleteActivityPic = async function(ctx, next){
    let app = ctx.app;
    let picUrl = ctx.request.body.picUrl;
    let ret = await app.userCenter.deleteActivityPic(picUrl);
    ctx.body = ret;
    return await next();
}

module.exports = PictureHandler;