/**
 * define all the business service here
 */
const fs = require('fs');

let loadServices = async function(app){
    // require 每个服务, 调用其start方法, afterStart方法
    // mount every service under app['service'];
    app['service'] = [];
    let files = fs.readdirSync(app.baseDir+'/service').filter(f => f !=='index.js');
    
    files.map(function(file){
        let Service = require(app.baseDir + '/service/' + file);
        let svc = new Service(app);
        svc.start();
        app[svc.name()] = svc;
        app['service'].push(svc);
    });
    app['service'].map(function(svc){
        if(typeof(svc.afterStart) === 'function'){
            svc.afterStart();
        }
    });
}
module.exports = {
    load: loadServices,
}