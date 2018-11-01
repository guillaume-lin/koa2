let login = async function(ctx, next){
    ctx.body = "<body><h1>login</h1></body>";
    await next();
}
module.exports = {
    method: 'get',
    url: '/login',
    fn: login
}