const logger = require('../util/log').getLogger('app');
const fs = require('fs');

let registerFile = function(router,parentRoot,file){
        logger.debug('loading %j  ...',file);
        let extIdx = file.lastIndexOf('.');
        let fileName = file.substr(0,extIdx);
        let mod = require(fileName);
        let path = fileName.split('/');
        path = path[path.length-1];
        let url = mod.url || parentRoot+path;
        logger.debug('mounting %j to %j',file,url);
        let handler = mod.fn;
        switch(mod.method){
            case 'get':
                router.get(url,handler);
                break;
            case 'post':
                router.post(url,handler);
                break;
            case 'get|post':
            case 'post|get':
                router.get(url,handler);
                router.post(url,handler);
                break;
            default:
                router.all(url,handler);
                break;
        }
};
let registerMappingDir = function(dir,parentRoot, router){
    let files = fs.readdirSync(dir,{withFileTypes:true});
    files.map(function(file){
        if(file.isDirectory()){
            registerMappingDir(dir+'/'+file.name,parentRoot+file.name+'/', router);
        }else{
            if(file.name ==='index.js'){
                return;
            }
            registerFile(router,parentRoot,dir+'/'+file.name);
        }
    })
}
let registerMapping = function(router){
    // load all the handlers
    // register each handler to router
    console.log(`readdir ${__dirname} ...`);
    registerMappingDir(__dirname,'/',router);
};
module.exports = registerMapping;