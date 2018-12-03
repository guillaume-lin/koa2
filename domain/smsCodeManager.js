/**
 * 用redis存储验证码
 */
const logger = require('../util/log').getLogger('app');
const redis = require('./dao/redis');
const SMSClient = require('@alicloud/sms-sdk')

const CODE_EXPIRE_SEC = 15*60; // 15 min
const CODE_SEND_FREQ = 60; // 发送频率60秒

let SmsCodeManager = function(app,accessKeyId,accessKeySecret,smsSignName,smsTemplate){
    this.app = app;
    this.smsSignName = smsSignName;
    this.smsTemplate = smsTemplate;
    this.smsClient = new SMSClient({accessKeyId, secretAccessKey});
    this.redisClient = redis.getConnection('redis_cache');
}

let pro = SmsCodeManager.prototype;

/**
 * 生成4位随机数
 */
pro.genSmsCode = function(){
    let rnd = Math.floor(Math.random()*10000);
    if(rnd < 1000){
        rnd += 1000; // 确保有四位数
    }
    return rnd;
}

/**
 * 发送短信验证码
 * 控制对同一手机的发送频率
 */
pro.sendSmsCode = async function(phoneNumber){
    let self = this;
    
    // 验证电话号码格式

    // 发送频率检查

    // 发送次数检查，是否超过当日上限

    // 请求IP是否在黑名单里

    // 生成验证码，存储到redis, 设定超时时间
    let code = this.genSmsCode();
    let res = await this.redisClient.setAsync(phoneNumber,code,'EX',CODE_EXPIRE_SEC); 

    smsClient.sendSMS({
        PhoneNumbers: phoneNumber,  // 必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式；发送国际/港澳台消息时，接收号码格式为：国际区号+号码，如“85200000000”
        SignName: self.smsSignName,       // 必填:短信签名-可在短信控制台中找到
        TemplateCode: self.smsTemplate, // 必填:短信模板-可在短信控制台中找到，发送国际/港澳台消息时，请使用国际/港澳台短信模版
        TemplateParam: '{"code":code}' //可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时。
    }).then(function (res) {
        let {Code}=res
        if (Code === 'OK') {
            //处理返回参数
            logger.debug(res);
        }
    }, function (err) {
        logger.error("",err.stack);
    })
}

/**
 * 从redis里面读取电话号码对应的验证码
 * 
 */
pro.verifySmsCode = function(phoneNumber, smsCode){
    let res = await this.redisClient.getAsync(phoneNumber);
    logger.debug("verfiySmsCode. %j,%j res:%j",phoneNumber,smsCode,res);
    if(res === smsCode){
        // 验证成功
        return true;
    }
    return false;
}

module.exports = SmsCodeManager;
