/**
 * 扫码获取积分的活动
 */
const logger = require('../util/log').getLogger('app');
const ScanActivity = require('../domain/scanActivity/scanActivity');

let ScanActivityService = function(app){
    this.app = app;
    this.scanActivity = new ScanActivity(app);
}
let pro = ScanActivityService.prototype;
pro.name = function(){
    return "scanActivityService";  // access this from app.scanActivityService
}
pro.start = function(){
    logger.debug("start scan activity");
}
pro.drawAward = async function(openId,cdkey){
    let prizeList = this.app.dbJson.scanActivity.getPrizes();
    logger.debug("drawAward: %j,%j,from: %j",openId,cdkey,prizeList);
    let award = await this.scanActivity.drawAward(openId,cdkey);
    return award;
}

module.exports = ScanActivityService;