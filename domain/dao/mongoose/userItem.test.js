/**
 * test dao  userItem.js
 */
const assert = require('assert');
const daoUserItem = require('./userItem');
const mongoose = require('./');
describe('userItem',function(){
    // setup mongodb connection first
    describe('#createItem',function(){
        before (function(){
            mongoose.dbInit(require('../../../config/mongodb.json'));
            console.log('test before');
        });
        after (function(){
            console.log('test after');
        });

        it ('create a point item',async function(){
            let openId = 'abcde';
            let itemId = '1001';
            let amount = 10;
            let acquireTime = Date.now();
            let expireTime = acquireTime + 7*24*3600*1000;
            let ret = await daoUserItem.createItem(openId,itemId,amount,acquireTime,expireTime);
            console.log(`result: ${ret}`);
        });
        it ('remove point item', async function(){
            let openId = 'abcde';
            let itemId = '1001';
            let amount = 60;
            let ret = await daoUserItem.removeItem(openId,itemId,amount);
            console.log(`remove item result: ${ret}`);
        })
    });
})