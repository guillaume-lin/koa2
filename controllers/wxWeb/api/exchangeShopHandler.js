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

module.exports = ExchangeShopHandler;