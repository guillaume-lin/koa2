const logger = require('../util/log').getLogger('app');
const redis = require('../domain/dao/redis');
let redisGet = async function(ctx, next){
    let client = redis.getConnection('redis_cache');
    let res = await client.getAsync('date',Date.now()).catch(function(err){
        logger.error('redis get error: %j',err.stack);
    });
    if(!res){
        ctx.body = "<p> failed. </p>";
        return;
    }
    logger.debug('redis get %j',res);    

    logger.debug("redis send back response");
    ctx.body = "<p>OK</p>"
    await next();
}
module.exports = {
    method: 'get',
    fn: redisGet
}