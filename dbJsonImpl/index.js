/**
 * inject all dbJsonImpl here
 */
const fs = require('fs');

let loadImpl = function(router,file){
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
            router.all(mod.url,mod.fn);
            break;
    }
};
let registerImpl = function(app){
    console.log(`readdir ${__dirname} ...`);
    fs.readdir(__dirname,function(err,files){
        if(!err){
            for(let i=0,len=files.length; i<len; i++){
                if(files[i] !== 'index.js'){
                    loadImpl(router,files[i]);
                }
            }
        }else{
            throw err;
        }  
    });
};

module.exports = registerImpl;