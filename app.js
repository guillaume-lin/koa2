const EventEmitter = require('events');
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const xmlParser = require('koa-xml-body');
const koaBody = require('koa-body');
const session = require('./domain/redisSession');
const registerMapping = require('./controllers');
const nunjucksMw = require('./middleware/nunjucks');
const log = require('./util/log');
const mongoose = require('./domain/dao/mongoose');
const redis = require('./domain/dao/redis');
const wechatAuth = require('./domain/wechat/auth');
const wechatAPI  = require('./domain/wechat/wechatAPI');
const ConstType  = require('./util/constType');
const service = require('./service');
const dbJsonImpl = require('./dbJsonImpl');
const statsd = require('./middleware/stat');

const isProduction = process.env.NODE_ENV === 'production'; // production environment

let app = new Koa();
app.eventBus = new EventEmitter(); // event bus
app.baseDir = __dirname;
app.name = process.argv[2] || 'noname' ; // node app.js <name>

log.configure(require('./config/log4js.json'));
let logger = log.getLogger('app');
logger.debug("starting %j ...","koa2");

let ksOpts = {
};
app.use(require('koa-static')(__dirname+'/static',ksOpts));
app.keys = ['im a newer secret', 'i like turtle too'];
let njOpts = {
    noCache: !isProduction   // 非生产环境不cache模板
};
nunjucksMw(app,__dirname+'/views',njOpts); 

// init database here
mongoose.dbInit(require('./config/mongodb.json'));
redis.initRedis(require('./config/redis.json'));

let wechatConf = require('./config/wechat.json');
app.context.client = app.wechatAuth = wechatAuth(wechatConf.appId,wechatConf.secret);
app.context.wechatAPI = app.wechatAPI = wechatAPI(wechatConf.appId,wechatConf.secret);

// use session
app.use(session(app));

app.use(statsd(app,require('./config/statsd.json')));

process.on('unhandledRejection', error => {
    logger.fatal("unhandledRejection: %j",error.stack);
});
app.on("error",(err,ctx)=>{
    console.log(new Date(),":",err);
 });
app.use(xmlParser());
//app.use(bodyParser());
app.use(koaBody({
    patchKoa: true,
    multipart: true,
    maxFileSize: 20*1024*1024, // 20M
    formidable:{
        uploadDir:'upload',
        onFileBegin:function(name,file){
            logger.debug("onFileBegin: %j,%j",name,file);
        }        
    },
    onError:function(err){
        logger.error("koaBody error: %j",err.stack);
    }
}))
app.use(async(ctx,next) =>{
    app.sdc.increment(app.name+'.req',1); // inc
    if(ctx.request.url.indexOf('/favicon.ico') !== -1){
        logger.debug('not process favicon');
        return;
    }
    logger.debug("before process %j on %j  req:%j",ctx.request.method,ctx.request.url,ctx.request);
    let ct = Date.now();
    await next();
    let dt = Date.now();
    app.sdc.timing(app.name+'.req',dt-ct);
    logger.debug("after process %j on %j res:%j\n\n",ctx.request.method,ctx.request.url,ctx.response);
})

/**
 * 权限控制
 */
app.use(async (ctx,next) => {
    logger.debug("before check privillege");
    if(ctx.request.url.indexOf('/wxWeb/wxAccess') !== -1){
        return await next();
    };
    if(ctx.request.url.indexOf('/manage') !== -1){  // FIXME: 此处应使用其他认证方式
        return await next();
    };
    if(ctx.request.url.indexOf('/wxWeb/wxGetAuthorizeUrl') !== -1 || ctx.request.url.indexOf('/wxWeb/wxLoginCallback') !== -1){
        return await next();
    }
    // 验证下用户是否已经用微信登录
    ctx.session.uid = ctx.session.uid || '';
    logger.debug('uid is:%j',ctx.session.uid);
    if(ctx.session.uid === '' && ctx.request.url.indexOf('/wxWeb/wxLogin') === -1){
        
        logger.error('user not login');
        if(ctx.request.url.indexOf('/wxWeb/api/') !== -1){
            // 访问api
            logger.error('未登录时访问api: %j',ctx.request.url);
            ctx.body = {code: ConstType.PERMISSION_DENIED};
            return;
        }
        // 重定向到登录页面
        let redirectUrl = '/wxWeb/wxLogin?targetUrl=' + ctx.request.url;
        logger.info('not login redirect to %j',redirectUrl);
        ctx.response.redirect(redirectUrl);
        return;
    };
    await next();
})

registerMapping(router);
app.use(router.routes());


app.config = {};
app.config.alisms = {};
app.config.alisms = require('./config/alisms.json');
dbJsonImpl.load(app);
// load business service here
service.load(app);

logger.info("app start from dir: %j",app.baseDir);
//app.listen(8000);
module.exports = app;