/**
 * 微信扫码参加活动
 * 返回二维码状态给客户端
 * 0：二维码可用
 * 1: 已过期 / 或者不存在
 * 2: 已被使用
 */
const logger = require('../../util/log').getLogger('app');
const async  = require('async');
const daoUser = require('../../domain/dao/mongoose/user');
const daoCdkey = require('../../domain/dao/mongoose/cdkey');

// 用户扫码 /wxWeb/scanActivity?cdkey=abcdefg12345
// 根据二维码状态进行入库
// 跳转到页面/html/scanActivity.html 进行渲染
let scanActivity = async function(ctx, next){
    let client = ctx.client;

    let cdkey = ctx.request.query.cdkey || ''; // 兑换码
    if(cdkey === ''){
        ctx.body = "<h1>invalid request</h1>";
        return;
    }
    ctx.session.cdkey = cdkey; // 记录用户当前所扫的cdkey
    let openId = ctx.session.uid;    

    ret = await daoCdkey.acquireCdkey(openId,cdkey);
    logger.debug('%j acquire cdkey %j return %j',openId,cdkey,ret);
    ctx.response.redirect('/html/scanActivity.html'); //FIXME: 重定向的扫码页面     
    await next();
    
}
module.exports = {
    method: 'get',
    fn: scanActivity
}