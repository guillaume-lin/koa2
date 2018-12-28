const ConstType = require('../../util/constType')
const logger = require('../../util/log').getLogger('app');
const Util = require('../../util/util');

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
    return await next();
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
    return await next();
};
/**
 * 新增商品
 *  itemId:{type:String,unique:true},  // 商品id
    name: {type:String},  // 商品名称
    pic:{type:String},    // 商品图片
    pointsNeed:{type:Number}, // 兑换所需积分
    stockQuantity:{type:Number}, // 库存数量
    stockTotal: {type:Number}, // 总数量
    isOnSale:{type:Number,default:0}, // 是否上架，0下架，1上架，默认下架
    isHot:{type:Number,default:0}, // 是否热门商品, 0 不是, 1是，默认不是
 */
pro.addItem = async function(ctx, next){
    let app = ctx.app;
    let openId = ctx.session.uid;
    let itemInfo = {};
    itemInfo.itemId = "EX-" + Util.uuidgen(); // 唯一性id
    itemInfo.name = ctx.request.body.name;
    itemInfo.pic = ctx.request.body.pic;
    itemInfo.pointsNeed = ctx.request.body.pointsNeed;
    itemInfo.stockQuantity = itemInfo.stockTotal = ctx.request.body.stockTotal;
    itemInfo.isOnSale = ctx.request.body.isOnSale;
    itemInfo.isHot = ctx.request.body.isHot;

    let ret = await app.userCenter.exchangeItem(openId,itemId,amount);
    ctx.body = ret;
    return await next();
}

module.exports = ExchangeShopHandler;