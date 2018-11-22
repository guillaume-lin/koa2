/**
 * wechat oauth
 */
const OAuth = require('wechat-oauth');
const Token = require('../dao/mongoose/wechatAuth');

let initAuth = function(appId, secret){
    var client = new OAuth(appId, secret, function (openid, callback) {
        // 传入一个根据openid获取对应的全局token的方法
        // 在getUser时会通过该方法来获取token
        Token.getToken(openid, callback);
      }, function (openid, token, callback) {
        // 持久化时请注意，每个openid都对应一个唯一的token!
        Token.setToken(openid, token, callback);
      });
    return client;

}
module.exports = initAuth;