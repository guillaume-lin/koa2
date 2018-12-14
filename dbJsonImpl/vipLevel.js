const logger = require('../util/log').getLogger('app');
const ConstType = require('../util/constType');
let VipLevelImpl = function(app){
    this.app = app;
    this.levelList = [];
    this.maxLevel = 1;
    this.data = {};
}
let pro = VipLevelImpl.prototype;
module.exports = VipLevelImpl;

pro.name = function(){
    return "vipLevel";
}
/**
 * load the config, and install it app
 */
pro.load = function(){
    let file = this.app.baseDir + '/dbJson/vipLevel.json';
    logger.debug('load dbJsonImpl %j ...',file);
    let json = require(file);
    this.levelList = json;
    for(let t in json){
        if(!json.hasOwnProperty(t)){
            continue;
        }
        if(json[t].level > this.maxLevel){
            this.maxLevel = json[t].level;
        };
        this.data[json[t].level] = json[t];
    }
};
/**
 * 获取指定分数所处的等级
 */
pro.getLevel = function(points){
    if(points <= this.data['1'].points){
        return 1;
    }
    if(points > this.data[this.maxLevel].points){
        return this.maxLevel;
    }
    for(let level=1; level<this.maxLevel; level++){
        if(points > this.data[level].points && points <= this.data[level+1].points){
            return level+1;
        }
    }
    return 1;
}