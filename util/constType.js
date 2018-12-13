/**
 * 常量定义
 */

 module.exports = {
     PERMISSION_DENIED: -1,
     OK:0,
     FAILED:1,

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
        NO_ENOUGH_POINTS: 2005, // 积分不足
     },
     // 以下定义商品id, 1000 - 9999
     SPECIAL_ITEM_ID:{
         POINT: '1000',   // 积分，芯豆
     },
     // 订单状态
     // 任务事件
     TASK_EVENT:{
         LOGIN: 'login', // 每日登录
         COMPLETE_PERSON_INFO:"completePersonInfo", // 完善个人信息
         SHARE: 'share',   // 分享
         ACQUIRE_POINTS: 'acquirePoints',  // 获得积分
         READ: 'read',    // 阅读公众号文章
     }
 }