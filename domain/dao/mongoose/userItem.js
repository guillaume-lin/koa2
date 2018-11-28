/**
 * 用户商品表
 * 
 * 积分也是一种特殊的商品
 */
const logger = require('../../../util/log').getLogger('app');

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
 * 消耗商品
 * 需判断是否有足够的商品
 * 返回：
 *  0: 扣减成功,
 *  1: 商品不足
 */
UserItemSchema.statics.removeItem = async function(openId,itemId,amount){
    let ct = Date.now();
    let itemInfos = await this.find({openId:openId,itemId: itemId});
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

    removeItems.map(function(item){
        logger.debug("removeItem. itemInfo: %j",item);
        item.remove();
    });

    let ret = await subtractItem.update({$inc:{amount:-total}});

    // 扣减
    
    logger.debug('removeItem. itemInfo:%j, remove amount:%j, ret: %j',subtractItem,amount,ret);
    return 0;
}
let model = mongoose.model('UserItem',UserItemSchema);
module.exports = model;