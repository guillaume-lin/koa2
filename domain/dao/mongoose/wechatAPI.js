const mongoose = require('mongoose');

let ApiTokenSchema = new mongoose.Schema({
    appId:{type:String},
    access_token: {type:String}
});
ApiTokenSchema.statics.getToken = async function(appId){
    let doc =  await this.findOne({appId:appId});
    if(!doc){
        return null;
    } 
    return doc.access_token;
};
ApiTokenSchema.statics.setToken = async function(appId,token){
    let ret = await this.updateOne({appId:appId},{$setOnInsert:{appId:appId,access_token:token}},{upsert:true});
    return ret;
};
let model = mongoose.model('ApiToken',ApiTokenSchema);
module.exports = model;