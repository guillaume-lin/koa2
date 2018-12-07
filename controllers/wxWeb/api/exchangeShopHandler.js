const ConstType = require('../../../util/constType');
const logger = require('../../../util/log').getLogger('app');

let ExchangeShopHandler = function(){

}

let pro = ExchangeShopHandler.prototype;
/**
 * 获取商品总数
 */
pro.queryOnSaleItemCount = async function(ctx,next){
    let app = ctx.app;
    let receiver = ctx.session.uid;
    let ret = await app.userCenter.queryOnSaleItemCount();
    ctx.body = ret;
};

/**
 * 获取商品信息
 */
pro.queryOnSaleItems = async function(ctx,next){
    let app = ctx.app;
    let from = ctx.request.body.from || 0;
    let to = ctx.request.body.to || 0;
    from = parseInt(from);
    to = parseInt(to);
    let ret = await app.userCenter.queryOnSaleItems(from,to);
    ctx.body = ret;
};
/**
 * 兑换商品
 */
pro.exchangeItem = async function(ctx, next){
    let app = ctx.app;
    let openId = ctx.session.uid;
    let itemId = ctx.request.body.itemId;
    let amount = ctx.request.body.amount;
    amount = parseInt(amount);
    let ret = await app.userCenter.exchangeItem(openId,itemId,amount);
    ctx.body = ret;
}
/**
 * 发送消息给用户
 */
pro.sendMessage = async function(ctx, next){
    let app = ctx.app;
    let receiver = ctx.session.uid;
    let title = ctx.request.body.title || '';
    let content = ctx.request.body.content || '';
    let ret = await app.userCenter.sendMessage(receiver,title,content);
    ctx.body = ret;    
};
/**
 * 标注用户已经完成阅读
 */
pro.markMessageRead = async function(ctx,next){
    let app = ctx.app;
    let receiver = ctx.session.uid;
    let msgId = ctx.request.body.msgId;
    let ret = await app.userCenter.markMessageRead(receiver,msgId);
    ctx.body = ret;
};
/**
 * 删除指定消息
 */
pro.deleteMessage = async function(ctx,next){
    let app = ctx.app;
    let receiver = ctx.session.uid;
    let msgIds = ctx.request.body.msgIds.split(';');  // 使用分号分隔
    let ret = await app.userCenter.deleteMessage(receiver,msgIds);
    ctx.body = ret;
}
module.exports = ExchangeShopHandler;