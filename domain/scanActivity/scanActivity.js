/**
 * 扫码获取奖励活动
 */
const logger = require('../../util/log').getLogger('app');
const daoCdkey  = require('../dao/mongoose/cdkey');
const daoUserItem = require('../dao/mongoose/userItem');

let ScanActivity = function(app){
    this.app = app;
};

let pro = ScanActivity.prototype;

/**
 * 根据用户点击次数抽奖
 * 从配置表里面进行抽奖
 * 返回
 *   res: {
 *     code: 0,  // 0 表示成功
 *     awards:[]
 *   }
 */

pro.drawAward = async function(openId,cdkey){
    let status = await daoCdkey.markCdkeyUsed(openId,cdkey);
    // 如果成功使用cdkey, 则进行抽奖
    if(status !== 0){
        let ret = {
            code: 1,
            awards: []
        };
        return ret;
    }
    
    let items = this.app.dbJson.scanActivity.getPrizes();
    // 对每一个奖项配置根据其配置的概率分别进行判断是否抽中
    let awards = [];
    for(let idx in items){
        let item = items[idx];
        if(item.probability > Math.floor(Math.random()*10000)){
            awards.push(item);
        }
    }
    // 保存奖品到用户账号中
    let ret1 = 0;
    if(awards.length > 0){
        ret1 = await daoUserItem.awardItems(openId,awards); 
    }
    if(ret1.length !== awards.length){
        logger.error('save award failed. %j',ret1);
        return {
            code: 2 // 保存失败
        };
    }

    let ret = {
        code: 0,
        awards: awards
    }
    return ret;
}
/**
 * 检查用户是否可以抽奖
 */
pro.checkCanDrawAward = function(openId,cdkey){

}
/**
 * 保存抽奖结果到数据库
 */
pro.saveAwardResult = function(){

}
module.exports = ScanActivity;