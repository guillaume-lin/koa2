const logger  = require('../../util/log').getLogger('app');
let login = async function(ctx, next){
    logger.debug("login at %j",Date.now());
    ctx.render('post.html',{"myName":"haha"});
    let openId = ctx.request.query.name || '';
    if(openId === ''){
        ctx.body = "<h1>invalid user name</h1>";
        return;
    }
    ctx.session.uid = openId;
    let app = ctx.app;
    let isUserCreated = await app.userCenter.isUserCreated(openId);
    if(!isUserCreated){
        await app.userCenter.createUser(openId,"nickname",1);
    }
    await next();
}
module.exports = {
    method: 'get',
    fn: login
}