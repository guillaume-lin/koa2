/**
 * 管理用户的任务
 * 
 * 监听app.eventBus上面的事件，来判断事件是否完成
 * 
 * 任务结构:
 *   taskId: 2,
 *   desc: "任务描述",
 *   goalSort: 目标类别，见下面
 *   goal:  任务目标，数量
 *   resetDaily: false,  是否每日复位
 *   award:[]  任务完成后的奖励
 * 任务状态:
 *   openId: {type:String}, // 任务执行者
 *   taskId: {type:Number}, // 当前任务id
 *   progress: {type:Number}, // 任务进度,已完成数量
 *   status: {type:Number, default: 0},  // 
 * 
 * goalSort 分类:
 * 1: 登录        goal:[3] progress:[3]  3次         对应事件: login
 * 2：分享        taskGoal:[3] progress:[3]  3次     对应事件: share
 * 3：填写个人信息 progress:                          对应事件: personInfoComplete
 * 4：达到指定积分                                    对应事件: acquirePoints
 * 5：阅读公众号文章                                  对应事件: read
 * 
 */
const logger = require('../../util/log').getLogger('app');
const ConstType = require('../../util/constType');
const daoTask = require('../dao/mongoose/task');
const daoUserItem = require('../dao/mongoose/userItem');
const schedule = require('node-schedule');

const TASK_COMPLETE = -2;
const TASK_CLOSED =  -1;

class TaskManager {
    constructor(app){
        this.app = app;
        this.registerEventHandler();
        this.scheduleTaskReset();
    };
    /**
     * 每天午夜复位需要复位的任务
     */
    scheduleTaskReset(){
        let self = this;
        schedule.scheduleJob('0 0 0 * * *', function(){  // 午夜时分执行
            logger.debug("schedule job");
            self.resetDailyTask();
        }); 
    }
    registerEventHandler(){
        let app = this.app;
        let self = this;
        
        for(let evt in ConstType.TASK_EVENT){
            if(!ConstType.TASK_EVENT.hasOwnProperty(evt)){
                continue;
            }
            let event = ConstType.TASK_EVENT[evt];
            logger.debug("register event: %j",event);
            app.eventBus.on(event,function(openId){
                logger.debug('user %j event %j fired',openId,event);
                self.processEvent(openId,event);
            })
        };
        app.eventBus.on("createUser",function(openId){
            logger.info("on create user %j",openId);
            // 创建用户时，分配第一个任务给用户
            self.assignCurrentTask(openId,1);
        });
    };
    /**
     * 处理任务事件
     * 根据事件找到对应的goalSort, 根据goalSort更新当前任务
     * @param {*} openId 
     * @param {*} event 
     */
    async processEvent(openId,event){
        let taskInfo = await daoTask.queryTask(openId);  // 当前任务信息
        let ti = this.app.dbJson.taskInfo.getTaskInfo(taskInfo.taskId);
        let taskEvent = this.app.dbJson.taskInfo.getTaskGoalEvent(taskInfo.taskId);
        if(taskEvent === event){ // 事件对应当前任务
            logger.info("complete task %j with event %j",taskInfo,event);
            return await this.completeCurrentTask(openId,taskInfo.taskId,ti.goal);
        }
    }
    /**
     * 分配当前任务
     * @param {*} openId 
     * @param {*} taskId 
     */
    async assignCurrentTask(openId,taskId){
        let taskInfo = this.app.dbJson.taskInfo.getTaskInfo(taskId);
        let ret = await daoTask.assignTask(openId,taskId,taskInfo.resetDaily);
        if(ret && ret.nModified === 1){
            return {
                code: ConstType.OK,
            }
        }else{
            return {code:ConstType.FAILED};
        }
    };

    /**
     * 完成一次任务
     * @param {*} taskId
     */
    async completeCurrentTask(openId,taskId,goal){
        let ret = await daoTask.completeTaskPiece(openId,taskId);
        if(ret && ret.nModified===1){
            let ret2 = await daoTask.tryCompleteFullTask(openId,taskId,goal);
            return ret2;
        }
        
    };

    /**
     * 刷新每日任务,只刷新未达目标的
     * @param {} taskId 
     */
    async resetDailyTask(){
        let ret = await daoTask.resetAllTask();
        logger.debug("resetDailyTask: %j",ret);
    };

    //====================================== public api follow ========================
    /**
     * 返回用户的任务列表，包括已完成的和未完成的
     */
    async queryTaskList(openId){
        let taskList = this.app.dbJson.taskInfo.getTaskList();
        let currentTask = await daoTask.queryTask(openId);
        let ret;
        if(currentTask && currentTask.openId === openId){
            ret =  {code: ConstType.OK,taskList:taskList,currentTask:currentTask};
        }else{
            logger.error("queryTaskList failed. %j",currentTask);
            ret = {code:ConstType.FAILED};
        }
        logger.debug("queryTaskList: %j",ret);
        return ret;
    };

    /**
     * 查询当前任务的详细信息
     * @param {*} openId 
     * @param {*} taskId 
     */
    async queryCurrentTaskInfo(openId){
        let currentTask = await daoTask.queryTask(openId);
        if(currentTask && currentTask.openId === openId){
            return {code: ConstType.OK, taskInfo:currentTask};
        }else{
            return {code: ConstType.FAILED};
        }
        
    };
    /**
     * 领取任务奖励,
     * 判断任务是否处于可领取奖励状态
     * 领完之后，任务关闭，开启下一个任务
     * @param {*} openId 
     * @param {*} taskId 
     */
    async rewardCurrentTask(openId,taskId){
        let currentTask = await daoTask.queryTask(openId);
        if(!currentTask || currentTask.taskId !== taskId){
            return {code:ConstType.FAILED};
        }
        
        if(currentTask.progress !== TASK_COMPLETE){
            return {code:ConstType.FAILED};
        }
        
        let items = this.app.dbJson.taskInfo.getTaskAwards(taskId);
        if(!items){
            return {code:ConstType.FAILED};
        }
        // 可领取奖励
        try{
            let ret = await daoTask.closeTask(openId,taskId);
            if(ret && ret.nModified === 1){
                // 发放奖励
                ret = await daoUserItem.awardItems(openId,items);
                if(!ret || ret.length !== items.length){
                   return {code: ConstType.FAILED};
                }
                // 设置下一个任务
                ret = await this.assignCurrentTask(openId,taskId+1);
                logger.debug("go to next task. %j",ret);
                return ret;
            }
        }catch(error){
            logger.error("%j reward task %j error: %j",openId, taskId,error.stack);
        }   
        return {code:ConstType.FAILED};   
    }
};

module.exports = TaskManager;
