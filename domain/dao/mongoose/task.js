/**
 * 当前任务完成情况
 */
const mongoose = require('mongoose');
const logger = require('../../../util/log').getLogger('app');

let TaskSchema = new mongoose.Schema({
    openId: {type:String,unique:true}, // 任务执行者
    taskId: {type:Number}, // 当前任务id
    resetDaily:{type: Boolean}, // 是否每天刷新重置
    progress: {type:Number,default:0}, // 任务进度，-1代表已领取奖励，关闭 , -2 代表已完成，可领取奖励   
});

/**
 * 给用户分配一个任务
 */
TaskSchema.statics.assignTask = async function(openId,taskId,resetDaily){
    let ret = await this.updateOne({openId:openId},{$set:{openId:openId,taskId:taskId,resetDaily:resetDaily,progress:0}},{upsert:true});
    logger.debug("assignTask:%j",ret);
    return  ret;
}
/**
 * 完成部分任务
 */
TaskSchema.statics.completeTaskPiece = async function(openId,taskId){
    let ret = await this.updateOne({openId:openId,taskId:taskId,progress:{$gte:0}},{$inc:{progress:1}});
    logger.debug("completeTask: %j",ret);
    return ret;
};
/**
 * 完成整个任务
 */
TaskSchema.statics.tryCompleteFullTask = async function(openId,taskId,goal){
    let ret = await this.updateOne({openId:openId,taskId:taskId,progress:{$gte:goal}},{$set:{progress:-2}});
    logger.debug("try complete full task. %j",ret);
    return ret;
}
/**
 * 复位任务
 */
TaskSchema.statics.resetAllTask = async function(){
    let ret = await this.updateMany({
        $and:[
            {progress:{$gt:0}},
            {resetDaily:true}   // 只复位那些需要复位的
        ]
    },{$set:{progress:0}});
    logger.debug("resetTask:%j",ret);
    return ret;
};
/**
 * 关闭任务，置为已完成
 */
TaskSchema.statics.closeTask = async function(openId,taskId){
    let ret = await this.updateOne({openId:openId,taskId:taskId,progress:{$ne:-1}},{$set:{progress:-1}});
    return ret;
}
/**
 * 查询用户的当前任务
 */
TaskSchema.statics.queryTask = async function(openId){
    let ret = await this.findOne({openId:openId});
    logger.debug('query task for %j, ret:%j',openId,ret);
    return ret;
}
let model = mongoose.model("Task",TaskSchema);
module.exports = model;