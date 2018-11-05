// init db schema
var db = db.getSiblingDB('usercenter');
db.user.createIndex({"userId":1},{unique:true}); // the unique id of a user, uuid
// insert a test record
db.user.insert({
    "userId":'xxxxxxxxx',
    "openId":'xxxxxxxxxxxxxxx',
    "score":0,
    "level":1,
    "nickName":"nick",
    "sex":'male',
    "phoneNumber":'13799781234',
    "phoneModel":"huawei"
});
