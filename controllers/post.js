let post = async function(ctx, next){
  
    name = ctx.request.body.name || '',
    password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    
    ctx.body = "<html><body><div>got it.</div></body></html>"
    await next();
}
module.exports = {
    method: 'post',
    fn: post
}