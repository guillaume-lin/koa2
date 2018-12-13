/**
 * userCenter.js
 * 
 *
 */
const logger = require('../../util/log').getLogger('app');
const daoUser = require('../dao/mongoose/user');
const ConstType = require('../../util/constType');
const SmsCodeManager = require('../smsCodeManager');
const daoMessage = require('../dao/mongoose/message');
const daoUserItem = require('../dao/mongoose/userItem');
const Util = require('../../util/util');
const mongoose = require('mongoose');
const daoExchangeItem = require('../dao/mongoose/exchangeItem');
const daoOrder = require('../dao/mongoose/order');

class UserCenter {
    constructor(app){
        this.app = app;
        this.smsCodeManager = new SmsCodeManager(app);
        let menu = {
            "button":[
                {
                    "type": "view",
                    "name": "登录",
                    "url": "http://xkcvqv.natappfree.cc/scanActivity?cdkey=888"
                }
            ],
            "button":[
                {
                    "type": "view",
                    "name": "用户中心",
                    "url": "http://xkcvqv.natappfree.cc/html/messageCenter.html"
                }
            ]
        }
        app.wechatAPI.createMenu(menu).then(function(ret){
            logger.debug("createMenu:%j",ret);
        }).catch(function(err){
            logger.debug("createMenu error:%j",err);
        })
        
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
    async queryUserInfo(openId){
        logger.debug("userCenter queryUserInfo :%j",openId);
        let ret = await daoUser.findUser(openId);
        if(ret && ret.openId === openId){
            let points = await daoUserItem.getUserPoints(openId);
            ret.points = points;
            this.app.eventBus.emit(ConstType.TASK_EVENT.LOGIN,openId); // FIXME: 查询一次用户信息，视为一次登录
            return ret;
        }else{
            return null;
        }
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
    /**
     * 查询用户积分
     * 积分为一种SKU，不同的分数视为不同的SKU
     * @param {*} openId 
     */
    async queryUserPoints(openId){
        // find from userItem table
        let ret = await daoUserItem.getUserPoints(openId);
        return ret;
    }
    /**
     * 判断用户收货地址是否完整
     * @param {} openId 
     */
    async isAddressComplete(openId){
        let ret = await daoUser.isAddressComplete(openId);
        if(ret === 0){
            return {code:ConstType.OK,complete:true};
        }else{
            return {code:ConstType.OK,complete:false};
        }
    }
    /**
     * 发送消息给用户
     * @param {*} receiver 
     * @param {*} title 
     * @param {*} content 
     */
    async sendMessage(receiver,title,content){
        let ret = await daoMessage.sendMessage(receiver,title,content);
        logger.debug("userCenter sendMessage. title:%j,content:%j, ret:%j",title,content,ret);
        if(ret){
            return {
                code: ConstType.OK
            }
        }else{
            return {
                code: ConstType.FAILED
            }
        }
    }
    /**
     * 
     * @param {*} receiver 
     */
    async getMessagePageCount(receiver){
        let ret = await daoMessage.getMessagePageCount(receiver);
        return { code:ConstType.OK, pageCount: ret};
    }
    async getMessagePage(receiver, pageNumber){
        pageNumber = pageNumber || 0;
        logger.debug("getMessagePage. receiver:%j, pageNumber:%j",receiver,pageNumber);
        let ret = await daoMessage.getMessagePage(receiver,pageNumber);
        if(ret && ret.length >= 0){
            return {code:ConstType.OK,messages:ret};
        }
        return {code:ConstType.FAILED};
    }
    //标注消息已读
    async markMessageRead(receiver,msgId){
        let ret = await daoMessage.markMessageRead(receiver,msgId);
        if(ret){
            return {code:ConstType.OK};
        }else{
            return {code:ConstType.FAILED};
        }
    };
    async deleteMessage(receiver,msgIds){
        let ret = await daoMessage.deleteMessage(receiver,msgIds);
        if(ret.ok === 1){
            return {code:ConstType.OK};
        }
        return {code:ConstType.FAILED};
    };

    async hasUnreadMessage(receiver){
        let ret = await daoMessage.queryUnreadMessage(reciever);
        if(ret > 0){
            return {code:ConstType.OK,unread:1};
        }else if(ret === 0){
            return {code:ConstType.OK,unread:0};
        }else{
            return {code:ConstType.FAILED};
        }
    }
    async queryOnSaleItemCount(){
        let ret = await daoExchangeItem.queryOnSaleItemCount();
        logger.debug("queryOnSaleItemCount:%j",ret);
        return {code:ConstType.OK,count:ret};
    };

    async queryOnSaleItems(from,to){
        let ret  = await daoExchangeItem.queryOnSaleItems(from,to);
        return {code:ConstType.OK, items: ret};
    }
    /**
     * 兑换指定的商品
     *
     * 从userItem扣减用户积分
     * 从exchangeItem扣减商品库存
     * 生成兑换订单
     *  
     **/ 
    async exchangeItem(openId,itemId,amount){
        // 判断是否个人信息完整
        let complete = await this.isAddressComplete(openId);
        if(!complete){
            logger.error("personal info not complete");
            return {code:ConstType.USER_CENTER.PERSONAL_INFO_NOT_COMPLETE,reason: "personal info not complete"};
        }
        // 先判断积分是否足够
        let userPoints  = await daoUserItem.getUserPoints(openId);
        let pointsNeed = await daoExchangeItem.getPointsNeed(itemId);
        pointsNeed = pointsNeed*amount;
        logger.debug("userPoints:%j, pointsNeed:%j",userPoints,pointsNeed);
        if(userPoints < pointsNeed){
            return {code:ConstType.USER_CENTER.NO_ENOUGH_POINTS,reason:"no enough points"};
        }

        // 开始事务
        let ret;
        let session = await mongoose.startSession();
        logger.debug("start session: %j",session);
        try{
            ret = await session.startTransaction();
            logger.debug("startTransaction ret:%j",ret);
            let opts = {session:session};
            // 创建兑换订单
            let orderInfo = {
                itemId:itemId,
                itemAmount:amount,
            };
            ret = await daoOrder.createOrder(orderInfo,opts);
            logger.debug("createOrder %j ret: %j",orderInfo,ret);
            // 扣减用户积分
            ret = await daoUserItem.removeItem(openId,ConstType.SPECIAL_ITEM_ID.POINT,pointsNeed, opts);
            logger.debug("consume points %j ret:%j",pointsNeed,ret);
            if(ret !== 0){
                session.abortTransaction();
                return {code:ConstType.FAILED,reason:"not enough points"};
            }
            // 扣减商品库存
            ret = await daoExchangeItem.removeItem(itemId,amount,opts);
            logger.debug("consume exchangeItem %j ret:%j",itemId,ret);
            if(ret !== 0){
                session.abortTransaction();
                return {code:ConstType.FAILED,reason:"no enough item"};
            }
            ret = await session.commitTransaction();
            logger.debug("commitTransaction ret:%j",ret);
            if(ret.result.ok === 1){
                return {code:ConstType.OK};
            }else{
                return {code:ConstType.FAILED,reason:"commit failed."};
            }
        }catch(err){
            logger.error("exchangeItem err: %j",err.stack);
            ret = await session.abortTransaction();
            logger.debug("abortTransaction ret:%j",ret);
            return {code:ConstType.FAILED,reason:"exception got. abort transaction"};
        }
    };

};
module.exports = UserCenter;