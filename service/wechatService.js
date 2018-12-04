/**
 * define service lifecycle method
 */
const logger = require('../util/log').getLogger('app');
const MessageDispatcher = require('../domain/wechat/messageDispatcher');
const SERVICE_NAME = "wechatService";
let WechatService = function(app){
    this.app = app;
    app.messageDispatcher = new MessageDispatcher(app);
};

let pro = WechatService.prototype;
pro.name = function(){
    return SERVICE_NAME;
}
pro.start = function(){
    logger.debug("WechatService.start");
};
pro.afterStart = function(){
    logger.debug("WechatService.afterStart");
}
pro.stop = function(){
    logger.debug("WechatService.stop");
}
module.exports = WechatService;