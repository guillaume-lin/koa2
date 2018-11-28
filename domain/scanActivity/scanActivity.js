/**
 * 扫码获取奖励活动
 */
const logger = require('../../util/log').getLogger('app');


let ScanActivity = function(app){
    this.app = app;
};

let pro = ScanActivity.prototype;

/**
 * 根据用户点击次数抽奖
 * 从配置表里面进行抽奖
 */

pro.drawAward = function(clickCount){
    let items = this.app.dbJson.scanActivity.getPrizes();
    // 对每一个奖项配置根据其配置的概率分别进行判断是否抽中
    let awards = [];
    for(let idx in items){
        let item = items[idx];
        if(item.probability > Math.floor(Math.random()*10000)){
            awards.push(item);
        }
    }
    return awards;
}

module.exports = ScanActivity;