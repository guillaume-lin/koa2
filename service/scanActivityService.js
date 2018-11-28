/**
 * 扫码获取积分的活动
 */
const logger = require('../util/log').getLogger('app');

let ScanActivityService = function(app){
    this.app = app;
}
let pro = ScanActivityService.prototype;
pro.name = function(){
    return "scanActivityService";  // access this from app.scanActivityService
}
pro.start = function(){
    logger.debug("start scan activity");
}
pro.drawAward = function(clickCount){
    logger.debug("drawAward: %j",clickCount);
}

module.exports = ScanActivityService;