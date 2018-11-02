// init db schema
var db = db.getSiblingDB('usercenter');
db.user.createIndex({"openId":"hashed"}); // the unique id of a user
// insert a test record
db.user.insert({
    "openId":'xxxxxxxxxxxxxxx',
    "score":0,
    "level":1,
    "nickName":"nick",
    "sex":'male',
    "phoneNumber":'13799781234',
    "phoneModel":"huawei"
});
