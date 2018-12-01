/**
 * controller to generate qrcode
 */
const qr = require('qr-image');
let qrcode = async(ctx,next) =>{
    //gen,erate qr code here
    let code = qr.image('http://172.17.1.138:8000/qr?q=1234342x', { type: 'png' });
    ctx.set('Content-type', 'image/png');  //sent qr image to client side
    ctx.body = code;    
};
module.exports = {
    "method": "get",
    "fn": qrcode
}