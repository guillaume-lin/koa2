const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser')();
const registerMapping = require('./controllers');
const nunjucksMw = require('./middleware/nunjucks');

const isProduction = process.env.NODE_ENV == 'production'; // production environment
let app = new Koa();
let ksOpts = {

};
app.use(require('koa-static')(__dirname+'/static',ksOpts));

let njOpts = {

};
nunjucksMw(app,__dirname+'/views',njOpts); //

app.on("error",(err,ctx)=>{
    console.log(new Date(),":",err);
 });
app.use(bodyParser);
app.use(async(ctx,next) =>{
    console.log(`before process ${ctx.request.method} on ${ctx.request.url}`);
    await next();
    console.log(`after process ${ctx.request.method} on ${ctx.request.url}`);
})

registerMapping(router);
app.use(router.routes());

// init database here

app.listen(8000);