/**
 * utility function
 */
const uuidv4 = require('uuid/v4');
let util = {
    placeHolder: function(){
        console.log('I am a placeholder.');
    },
    // return a 32 uuid
    uuidgen: function(){
        let id = uuidv4().replace(/-/g,''); // trim the intermediate slash
        return id;
    },
    isDigit: function(ch){
        return ch >= '0' && ch <= '9';
    },
    // 判断是否合法的电话号码
    isPhoneNumber: function(phoneNumber){
        if(!phoneNumber){
            return false;
        }
        if(typeof(phoneNumber) !== 'string'){
            return false;
        }
        let len = phoneNumber.length;
        if(len !== 11){
            return false;
        }
        for(let i=0;i<len;i++){
            if(!this.isDigit(phoneNumber[i])){
                return false;
            }
        }
        return true;
    },
    isPostCode: function(postCode){
        if(!postCode){
            return false;
        }
        if(typeof(postCode) !== 'string'){
            return false;
        }
        let len = postCode.length;
        if(len !== 6){
            return false;
        }
        for(let i=0; i<len; i++){
            if(!this.isDigit(postCode[i])){
                return false;
            }
        }
        return true;
    }
}
module.exports = util;