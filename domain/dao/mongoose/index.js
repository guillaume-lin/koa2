/**
 * connect to mongoose database
 */
const logger = require('../../../util/log').getLogger('app');
const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');
let dbInit = function(config){
    logger.info("init mongoose %j:%j/%j ...",config.host,config.port,config.database);
    let upw = config.user + ":" + config.password + "@";
    let connStr = "mongodb://";
    if(config.user && config.user.length > 0){
        connStr += upw;
    }
    
    connStr += config.host+":"+config.port+"/"+config.database;
    logger.debug("mongodb connStr:%j",connStr);
    let connOpts = {
        autoReconnect: true,
        keepAlive: true, 
        keepAliveInitialDelay: 300000
    };
    mongoose.connect(connStr,connOpts,function(err){
        if(err){
            logger.error("mongoose connect error: %j",err.stack);
            return;
        }
        logger.info("mongoose connect successfully.");
    });
};
let mongodb = {
    dbInit: dbInit
}
module.exports = mongodb;

