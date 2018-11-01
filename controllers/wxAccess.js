/**
 * access this site from wechat
 * 
 * 1. check if the client is wechat
 * 2. login this site with wechat account
 * 3. check if the user have follow us
 * 4. if not, redirect to page, ask the user to follow us(page follow), once following, redirect to 3
 * 5. check if the user have register with mobile phone 
 * 6. if not, redirect to page, ask the user to register with mobile phone(page register phone), once registered, redirect to 5
 * 7. show the user's home page (page home)
 */
let wx = async (ctx, next) => {
    await next();
}
module.exports = {
    'method':'get',
    "url": '/wx',
    'fn': wx
}