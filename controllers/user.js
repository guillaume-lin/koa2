let user = async (ctx,next) => {
    ctx.body = "<h2>its me</h2>";
    await next();
}
module.exports = {
    "method": "get",
    "url": "/user",
    "fn": user
}