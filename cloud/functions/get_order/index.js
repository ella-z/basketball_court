// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let data = event 
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command 
  const template = [{
    courtTime: "08:00-10:00",
    status: true,
    courtNumberList:[]
  },{
    courtTime: "10:00-12:00",
    status: true,
    courtNumberList:[]
  },{
    courtTime: "12:30-14:30",
    status: true,
    courtNumberList:[]
  },{
    courtTime: "14:30-16:30",
    status: true,
    courtNumberList:[]
  },{
    courtTime: "16:30-18:30",
    status: true,
    courtNumberList:[]
  },{
    courtTime: "18:30-20:30",
    status: true,
    courtNumberList:[]
  },{
    courtTime: "20:30-22:30",
    status: true,
    courtNumberList:[]
  }]

  if (data.type == 'courtDetail') {
    let list = await db.collection('order').where({
      type: _.in(['halfCourt','allCourt']),
      date: data.date
    }).get()
    let playResult = JSON.parse(JSON.stringify(template));
    for(var i=0; i<list.data.length; i++) {
       if(list.data[i].courtTime == "08:00-10:00") {
          playResult[0].courtNumberList.push(...list.data[i].courtNumber);
       }
       if(list.data[i].courtTime == "10:00-12:00") {
        playResult[1].courtNumberList.push(...list.data[i].courtNumber);
       }
       if(list.data[i].courtTime == "12:30-14:30") {
        playResult[2].courtNumberList.push(...list.data[i].courtNumber);
       }
       if(list.data[i].courtTime == "14:30-16:30") {
        playResult[3].courtNumberList.push(...list.data[i].courtNumber);
       }
       if(list.data[i].courtTime == "16:30-18:30") {
        playResult[4].courtNumberList.push(...list.data[i].courtNumber);
       }
       if(list.data[i].courtTime == "18:30-20:30") {
        playResult[5].courtNumberList.push(...list.data[i].courtNumber);
       }
       if(list.data[i].courtTime == "20:30-22:30") {
        playResult[6].courtNumberList.push(...list.data[i].courtNumber);
       }
    }
    for(var i=0; i<playResult.length; i++) {
      if(playResult[i].courtNumberList.length == 4) {
        playResult[i].status = false;
      }
    }
  
    let courtInfoList = await db.collection('court').get()
  
    let result = {
      reservationInfo: playResult,
      courtInfo: courtInfoList.data
    }
    return result;
  } else if (data.type == 'wildOrder'){
    let list = await db.collection('order').where({
      openid: wxContext.OPENID,
      type: 'wildBall',
      orderStatus: data.orderStatus
    }).get()
    let result = {
      status: 'success',
      orderList: list.data
    }
    return result;
  } else if (data.type == 'courtOrder') {
    let list = {}
    if (data.orderStatus == 2) {
      list = await db.collection('order').where({
        type: _.in(['halfCourt','allCourt']),
        openid: wxContext.OPENID,
        orderStatus: 0,
        overTime: _.lt(new Date().getTime())
      }).orderBy('overTime', 'asc').get()
    } else {
      list = await db.collection('order').where({
        type: _.in(['halfCourt','allCourt']),
        openid: wxContext.OPENID,
        orderStatus: data.orderStatus
      }).orderBy('overTime', 'asc').get()
    }
    let result = {
      status: 'success',
      orderList: list.data
    }
    return result;
  }

  
}