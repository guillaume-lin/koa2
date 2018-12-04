const logger = require('../util/log').getLogger('app');
const fs = require('fs');

let registerHandler = function(router,parentRoot,mod){
    // 注册处理器,所有方法都是post
    let handler = new mod();
    
    for(let f in handler){
        if(typeof(handler[f])==='function'){
            // wrap here
            let url = parentRoot + '/' +f;
            logger.debug('register handler method: %j on %j',f,url);
            router.post(router,url,handler[f]);
        }
    }
}
let registerFile = function(router,parentRoot,file){
        logger.debug('loading %j  ...',file);
        let extIdx = file.lastIndexOf('.');
        let fileName = file.substr(0,extIdx);
        let path = fileName.split('/');
        path = path[path.length-1];

        let mod = require(fileName);
        if(!mod.fn){
            registerHandler(router,parentRoot+path,mod);
            return;
        }
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