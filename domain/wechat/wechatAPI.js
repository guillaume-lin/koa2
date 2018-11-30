/**
 * wechat api
 */
var API = require('co-wechat-api');
const Token = require('../dao/mongoose/wechatAPI');

let initAPI = function(appId,secret){

    var api = new API(appId, secret, async function () {
        // 传入一个获取全局token的方法
        var txt = await Token.getToken(appId);
        return JSON.parse(txt);
    }, async function (token) {
        // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
        await Token.setToken(appId,JSON.stringify(token));
  });
  return api;
}
module.exports = initAPI;