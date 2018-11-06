/**
 * utility function
 */
const uuidv4 = require('uuid/v4');
let util = {
    placeHolder: function(){
        console.log('I am a placeholder.');
    },
    // return a 32 uuid
    uuidgen: function(){
        let id = uuidv4().replace(/-/g,''); // trim the intermediate slash
        return id;
    }
}
module.exports = util;