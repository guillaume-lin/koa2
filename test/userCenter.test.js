const TaskManager = require('../domain/userCenter/userCenter');
const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe("#test userCenter", () => {
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
    let openId = "ab12";
    it ("#createUser", async () => {
        let ret = await app.userCenter.createUser(openId,"haha",1);
        assert.equal(ret.openId,openId);
    });
    
    it ("#rewardUserPoints", async () => {
        let ret = await app.userCenter.rewardUserPoints(openId,300);
        assert.equal(ret.code,0);
    });
    it ("#queryUserInfo", async () => {
        let ret = await app.userCenter.queryUserInfo(openId);
        console.log(ret);
        assert.equal(ret.openId,openId);
    });
});