/**
 *  扫码抽奖的奖池
 */
const logger = require('../util/log').getLogger('app');

let ScanActivityImpl = function(app){
    this.app = app;
    this.data = [];
}
let pro = ScanActivityImpl.prototype;
pro.name = function(){
    return "scanActivity";
}
/**
 * load the config, and install it app
 */
pro.load = function(){
    let file = this.app.baseDir + '/dbJson/scanActivity.json';
    logger.debug('load dbJsonImpl %j ...',file);
    let json = require(file);
    this.data = json;  
}
/**
 * 获取奖池中的奖品
 */
pro.getPrizes = function(){
    return this.data;
}
module.exports = ScanActivityImpl;