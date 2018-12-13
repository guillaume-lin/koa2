/**
 * redis session store
 */
const redis = require('./dao/redis');
const session = require('koa-session');
const logger = require('../util/log').getLogger('app');

let RedisSession = function(app){
    this.app = app;
    this.redisClient = redis.getConnection('redis_cache');
    
};
let pro = RedisSession.prototype;
pro.get = async function(key,maxAge,rolling){
    logger.debug("redis session get %j,%j,%j",key,maxAge,rolling);
    let sess =  await this.redisClient.getAsync(key);
    try{
        sess = JSON.parse(sess);
        logger.debug("sess: %j",sess);
        return sess;    
    }catch(err){
        return null;
    }
};
pro.set = async function(key,sess,maxAge,rolling){
    logger.debug("redis session set %j,%j,%j,%j",key,sess,maxAge,rolling);  
    sess = JSON.stringify(sess);
    return await this.redisClient.setAsync(key,sess,'EX',maxAge);
};
pro.destroy = async function(key){
    logger.debug("redis session destroy %j",key);
    return await this.redisClient.delAsync(key);
}

let initRedisSession = function(app){
    logger.debug("initRedisSession");
    let sessionConfig = {
        store: new RedisSession(app)        
    };
    app.use(session(sessionConfig,app));

    return async function(ctx,next){
        return await next();
    }
};
module.exports = initRedisSession;