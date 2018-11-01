// init db schema
var db = db.getSiblingDB('usercenter');
db.user.createIndex({"userId":"hashed"}); // the unique id of a user
// insert a test record
db.user.insert({
    "userId":"xxxxxxxxxxxxxxxxxx",
    "openId":'x',
    "score":0,
    "level":1,
    "nickName":"nick",
    "sex":'male',
    "phoneNumber":'13799781234',
    "phoneModel":"huawei"
});
