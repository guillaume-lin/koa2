const TaskManager = require('../domain/task/taskManager');
const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe("#test taskManager", () => {
    let server = app.listen(9900);
    before(function () {
        console.log('before:');
    });

    after(function () {
        console.log('after.');
        server.close();
    });

    beforeEach(function () {
        console.log('  beforeEach:');
    });

    afterEach(function () {
        console.log('  afterEach.');
    });

    
    
    it ('#assignCurrentTask',()=>{
        let ret = app.taskManager.assignCurrentTask("abcdef",1);
        console.log(ret);
        assert.equal(0,0);
    });
    it ('#queryTaskList', () =>{
        let ret = app.taskManager.queryTaskList("abcdef");
        console.log(ret);
        assert.equal(0,0);
    });
    it ('#queryCurrentTaskInfo',() => {
        let ret = app.taskManager.queryCurrentTaskInfo("abcdef");
        console.log(ret);
        assert.equal(0,0);
    });
    it ('#completeCurrentTask',() => {
        let ret = app.eventBus.emit('login',"abcdef");
        assert.equal(ret=== 0);
    });
    it ('#completeCurrentTask',() => {
        let ret = app.eventBus.emit('login',"abcdef");
        assert.equal(ret=== 0);
    });

    it ('#completeCurrentTask',() => {
        let ret = app.eventBus.emit('login',"abcdef");
        assert.equal(ret=== 0);
    });
    it ('#completeCurrentTask',() => {
        let ret = app.eventBus.emit('login',"abcdef");
        assert.equal(ret=== 0);
    });
    it ('#领取任务奖励',() => {
        let ret = app.taskManager.rewardCurrentTask("abcdef",1);
        console.log(ret);
        assert.equal(ret=== 0);
    });
})
