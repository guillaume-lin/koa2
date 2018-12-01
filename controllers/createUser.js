
/**
 * create a user with user name and password 
 * @param {c} ctx 
 * @param {*} next 
 */
const logger = require('../util/log').getLogger('app');
const DaoUser = require('../domain/dao/mongoose/user');
const Util = require('../util/util');

let user = async (ctx,next) => {
    logger.debug("response status:%j", ctx.response.status);
    logger.debug('create user. method:%j',ctx.request.method);
    let user = ctx.request.body.user || '';
    let password = ctx.request.body.password || '';
    logger.debug('createUser: user:[%j], passowrd:[%j]',user,password);
    if(user === ''){
        logger.debug('view to create user ...');
        ctx.render('createUser.html',{});
        await next(); 
        return;
    }
    let userRes = await DaoUser.create({'userId':user,"nickName":user,"openId":Util.uuidgen()}).catch(function(err){
        if(err){
            logger.error("crate usr failed. %j",err.stack);
            ctx.body = "<h2> create failed.</h2>";
        }
    });
    if(!userRes){
        ctx.body = "<h2> not create user. </h2>";
        await next();
        return;
    }
    logger.debug('create the user.%j',userRes);
    ctx.body = "<h2>created</h2>";
    await next();
}
module.exports = {
    "method": "all",
    "fn": user
}