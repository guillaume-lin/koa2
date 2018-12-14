/**
 *  任务信息
 * 
 *  {
 *       "taskId": 1,
 *       "desc": "【任务描述】每日完成3次登录. taskGoal [taskType,param] , 指定任务类型及目标。任务有顺序，每次只有一个当前任务，完成了当前任务才能开启后续任务",
 *       "goalSort": 1,
 *       "goal": 3,
 *       "resetDaily":true,
 *      "award":[1001,2,1200,100]
 *  },
 * 
 * 
 * 
 * 
 */
const logger = require('../util/log').getLogger('app');
const ConstType = require('../util/constType');
let TaskInfoImpl = function(app){
    this.app = app;
    this.taskList = [];
    this.data = {};
}
let pro = TaskInfoImpl.prototype;
pro.name = function(){
    return "taskInfo";
}
/**
 * load the config, and install it app
 */
pro.load = function(){
    let file = this.app.baseDir + '/dbJson/taskInfo.json';
    logger.debug('load dbJsonImpl %j ...',file);
    let json = require(file);
    this.taskList = json;
    for(let t in json){
        if(!json.hasOwnProperty(t)){
            continue;
        }
        this.data[json[t].taskId] = json[t];
    }
};
/**
 * 获取任务列表
 */
pro.getTaskList = function(){
    return this.taskList;
};
// 任务goalSort对应事件表
const goalEvent = {
    '1':ConstType.TASK_EVENT.LOGIN,
    '2':ConstType.TASK_EVENT.SHARE,
    '3':ConstType.TASK_EVENT.COMPLETE_PERSON_INFO,
    '4':ConstType.TASK_EVENT.ACQUIRE_POINTS,
    '5':ConstType.TASK_EVENT.READ,
    '6':ConstType.TASK_EVENT.EXCHANGE
}
/**
 * 获取任务目标对应的事件
 */
pro.getTaskGoalEvent = function(taskId){
    let taskInfo = this.data[taskId];
    if(!taskInfo){
        return null;
    };
    let event = goalEvent[taskInfo.goalSort];
    if(!event){
        return null;
    }
    return event;
};
/**
 * 获取任务目标
 */
pro.getTaskGoal = function(taskId){
    let taskInfo = this.data[taskId];
    if(!taskInfo){
        return null;
    };
    return taskInfo.goal;
};
pro.getTaskInfo = function(taskId){
    return this.data[taskId];
};
/**
 * 获取任务奖励
 */
pro.getTaskAwards = function(taskId){
    let ti = this.data[taskId];
    if(!ti){
        return null;
    }
    let award = ti.award;
    let items = [];
    for(let i=0; i<award.length; i+=2){
        items.push({
            itemId: award[i]+"",
            amount: award[i+1],
        })
    }
    return items;
};
module.exports = TaskInfoImpl;