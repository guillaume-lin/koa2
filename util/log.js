const log4js = require('log4js');

let Log =  {
    configure: conf => {
        log4js.configure(conf);
    },
    getLogger: category => {
        return log4js.getLogger(category);
    }
}
module.exports = Log;