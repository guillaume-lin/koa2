/**
 * 处理来自微信的请求
 */
const logger = require('../../util/log').getLogger('app');

let MessageDispatcher = function(app){
    this.app = app;
}
let pro = MessageDispatcher.prototype;
const msgTpl = "<xml>"+
            "<ToUserName>  <![CDATA[{{ toUserName }}]]></ToUserName>" + 
            "<FromUserName><![CDATA[{{ fromUserName }}]]></FromUserName>"+
            "<CreateTime>{{ createTime }}</CreateTime> " + 
            "<MsgType> <![CDATA[text]]></MsgType> " +
            "<Content> <![CDATA[{{ content }}]]></Content>" +
            "</xml>";
const newsTpl = "<xml>" +
            "<ToUserName>< ![CDATA[toUser] ]></ToUserName>"+
            "<FromUserName>< ![CDATA[fromUser] ]></FromUserName>"+
            "<CreateTime>12345678</CreateTime>"+
            "<MsgType>< ![CDATA[news] ]></MsgType>"+
            "<ArticleCount>1</ArticleCount>"+
            "<Articles>"+
            "<item><Title>< ![CDATA[title1] ]></Title> <Description>< ![CDATA[description1] ]></Description><PicUrl>< ![CDATA[picurl] ]></PicUrl><Url>< ![CDATA[url] ]></Url></item></Articles></xml>";

pro.processTextMessage = function(ctx){
    let ct = Math.ceil(Date.now()/1000);
    let xml = ctx.request.body.xml;
    let fromUserName = xml.FromUserName[0];
    let toUserName = xml.ToUserName[0];

    let content = xml.Content[0];
    let msgId = xml.MsgId[0];

    ctx.type = 'application/xml';

    if(content==='test'){
        ctx.body = "<xml><ToUserName><![CDATA["+ fromUserName +"]]></ToUserName><FromUserName><![CDATA["+toUserName+"]]> </FromUserName><CreateTime>"+ct+"</CreateTime> <MsgType><![CDATA[text]]></MsgType> <Content><![CDATA[你好]]></Content></xml>";
    }else{
        ctx.body = ctx.renderString(msgTpl,{toUserName: fromUserName, fromUserName:toUserName,createTime:ct,content:content});
    }
    
    
}

/**
 * 处理关注和取关操作
 */
pro.processEventMessage = function(ctx){
    let ct = Math.ceil(Date.now()/1000);
    let xml = ctx.request.body.xml;
    let fromUserName = xml.FromUserName[0];
    let toUserName = xml.ToUserName[0];

    let eventType = xml.Event[0];
    ctx.type = 'application/xml';
    let content = '';
    switch(eventType){
        case 'subscribe':
            content = "欢迎关注, http://www.baidu.com/";
            ctx.body = ctx.renderString(msgTpl,{toUserName: fromUserName, fromUserName:toUserName,createTime:ct,content:content});
            break;
        case 'unsubscribe':
            content = "下次再来";
            ctx.body = ctx.renderString(msgTpl,{toUserName: fromUserName, fromUserName:toUserName,createTime:ct,content:content});
            break;

    }
}
/**
 * 处理微信消息
 */
pro.processMessage = function(ctx){
    let ct = Math.ceil(Date.now()/1000);
    let xml = ctx.request.body.xml;
    if(!xml){
        ctx.body = "no xml";
        return;
    }
    let fromUserName = xml.FromUserName[0];
    let toUserName = xml.ToUserName[0];


    let msgType = xml.MsgType[0];

    switch(msgType){
        case 'text':
            this.processTextMessage(ctx);
            break;
        case 'event':
            this.processEventMessage(ctx);
            break;
        case 'image':
            break;
        case 'voice':
            break;
        case 'video':
            break;
        case 'shortvideo':
            break;
        case 'location':
            break;
        case 'link':
            break;
        default:
            ctx.type = 'application/xml';
            ctx.body = "<xml><ToUserName><![CDATA["+ toUserName +"]]></ToUserName><FromUserName><![CDATA["+fromUserName+"]]> </FromUserName><CreateTime>"+ct+"</CreateTime> <MsgType><![CDATA[text]]></MsgType> <Content><![CDATA[你好]]></Content></xml>";
            //ctx.body = "success";    
            break;
    }
    logger.debug("reply to user: %j",ctx.body);
}

module.exports = MessageDispatcher;