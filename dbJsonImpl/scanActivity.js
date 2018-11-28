/**
 * 
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
pro.getPrizes = function(){
    return this.data;
}
module.exports = ScanActivityImpl;