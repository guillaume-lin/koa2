const logger  = require('../util/log').getLogger('app');
let login = async function(ctx, next){
    logger.debug("login at %j",Date.now());
    ctx.render('post.html',{"myName":"haha"});
    await next();
}
module.exports = {
    method: 'get',
    url: '/login',
    fn: login
}