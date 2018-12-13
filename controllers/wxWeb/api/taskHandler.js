/**
 * 任务处理
 *
 */
const ConstType = require('../../../util/constType');
const logger = require('../../../util/log').getLogger('app');

let TaskHandler = function(){

}
let pro = TaskHandler.prototype;
/**
 * 查询用户的任务列表（包括已完成和未完成的）
 */
pro.queryTaskList = async function(ctx, next){
    let app = ctx.app;
    let openId = ctx.session.uid;
    logger.debug(app.dbJson.taskInfo);
    let ret = await app.taskManager.queryTaskList(openId);
    app.eventBus.emit('login',openId);
    ctx.body = ret;
};

/**
 * 领取任务奖励
 */
pro.rewardTask = async function(ctx, next){
    let taskId = ctx.request.body.taskId;
    let openId = ctx.session.uid;
    let ret = await app.taskManager.rewardTask(openId,taskId);
    ctx.body = ret;
};

/**
 * 查询任务详细信息
 */
pro.queryTaskInfo = async function(ctx, next){
    let taskId = ctx.request.body.taskId;
    let openId = ctx.session.uid;
    let ret = await app.taskManager.queryTaskInfo(openId,taskId);
    ctx.body = ret;
};
module.exports = TaskHandler;
