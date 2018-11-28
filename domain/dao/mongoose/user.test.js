const assert = require('assert');
const daoUser = require('./user');
const mongoose = require('./');

describe('user',function(){
    // setup mongodb connection first
    describe('#createUser',function(){
        before (function(){
            mongoose.dbInit(require('../../../config/mongodb.json'));
            console.log('test user before');
        });
        after (function(){
            console.log('test user after');
        });
        it ('#createUser', async function(){
            let openId = 'abcdefg';
            let nickName = '我的昵称';
            let sex = 1; // 男性
            let ret = await daoUser.createUser(openId,nickName,sex);
            console.log(`createUser ret: ${ret}`);
        });
        it ('#findUser', async function(){
            let ret = await daoUser.findUser('abcde');
            console.log(`find user abcde. ret: ${ret}`);
        });
        it ('#findUser', async function(){
            let ret = await daoUser.findUser('abcdefg');
            console.log(`find user abcde. ret: ${ret}`);
        })
    });
});
