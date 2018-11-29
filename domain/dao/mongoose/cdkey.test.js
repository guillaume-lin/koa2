const assert = require('assert');
const log = require('../../../util/log');
const daoCdkey = require('./cdkey');
const mongoose = require('./');

describe('cdkey',function(){
    before (function(){
        log.configure(require('../../../config/log4js.json'));
        let logger = log.getLogger('app');
        logger.debug("test cdkey before");
        mongoose.dbInit(require('../../../config/mongodb.json'));
        console.log('test cdkey before');
    });
    after (function(){
        console.log('test cdkey after');
    });

    // setup mongodb connection first
    describe('#createCdkey',function(){
        it ('#createCdkey', async function(){
            let openId = 'abcdefg';
            let cdkey = '12345';
            let myCdkey = new daoCdkey({openId:openId,cdkey:cdkey});
            let ret = await myCdkey.save();
            console.log(`create cdkey ret: ${ret}`);
        });
    });

    describe('markCdkeyUsed',function(){
        it ('#markCdkeyUsed',async function(){
            let openId = 'abcdefg';
            let cdkey = '12345';
            let ret = await daoCdkey.markCdkeyUsed(openId,cdkey);
            log.getLogger('app').debug("markCdkeyUsed: %j",ret);
        })
    })
});