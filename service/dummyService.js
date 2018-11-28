/**
 * define service lifecycle method
 */
const logger = require('../util/log').getLogger('app');

const SERVICE_NAME = "dummyService";
let DummyService = function(app){
    this.app = app;
};

let pro = DummyService.prototype;
pro.name = function(){
    return SERVICE_NAME;
}
pro.start = function(){
    logger.debug("DummyService.start");
};
pro.afterStart = function(){
    logger.debug("DummyService.afterStart");
}
pro.stop = function(){
    logger.debug("DummyService.stop");
}
module.exports = DummyService;