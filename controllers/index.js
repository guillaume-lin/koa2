const fs = require('fs');

let registerFile = function(router,file){
        console.log(`loading ${file} ...`);
        let mod = require(__dirname + '/' + file);
        switch(mod.method){
            case 'get':
                router.get(mod.url,mod.fn);
                break;
            case 'post':
                router.post(mod.url,mod.fn);
                break;
            default:
                console.log(`unsupport method: ${mod.method}`);
                break;
        }
};
let registerMapping = function(router){
    // load all the handlers
    // register each handler to router
    console.log(`readdir ${__dirname} ...`);
    fs.readdir(__dirname,function(err,files){
        if(!err){
            for(let i=0,len=files.length; i<len; i++){
                if(files[i] !== 'index.js'){
                    registerFile(router,files[i]);
                }
                
            }
        }else{
            throw err;
        }
    });
};
module.exports = registerMapping;