let util = require('./util');
let assert = require('assert');

describe("微信工具函数",function(){
    it ('checkWxSignature',function(){
        //     signature=c75c9469ab15686a2ae12683c84209ee5f3e7980& timestamp=1541731011&nonce=361218582
        assert.ok(util.checkWxSignature('wx','1541731011','361218582','c75c9469ab15686a2ae12683c84209ee5f3e7980'));
    })
})