/**
 * 常量定义
 */

 module.exports = {
     PERMISSION_DENIED: -1,
     OK:0,

     // 1000 - 1999
     SCAN_ACTIVITY:{

     },
     // 2000 - 2999
     USER_CENTER: {
         // 短信注册
        INVALID_PHONE_NUMBER: 2001,   // 非法的电话号码
        INVALID_VERIFY_CODE: 2002,   // 非法的验证码
        SEND_SMS_FAILED: 2003,
        VERIFY_SMS_FAILED: 2004,  // 短信验证失败
     }
 }