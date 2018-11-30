/**
 * 扫码获取奖励活动
 */
const logger = require('../../util/log').getLogger('app');
const daoCdkey  = require('../dao/mongoose/cdkey');
const daoDrawItem = require('../dao/mongoose/drawItem');
const daoUserItem = require('../dao/mongoose/userItem');

let ScanActivity = function(app){
    this.app = app;
};

let pro = ScanActivity.prototype;

/**
 * 从奖品中抽取一个奖品
 */
pro.drawOneAward = function(awards){
    logger.debug('drawOneAward from: %j',awards);
    let rnd = Math.floor(Math.random()*10000); // 获得一个随机数
    
    let current = 0;
    for(let len=awards.length,i=0;i<len;i++){
        let award = awards[i];
        if(rnd >= current && rnd < current + award.probability){
            // got it
            return award;
        }
        current += award.probability;
    }
    return null;
}
/**
 * 根据用户点击次数抽奖
 * 从配置表里面进行抽奖
 * 返回
 *   res: {
 *     code: 0,  // 0 表示成功
 *     award:{}
 *   }
 * 消耗一个cdkey
 * 只能抽中一个奖品,确保抽中一个
 */

pro.drawAward = async function(openId,cdkey){
    // 消耗cdkey
    let status = await daoCdkey.markCdkeyUsed(openId,cdkey);
    // 如果成功使用cdkey, 则进行抽奖
    if(status !== 0){
        let ret = {
            code: 1,
            award: []
        };
        return ret;
    }
    
    // 获取奖池
    let items = this.app.dbJson.scanActivity.getPrizes();
    let item = null;
    let loopCount = 10;
    while(loopCount-- > 0){
        // 排除已经达到最大抽奖数的奖品
        let drawItems = await daoDrawItem.queryDrawCount(items.map(item =>item.prizeId));
        items = items.filter(function(item){
            for(let len=drawItems.length,i=0; i<len; i++){
                if(item.maxDrawCount > drawItems[i].drawCount){
                    return true;
                }
            }                
            return false;
        })

        // 对每一个奖项配置根据其配置的概率分别进行判断是否抽中
        item = this.drawOneAward(items);
        // 更新奖品的已抽取数量
        await daoDrawItem.updateDrawItem(item.prizeId,item.amount,item.maxDrawCount);
    }
    if(item === null){
        return {
            code:1
        };
    }
    // 保存奖品到用户账号中
    let ret1 = await daoUserItem.awardOneItem(openId,item); 

    if(ret1[0].itemId !== item.itemId){
        logger.error('save award failed. %j',ret1);
        return {
            code: 2 // 保存失败
        };
    }
    return {
        code: 0,
        award:item
    }
    
}
module.exports = ScanActivity;