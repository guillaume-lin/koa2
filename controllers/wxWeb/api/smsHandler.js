/**
 * 用短信注册
 *
 */
const ConstType = require('../../../util/constType');
const logger = require('../../../util/log').getLogger('app');

let SmsHandler = function(){

}
let pro = SmsHandler.prototype;
/**
 * 使用短信注册手机号
 */
pro.registerPhone = async function(ctx, next){
    logger.debug('registerPhone');
    let app = ctx.app;
    let openId = ctx.session.uid;
    let phoneNumber = ctx.request.body.phoneNumber || '';
    let verifyCode = ctx.request.body.verifyCode || '';
    let ret = await app.userCenter.registerPhone(openId,phoneNumber,verifyCode);
    ctx.body = {code:ret};
    return await next();
}
/**
 *  获取验证码
 */
pro.getSmsCode = async function(ctx, next){
    logger.debug('getSmsCode');
    let app = ctx.app;
    let openId = ctx.session.uid;
    let phoneNumber = ctx.request.body.phoneNumber || '';

    let ret = await app.userCenter.sendSmsCode(openId,phoneNumber);
    ctx.body = ret;
    return await next();    
}
module.exports = SmsHandler;