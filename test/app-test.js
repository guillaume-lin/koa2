const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe("#test suite", () => {
    before(function () {
        console.log('before:');
    });

    after(function () {
        console.log('after.');
    });

    beforeEach(function () {
        console.log('  beforeEach:');
    });

    afterEach(function () {
        console.log('  afterEach.');
    });

    let server = app.listen(9900);
    
    it ('#test case',()=>{
        assert.equal(0,0);
    });
    it('#test GET /', async () => {
        let res = await request(server)
            .get('/')
            .expect('Content-Type', /text\/html/)
            .expect(200, '<h1>Hello, world!</h1>');
    });
})