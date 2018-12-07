// add cdkey
db = db.getSiblingDb('usercenter');
for(let i=111; i<121; i++){
    db.getCollection('cdkeys').insert({cdkey:''+i,expireTime:Number.MAX_SAFE_INTEGER,scanTime:0,openId:'',isUsed:0});
}

// exchangeShopItem
for(let i=0; i<12; i++){
    db.getCollection('exchangeitems').insert({itemId:''+(9000+i),name:"宝剑"+i,pic:'http://www.baidu.com/?q='+i,pointsNeed:i+1,stockQuantity:100,stockTotal:100,isOnSale:1});
}