/**
 * 导入cdkey
 */
const fs = require('fs');
const ConstType = require('../../util/constType');
const logger = require('../../util/log').getLogger('app');
const daoCdkey = require('../../domain/dao/mongoose/cdkey');
const readline = require('readline');
const qr = require('qr-image');
const os = require('os');
let CdkeyHandler = function(){
};
let pro = CdkeyHandler.prototype;

/**
 * 用户上传cdkey文件，此处导入
 */
pro.importCdkey = async function(ctx,next){
    const file = ctx.request.files["cdkeyFile"];	// 获取上传文件
    logger.debug("cdkey file: %j,path:%j",file,file.path);
    let stream = fs.createReadStream(file.path);
    // 开始导入
    let prom = new Promise(function(resolve,reject){
        let count = 0;
        const rl = readline.createInterface({
            input:stream,
            output:null
        });
        rl.on('line', async (input) => {
            if(input.startsWith('****')){
                return;
            }
            if(input.startsWith('====')){
                return;
            }
            if(input ===''){
                return;
            }
            let cdkey = input;
            await daoCdkey.insertCdkey(cdkey);
            count++;
        });
        rl.on('close',() =>{
            logger.debug(`\n导入完毕,总共导入 ${count} 个cdkey`);
            resolve(count);
        });
    });
    let ret = await prom;
	return ctx.body = '导入成功'+ret;
};
pro.genQrCode = async function(ctx,next){

}
module.exports = CdkeyHandler;