/**
 * connect to mongoose database
 */

const mongoose = require('mongoose');

let dbInit = function(config){
    let connStr = "mongodb://"+config.user+":"+config.password+"@"+
        config.host+":"+config.port+"/"+config.database;
    let connOpts = {
        autoReconnect: true,
        keepAlive: true, 
        keepAliveInitialDelay: 300000
    };
    mongoose.connect(connStr,connOpts,function(err){

    });
}
module.exports = mongodb;

