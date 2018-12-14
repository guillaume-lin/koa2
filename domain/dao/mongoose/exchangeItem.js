/**
 * 兑换商店的商品
 */
const mongoose = require('mongoose');
const logger = require('../../../util/log').getLogger('app');

let ExchangeItemSchema = new mongoose.Schema({
    itemId:{type:String,unique:true},  // 商品id
    name: {type:String},  // 商品名称
    pic:{type:String},    // 商品图片
    pointsNeed:{type:Number}, // 兑换所需积分
    stockQuantity:{type:Number}, // 库存数量
    stockTotal: {type:Number}, // 总数量
    isOnSale:{type:Number,default:0}, // 是否上架，0下架，1上架，默认下架
    isHot:{type:Number,default:0}, // 是否热门商品, 0 不是, 1是，默认不是
});

/**
 * 查询所有已上架的热门商品
 */
ExchangeItemSchema.statics.queryOnSaleItems = async function(from,to){
    let ret = await this.find({isOnSale:1,isHot:1}).skip(from).limit(to-from).sort({_id:1});
    return ret;
};
/**
 * 返回已上架热门商品总数
 */
ExchangeItemSchema.statics.queryOnSaleItemCount = async function(){
    let ret = await this.countDocuments({isOnSale:1,isHot:1});
    return ret;
};
/**
 * 标注商品为热门商品
 */
ExchangeItemSchema.statics.markHotItem = async function(itemId){
    let ret = await this.updateOne({itemId:itemId},{$set:{isHot:1}});
    return ret;
};
/**
 * 
 * 查询所有已上架的商品
 */
ExchangeItemSchema.statics.queryOnSaleItems = async function(from,to){
    let ret = await this.find({isOnSale:1}).skip(from).limit(to-from).sort({_id:1});
    return ret;
};
/**
 * 返回在售的商品总类总数
 */
ExchangeItemSchema.statics.queryOnSaleItemCount = async function(){
    let ret = await this.countDocuments({isOnSale:1});
    return ret;
};
/**
 * 入库商品
 */
ExchangeItemSchema.statics.addItem = async function(itemInfo){
    itemInfo.isOnSale = 0; // 默认下架
    let ret = await this.create(itemInfo);
    return ret;
};
/**
 * 设置商品的上下架信息
 */
ExchangeItemSchema.statics.setOnSaleStatus = async function(itemId,status){
    let ret = await this.updateOne({itemId:itemId},{$set:{isOnSale:status}});
    return ret;
};
/**
 * 消耗商品
 */
ExchangeItemSchema.statics.removeItem = async function(itemId,amount,opts){
    opts = opts || {};
    let ret = await this.updateOne({itemId:itemId,stockQuantity:{$gte:amount}},{$inc:{stockQuantity:-amount}}).setOptions(opts);
    if(ret.ok === 1 && ret.n===1 && ret.nModified ===1){
        return 0;
    }else{
        logger.error("no remove any item. ret:%j",ret);
        return 1;
    }
}

ExchangeItemSchema.statics.getPointsNeed = async function(itemId,opts){
    opts = opts || {};
    let ret = await this.findOne({itemId:itemId},{pointsNeed:1}).setOptions(opts);
    if(ret !== null){
        return ret.pointsNeed;
    }else{
        logger.error("getPointsNeed faied. %j",ret);
        return Number.MAX_SAFE_INTEGER;
    }
}

let model = mongoose.model("exchangeItem",ExchangeItemSchema);
module.exports = model;