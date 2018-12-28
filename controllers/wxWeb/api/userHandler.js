const ConstType = require('../../../util/constType');
const logger = require('../../../util/log').getLogger('app');

let UserHandler = function(){

}
let pro = UserHandler.prototype;
pro.queryUserInfo = async function(ctx,next){
    let app = ctx.app;
    let openId = ctx.session.uid;

    let info = await app.userCenter.queryUserInfo(openId);
    if(!info){
        ctx.body = {code: ConstType.FAILED};
        return await next();
    }
    delete info.openId;
    logger.debug("queryUserInfo: %j",info);
    ctx.body = {code: ConstType.OK,userInfo:info};
    
    return await next();
}
/**
 * 修改用户信息
 */
pro.updateUserInfo = async function(ctx,next){
    let app = ctx.app;
    let openId = ctx.session.uid;
    let userInfo = {};
    let b = ctx.request.body;
    userInfo.nickName = b.nickName || '';
    userInfo.name = b.name || '';
    userInfo.phoneNumber = b.phoneNumber || '';
    userInfo.babyBirthDay = b.babyBirthDay || 0;
    userInfo.babySex = b.babySex || 0;
    userInfo.consignee = b.consignee || '';
    userInfo.province = b.province || '';
    userInfo.city = b.city || '';
    userInfo.address = b.address || '';
    userInfo.postCode = b.postCode || '';

    for(let f in userInfo){
        if(userInfo.hasOwnProperty(f) && !userInfo[f]){
            delete userInfo[f];  // 去掉没有设置的属性
        }
    }
    
    logger.debug("userHandler.updateUserInfo: %j",userInfo);
    let ret = await app.userCenter.updateUserInfo(openId,userInfo);
    ctx.body = ret;
    return await next();
};
// 检查用户的收货地址是否完全
pro.isAddressComplete = async function(ctx,next){
    let app = ctx.app;
    let openId = ctx.session.uid;
    let ret = await app.userCenter.isAddressComplete(openId);
    ctx.body = ret;
    return await next();
}
module.exports = UserHandler;