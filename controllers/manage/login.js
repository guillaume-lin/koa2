const logger  = require('../../util/log').getLogger('app');
let login = async function(ctx, next){
    logger.debug("login at %j",Date.now());
    ctx.render('post.html',{"myName":"haha"});
    ctx.session.uid = "test";
    await next();
}
module.exports = {
    method: 'get',
    fn: login
}