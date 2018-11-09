/**
 * utility function for wechat
 */
const logger = require('../../util/log').getLogger('app');
const crypto = require('crypto');


 /**
  * return true if pass the check
  * @param {*} token 
  * @param {*} timestamp 
  * @param {*} nonce 
  * @param {*} signature 
  */

let checkWxSignature = function(token,timestamp,nonce,signature){
    // 1, sort
    let arr = [token,timestamp,nonce];
    arr.sort();
    let str = arr.join('');
    // 2. encrypt with sha1
    const hash = crypto.createHash('sha1');    
    hash.update(str);
    let enc = hash.digest('hex');
    logger.debug("%j encrypt to %j",str,enc);
    // 3. check with signature
    if(enc === signature){
        return true;
    }else{
        return false;
    }
}
module.exports = {
    checkWxSignature:checkWxSignature
}