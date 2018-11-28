/**
 * 
 */
const logger = require('../util/log').getLogger('app');

let ScanActivityImpl = function(app){
    this.app = app;
    this.data = [];
}
let pro = ScanActivityImpl.prototype;

/**
 * load the config, and install it app
 */
pro.load = function(cb){
    let file = this.app.baseDir + '/dbJson/scanActivity.json';
    logger.debug('load %j ...',file);
    let json = require(file);
    this.data = json;
}
pro.getPrizes = function(){
    return this.data;
}
module.exports = ScanActivityImpl;