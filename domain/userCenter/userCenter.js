/**
 * userCenter.js
 * 
 *
 */
const logger = require('../../util/log').getLogger('app');
const daoUser = require('../dao/mongoose/user');
const ConstType = require('../../util/constType');
const SmsCodeManager = require('../smsCodeManager');
const Util = require('../../util/util');

class UserCenter {
    constructor(app){
        this.app = app;
        this.smsCodeManager = new SmsCodeManager(app);
    }
    /**
     * 注册用户,更新电话号码
     * @param {*} openId 
     * @param {*} phoneNumber 
     * @param {*} verifyCode 
     */
    async registerPhone(openId,phoneNumber,verifyCode){
        let ret = await this.smsCodeManager.verifySmsCode(phoneNumber,verifyCode);
        if(!ret){
            logger.error("verify sms code failed.");
            return {
                code: ConstType.USER_CENTER.VERIFY_SMS_FAILED
            };
        }
        // 更新用户电话号码
        ret = await daoUser.setPhoneNumber(openId,phoneNumber);
        return ret;
    }
    /**
     * 发送验证码给用户的手机
     * @param {*} openId 
     * @param {*} phoneNumber 
     */
    async sendSmsCode(openId,phoneNumber){
        let ret = await this.smsCodeManager.sendSmsCode(openId,phoneNumber);
        return ret;
    }
    /**
     * find a user
     */
    async findUser(openId){
        logger.debug("userCenter findUser :%j",openId);
        return await daoUser.findUser(openId);
    }
    verifyUserInfo(userInfo){
        if(userInfo.hasOwnProperty('phoneNumber') && !Util.isPhoneNumber(userInfo.phoneNumber)){
            logger.error("invalid phoneNumber: %j",userInfo.phoneNumber);
            return false;
        }
        if(userInfo.hasOwnProperty('postCode') && !Util.isPostCode(userInfo.postCode)){
            return false;
        }
        return true;        
    }
    /**
     * 更新用户信息
     * return {code,}
     */
    async updateUserInfo(openId,userInfo){
        logger.debug("userCenter updateUserInfo. openId: %j, userInfo: %j",openId,userInfo);
        // verify data here
        if(!this.verifyUserInfo(userInfo)){
            logger.error("invalid userInfo: %j, openId:%j",userInfo,openId);
            return {
                code: ConstType.FAILED
            }
        }
        let ret = await daoUser.updateUserInfo(openId,userInfo);
        if(ret === 0){
            return {
                code: ConstType.OK
            }
        }else{
            return {
                code: ConstType.FAILED
            }
        }
    }
};
module.exports = UserCenter;