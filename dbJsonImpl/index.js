/**
 * inject all dbJsonImpl here
 */
const fs = require('fs');

let registerImpl = function(app){
    console.log(`readdir ${__dirname} ...`);
    let files = fs.readdirSync(__dirname).filter(f => f !== 'index.js');
    app.dbJson = {};
    files.map(function(f){
        // load each dbJsonImpl
        let Impl = require(app.baseDir + '/dbJsonImpl/'+f);
        let impl = new Impl(app);
        impl.load();
        app.dbJson[impl.name()] = impl;
    })
};

module.exports = {
    load: registerImpl
};