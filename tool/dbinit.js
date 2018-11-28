// init db schema
var db = db.getSiblingDB('usercenter');
db.users.createIndex({"userId":1},{unique:true}); // the unique id of a user, uuid
db.cdkeys.createIndex({"cdkey":1},{unique:true}); // 