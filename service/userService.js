const logger = require('../util/log').getLogger('app');
const UserCenter = require('../domain/userCenter/userCenter');
const SERVICE_NAME = "UserService";
let UserService = function(app){
    this.app = app;
    app.userCenter = new UserCenter(app);
};

let pro = UserService.prototype;
pro.name = function(){
    return SERVICE_NAME;
}
pro.start = function(){
    logger.debug("UserService.start");
};
pro.afterStart = function(){
    logger.debug("UserService.afterStart");
}
pro.stop = function(){
    logger.debug("UserService.stop");
}
module.exports = UserService;