let root = async function(ctx, next){
    ctx.render('index.html',{"myName":"haha"});
    await next();
}
module.exports = {
    method: 'get',
    url: '/',
    fn: root
}