/**
 * 用redis存储验证码
 */
const logger = require('../util/log').getLogger('app');
const redis = require('./dao/redis');
const SMSClient = require('@alicloud/sms-sdk');
const ConstType = require('../util/constType');

const CODE_EXPIRE_SEC = 15*60; // 15 min
const CODE_SEND_FREQ = 60; // 发送频率60秒

let SmsCodeManager = function(app){
    this.app = app;
    this.smsSignName = app.config.alisms.smsSignName;
    this.smsTemplate = app.config.alisms.smsTemplate;
    this.smsClient = new SMSClient({accessKeyId:app.config.alisms.accessKeyId, secretAccessKey:app.config.alisms.secretAccessKey});
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
pro.sendSmsCode = async function(openId,phoneNumber){
    logger.debug("sendSmsCode to %j %j",openId,phoneNumber);
    let self = this;
    
    // 验证电话号码格式

    // 发送频率检查
    let res = await this.redisClient.getAsync(phoneNumber+'-lastSend');
    logger.debug("check send frequence. %j",res);
    if(res){
        logger.error("request too fast. %j",res);
        return {code:ConstType.FAILED};
    };
    this.redisClient.setAsync(phoneNumber+'-lastSend',Date.now(),'EX',CODE_SEND_FREQ); // 设置已发送标识
    // 发送次数检查，是否超过当日上限

    // 请求IP是否在黑名单里

    // 生成验证码，存储到redis, 设定超时时间
    let smsCode = this.genSmsCode();
    res = await this.redisClient.setAsync(phoneNumber,smsCode,'EX',CODE_EXPIRE_SEC); 
    logger.debug("redis set res: %j",res);

    try{
        let ret = await this.smsClient.sendSMS({
            PhoneNumbers: phoneNumber,  // 必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式；发送国际/港澳台消息时，接收号码格式为：国际区号+号码，如“85200000000”
            SignName: self.smsSignName,       // 必填:短信签名-可在短信控制台中找到
            TemplateCode: self.smsTemplate, // 必填:短信模板-可在短信控制台中找到，发送国际/港澳台消息时，请使用国际/港澳台短信模版
            TemplateParam: '{"code": '+smsCode+'}' //可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时。
        });
        logger.debug("sendSMS ret:%j",ret);
        if(ret.Code === "OK"){
            return {
                code:ConstType.OK
            }
        }
    }catch(err){
        logger.error("sendSMS ret error:%j",err.stack);
        return {
            code: ConstType.USER_CENTER.SEND_SMS_FAILED
        }    
    }
    
}

/**
 * 从redis里面读取电话号码对应的验证码
 * 
 */
pro.verifySmsCode = async function(phoneNumber, smsCode){
    let res = await this.redisClient.getAsync(phoneNumber);
    logger.debug("verfiySmsCode. %j,%j res:%j",phoneNumber,smsCode,res);
    if(res === smsCode){
        // 验证成功
        return true;
    }
    return false;
}

module.exports = SmsCodeManager;
