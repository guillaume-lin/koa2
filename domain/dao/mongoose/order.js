/**
 * 积分兑换的订单
 */
const mongoose = require('mongoose');
const logger = require('../../../util/log').getLogger('app');

let OrderSchema = new mongoose.Schema({
    itemId:{type:String,minlength:1},  // 商品id
    itemAmount:{type:Number}, // 商品数量
    orderTime: {type: Number,default:0},  // 下单时间
    buyer:{type:String,minlength:1},    // 下单人的openId
    pointsUsed:{type:Number}, // 兑换所用积分
    consignee:{type:String,minlength:1},  // 收货人
    province: {type:String}, // 收货省
    city: {type:String}, // 收货市
    address:{type:String}, // 收货地址
    postCode:{type:String}, // 邮政编码
    phoneNumber:{type:String,minlength:11}, // 收货人手机, 必填
    orderStatus:{type:Number,default:0}  // 0 - 已下单, 1 - 已审核  2 - 已发货 3 - 已签收 4 - 已退货 5 - 已关闭
});

/**
 * 创建订单
 */
OrderSchema.statics.createOrder = async function(orderInfo,opts){  
    opts = opts || {};
    orderInfo.orderTime = Date.now();
    orderInfo.orderStatus = 0;
    logger.debug("createOrder: %j,%j",orderInfo,opts);
    let ret = await this.create([orderInfo],opts);
    return ret;
};

let model = mongoose.model("Order",OrderSchema);
module.exports = model;
