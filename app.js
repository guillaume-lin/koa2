const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser')();
const registerMapping = require('./controllers');
const nunjucksMw = require('./middleware/nunjucks');
const log = require('./util/log');
const mongoose = require('./domain/dao/mongoose');
const redis = require('./domain/dao/redis');
const wechatAuth = require('./domain/wechat/auth');
const service = require('./service');
const dbJsonImpl = require('./dbJsonImpl');

const isProduction = process.env.NODE_ENV == 'production'; // production environment
let app = new Koa();

app.baseDir = __dirname;

log.configure(require('./config/log4js.json'));
let logger = log.getLogger('app');
logger.debug("starting %j ...","koa2");

let ksOpts = {
};
app.use(require('koa-static')(__dirname+'/static',ksOpts));

let njOpts = {
    noCache: !isProduction   // 非生产环境不cache模板
};
nunjucksMw(app,__dirname+'/views',njOpts); //

process.on('unhandledRejection', error => {
    logger.fatal("unhandledRejection: %j",error.stack);
    console.error('unhandledRejection', error);
    process.exit(1) // To exit with a 'failure' code
});
app.on("error",(err,ctx)=>{
    console.log(new Date(),":",err);
 });

app.use(bodyParser);
app.use(async(ctx,next) =>{
    logger.debug("before process %j on %j  req:%j",ctx.request.method,ctx.request.url,ctx.request);
    await next();
    logger.debug("after process %j on %j\n",ctx.request.method,ctx.request.url);
})

registerMapping(router);
app.use(router.routes());

// init database here
mongoose.dbInit(require('./config/mongodb.json'));
redis.initRedis(require('./config/redis.json'));

let wechatConf = require('./config/wechat.json');
app.context.client = wechatAuth(wechatConf.appId,wechatConf.secret);

dbJsonImpl.load(app);
// load business service here
service.load(app);

logger.info("app start from dir: %j",app.baseDir);
app.listen(8000);