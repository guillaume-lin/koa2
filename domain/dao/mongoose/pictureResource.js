/**
 * 图片资源
 */
const mongoose = require('mongoose');
const logger = require('../../../util/log').getLogger('app');

let PictureResourceSchema = new mongoose.Schema({
    picType: {type:String},     // 图片类型, 1 - 轮播图， 2 - 活动图
    picUrl: {type:String},      // 图片链接
    redirectUrl: {type:String},  // 图片点击跳转链接
    picOrder: {type: Number,default:0}, // 图片顺序,
});

/**
 * 返回所有图片
 */
PictureResourceSchema.statics.getAllPicture = async function(picType){
    return await this.find({picType:picType});
}
/**
 * 新增
 */
PictureResourceSchema.statics.insertPic = async function(picType,picUrl,redirectUrl,picOrder){
    return await this.insertMany([{picType:picType,picUrl:picUrl,redirectUrl:redirectUrl,picOrder}]);
}
/**
 * 删除
 */
PictureResourceSchema.statics.deletePic = async function(picUrl){
    return await this.deleteOne({picUrl:picUrl});
}

let model = mongoose.model('PictureResource',PictureResourceSchema);
module.exports = model;
