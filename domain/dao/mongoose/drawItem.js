/**
 * 已抽取奖品的计数
 */
const logger = require('../../../util/log').getLogger('app');
const mongoose = require('mongoose');

let DrawItemSchema = new mongoose.Schema({
    "itemId": {type:String,unique: true}, // 物品id, 必须唯一
    "drawCount": {type: Number, default: 0}, // 已抽取的物品数
});

/**
 * 抽取奖品，增加已抽取的奖品数。需确保奖品数不超过上限
 * 成功返回 0
 */
DrawItemSchema.statics.updateDrawItem = async function(itemId, currentDrawCount,maxDrawCount){
    let ret = await this.updateOne({itemId:itemId,drawCount:{$lte:maxDrawCount-currentDrawCount}},
        {$inc:{drawCount:currentDrawCount}},{upsert:true});
    logger.debug("updateDrawCount: %j,ret:%j",currentDrawCount,ret);
    if(ret.nModifed === 1){
        return 0;
    }else{
        return 1;
    }
    
}
/**
 * 获取当前已抽取的奖品数
 */
DrawItemSchema.statics.queryDrawCount = async function(itemIds){
    let ret = await this.find({itemId: {$in:itemIds}});
    logger.debug("queryDrawCount: %j, ret:%j",itemIds,ret);
    return ret;
}
let model = mongoose.model('DrawItem',DrawItemSchema);
module.exports = model;
