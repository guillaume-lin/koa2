/**
 * 用户商品表
 * 
 * 积分也是一种特殊的商品
 * 
 * 
 */
const logger = require('../../../util/log').getLogger('app');
const ConstType = require('../../../util/constType');
const mongoose = require('mongoose');
let UserItemSchema = new mongoose.Schema({
    "openId":{type:String}, // 用户标识
    "itemId": {type:String}, // 
    "amount": {type:Number,default: 0}, // 商品数量
    "acquireTime":{type:Number,default:0}, // 获得时间
    "expireTime": {type: Number,default:Number.MAX_SAFE_INTEGER}, // 有效期
});


UserItemSchema.statics.createItem = async function(openId,itemId,amount,acquireTime,expireTime){
    let itemInfo = {
        openId: openId,
        itemId: itemId,
        amount:amount,
        acquireTime:acquireTime,
        expireTime:expireTime
    };
    return await this.create(itemInfo);
};
/**
 * 保存奖品到用户账号
 * awards:
 *   [
 *    {itemId:xxx, amount:yyy}    ]
 * 
 * FIXME: 外界不直接调用这个接口，通过userCenter来调用，因为给的物品中可能有积分，需要做一些特殊处理
 */
UserItemSchema.statics.awardItems = async function(openId,awards){
    logger.debug('awardItems:%j',awards);
    let ct = Date.now();
    let items = awards.map(function(award){
        let item = {};
        item.openId = openId;
        item.itemId = award.itemId;
        item.amount = award.amount;
        item.acquireTime = ct;
        return item;
    })
    let ret = await this.insertMany(items);
    logger.debug('awardItems insert return:%j',ret);
    return ret;
};
/**
 * 消耗商品
 * 需判断是否有足够的商品
 * 返回：
 *  0: 扣减成功,
 *  1: 商品不足
 *  2: 删除出错
 */
UserItemSchema.statics.removeItem = async function(openId,itemId,amount,opts){
    opts = opts || {};
    let ct = Date.now();
    let itemInfos = await this.find({openId:openId,itemId: itemId}).setOptions(opts);
    if(itemInfos.length < 1){
        return 1;
    };
    // 按过期时间进行排序
    itemInfos = itemInfos.sort(function(item1,item2){
        return item1.expireTime - item2.expireTime;
    });
    let removeItems = [];  // 完全消耗完的物品
    let subtractItem = null; // 消耗后还有剩余的物品,最多一件

    let total = amount;
    for(let len=itemInfos.length,i=0; i<len; i++){
        let item = itemInfos[i];
        if(item.expireTime < ct){
            continue;
        }
        if(item.amount >= total){
            subtractItem = item;  // 从该物品中扣除
            break;
        }
        total -= item.amount;
        removeItems.push(item); // 完整扣除该物品
    }
    if(subtractItem === null){
        return 1; // 物品不足
    }

    let ids = removeItems.map(function(item){
        logger.debug("removeItem. itemInfo: %j",item);
        //item.remove(opts);
        return item._id;
    });
    let ret = await this.deleteMany({_id:{$in:ids}}).setOptions(opts);
    if(ret.ok !== 1){
        return 2;
    }
    ret = await subtractItem.updateOne({$inc:{amount:-total}}).setOptions(opts);
    if(ret.ok !== 1){
        return 2;
    }
    // 扣减
    
    logger.debug('removeItem. itemInfo:%j, remove amount:%j, ret: %j',subtractItem,amount,ret);
    return 0;
};
/**
 *  获取用户总的积分
 */
UserItemSchema.statics.getUserPoints = async function(openId){
    let ct = Date.now();
    let aggregate = this.aggregate([{$match:{openId:openId,itemId:ConstType.SPECIAL_ITEM_ID.POINT,expireTime:{$gt:ct}}},
        {$project:{_id:0,amount:1}},{$group:{_id:null,points:{$sum:"$amount"}}}]);
    let ret = await aggregate.exec();
    logger.debug('getUserPoints openId:%j, ret:%j',openId,ret);
    if(ret.length > 0){
        return ret[0].points;
    }else{
        return 0;
    }
}
let model = mongoose.model('UserItem',UserItemSchema);
module.exports = model;