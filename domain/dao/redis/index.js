/**
 * init redis connection here
 */
const logger = require('../../../util/log').getLogger('app');
const bluebird = require('bluebird');
const redis = require('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
let redisInstance = {};
/**
 * config
 *   host
 *   port
 */
let initRedis = function(config){
    for(let name in config){
        logger.debug("create redis instance for %j",name);
        let client = redis.createClient(config[name]);
        client.on('ready',function(){
            logger.info("redis %j ready.",name);
        });
        redisInstance[name] = client;
    }

}
let getConnection = function(name){
    return redisInstance[name];
}
module.exports = {
    initRedis: initRedis,
    getConnection: getConnection,
}