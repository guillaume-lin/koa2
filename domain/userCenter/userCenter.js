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
const daoPictureResource = require('../dao/mongoose/pictureResource');

class UserCenter {
    constructor(app){
        this.app = app;
        this.smsCodeManager = new SmsCodeManager(app);
        let menu = {
            "button":[
                {
                    "type": "view",
                    "name": "用户中心",
                    "url": "http://fcbufr.natappfree.cc/html/userCenter.html"
                }
            ]
            /*,
            "button":[
                {
                    "type": "view",
                    "name": "登录",
                    "url": "http://xkcvqv.natappfree.cc/scanActivity?cdkey=888"
                }
            ]*/
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
            return {code:ConstType.USER_CENTER.VERIFY_SMS_FAILED};
        }
        // 更新用户电话号码
        ret = await daoUser.setPhoneNumber(openId,phoneNumber);
        if(ret === 0){
            return {code: ConstType.OK};
        }else{
            return {code: ConstType.FAILED};
        }
        
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
     * 判断用户账号是否建立
     * @param {*} openId 
     */
    async isUserCreated(openId){
        return await daoUser.findUser(openId);
    }
    /**
     * 创建用户
     * @param {*} openId 
     * @param {*} nickname 
     * @param {*} sex 
     */
    async createUser(openId,nickname,headImage,sex){
        let createResult =  await daoUser.createUser(openId,nickname,headImage,sex);
        logger.info('createUser: %j,%j,%j,%j',openId,nickname,headImage,sex);
        this.app.eventBus.emit('createUser',openId); // 通知创建用户
        this.sendMessage(openId,"欢迎新用户","欢迎关注公众号");
        logger.debug("createResult:%j",createResult);
        return createResult;
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
            ret.vipLevel = this.app.dbJson.vipLevel.getLevel(ret.totalPoints);
            //this.app.eventBus.emit(ConstType.TASK_EVENT.LOGIN,openId); // FIXME: 查询一次用户信息，视为一次登录
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
    };
    /**
     * 给用户物品
     * @param {*} openId 
     * @param {*} items 
     */
    async rewardUserItems(openId, items){
        // 过滤下看物品里面有没有积分，如果有的话，需要更新用户的vip等级
        let ret = await daoUserItem.awardItems(openId,items);
        let pointItem = items.filter(function(item){
            return item.itemId === ConstType.SPECIAL_ITEM_ID.POINT;
        });
        let points = pointItem.reduce(function(acc,cur){
            return acc + cur.amount;
        },0);
        if(points > 0){
            // 用户刚刚获得积分, 
            await this.incTotalPoints(openId,points);
        };
        if(ret.length === item.length){
            return {code:ConstType.OK};
        }else{
            logger.error("rewardUserItems. openId:%j, items:%j, ret:%j",openId,items,ret);
            return {code:ConstType.FAILED};
        }
    }
    /**
     * 奖励用户积分
     * @param {} openId 
     */
    async rewardUserPoints(openId, points){
        let award = {
            itemId:ConstType.SPECIAL_ITEM_ID.POINT,
            amount:points
        };
        let ret = await daoUserItem.awardItems(openId,[award]);
        
        if(!ret || ret.openId === openId){
            return {code:ConstType.FAILED};
        };
        await this.incTotalPoints(openId,points);
        return {code:ConstType.OK};
    }
    /**
     * 更新用户的总积分
     * @param {*} openId 
     */
    async incTotalPoints(openId,points){
        let ret = await daoUser.incTotalPoints(openId,points);
        
        if(ret && ret.ok === 1){
            return {code:ConstType.OK};
        }else{
            logger.error("incTotalPoints failed. openId:%j, ret:%j",openId,ret);
            return {code:ConstType.FAILED};
        }
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
    async getMessageCount(receiver){
        let ret = await daoMessage.getMessageCount(receiver);
        return { code:ConstType.OK, messageCount: ret};
    }
    async getUnreadMessageCount(receiver){
        let ret = await daoMessage.getUnreadMessageCount(receiver);
        return { code:ConstType.OK, messageCount: ret};
    }
    
    async getMessages(receiver, from,to){
        logger.debug("getMessagePage. receiver:%j, from:%j, to:%j",receiver,from,to);
        let ret = await daoMessage.getMessages(receiver,from,to);
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
       //标注消息已读
    async markAllMessageRead(receiver){
        let ret = await daoMessage.markAllMessageRead(receiver);
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
                return {code:ConstType.USER_CENTER.NO_ENOUGH_POINTS,reason:"not enough points"};
            }
            // 扣减商品库存
            ret = await daoExchangeItem.removeItem(itemId,amount,opts);
            logger.debug("consume exchangeItem %j ret:%j",itemId,ret);
            if(ret !== 0){
                session.abortTransaction();
                return {code:ConstType.EXCHANGE_SHOP.ITEM_SOLD_OUT,reason:"no enough item"};
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

    /**
     * 新增可兑换商品
     * 
     * itemId 自动生成
     */
    async addItem(itemInfo){
        let ret = daoExchangeItem.addItem(itemInfo);
        return ret;
    }

    /**
     * 查询id
     * @param {*} itemId 
     */
    async queryItem(itemId){
        let ret = daoExchangeItem.queryItem(itemId);
        if(ret && ret.itemId === itemId){
            return {
                code: ConstType.OK,
                itemInfo:ret
            }
        }else{
            logger.error("queryItem %j failed. ret:%j",itemId,ret);
            return {
                code: ConstType.FAILED
            }
        }
        
    }
    // 活动图
    async getActivityPic(){
        let ret = await daoPictureResource.getAllPicture(ConstType.PIC_TYPE_ACTIVITY);
        return {code: ConstType.OK,pics:ret};
    }

    async insertActivityPic(picUrl,redirectUrl,order){
        let ret = await daoPictureResource.insertPic(ConstType.PIC_TYPE_ACTIVITY,picUrl,redirectUrl,order);
        if(ret.length === 1 && ret[0].picUrl === picUrl){
            return {code: ConstType.OK};
        }else{
            logger.error("insertActivityPic. ret:%j",ret);
            return {code:ConstType.FAILED};
        }
    }
    async deleteActivityPic(picUrl){
        let ret = await daoPictureResource.deletePic(picUrl);
        if(ret && ret.n === 1){
            return {code:ConstType.OK};
        }else{
            logger.error("deleteActivityPic. ret:%j",ret);
            return {code:ConstType.FAILED};
        }
        
    }
    // 轮播图
    async getCarouselPic(){
        let ret = await daoPictureResource.getAllPicture(ConstType.PIC_TYPE_CAROUSEL);
        return {code: ConstType.OK, pics:ret};
    }

    async insertCarouselPic(picUrl,redirectUrl,order){
        let ret = await daoPictureResource.insertPic(ConstType.PIC_TYPE_CAROUSEL,picUrl,redirectUrl,order);
        if(ret.length === 1 && ret[0].picUrl === picUrl){
            return {code: ConstType.OK};
        }else{
            logger.error("insertCarouselPic. ret:%j",ret);
            return {code: ConstType.FAILED};
        }
    }

    async deleteCarouselPic(picUrl){
        let ret = await daoPictureResource.deletePic(picUrl);
        if(ret && ret.n === 1){
            return {code: ConstType.OK};
        }else{
            logger.error("deleteCarouselPic. ret:%j",ret);
            return {code: ConstType.FAILED};
        }
    }
};
module.exports = UserCenter;