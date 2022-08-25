// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  let data = event 
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID
  data.openid = openid
  const db = cloud.database()
  const _ = db.command 

  const priceMap = {
    0: {
      wildBall: 20,
      halfCourt: 350,
      allCourt: 600,
    },
    1: {
      wildBall: 15,
      halfCourt: 300,
      allCourt: 500,
    },
    2: {
      wildBall: 15,
      halfCourt: 250,
      allCourt: 450,
    },
    3: {
      wildBall: 15,
      halfCourt: 220,
      allCourt: 400,
    }
  }
  
  try {
    const transaction = await db.startTransaction()

    //如果是订场订单，要先判断该场次是否已经被订了
    if(data.type == 'halfCourt' || data.type == 'allCourt') {
      let checkRes = await transaction.collection('order').where({
        'date': data.date,
        'courtTime': data.courtTime,
        'courtNumber': _.in(data.courtNumber)
      }).get()
      if (checkRes.data.length > 0) {
        await transaction.rollback()
        return {
          success: false,
          message: "该场已被预定"
        }
      }
    }

    let orderRes = await transaction.collection('order').add({
      data: data
    })

    let userRes = await transaction.collection('user').where({
      'openid':openid
    }).limit(1).get()

    let param = userRes.data[0];

    //type='pay'代表当前创建的是充值订单
    if (data.type == 'pay') {
      param.balance += data.price;
      param.amount += data.price;
      if (param.amount >= 600 && param.amount < 2000) {
        param.vipLevel = 1;
      } else if (param.amount >= 2000 && param.amount < 5000) {
        param.vipLevel = 2;
      } else if (amount >= 5000) {
        param.vipLevel = 3;
      }
      //更新用户余额
      var docId = param["_id"];
      delete param["_id"];
      let payRes = await transaction.collection('user').doc(docId).update({
        data: param
      })
      if (orderRes && userRes && payRes) {
        await transaction.commit()
        return {
          success: true,
          message: "pay success"
        }
      }
    }

    //type='wildBall'代表当前创建的是野球订单，type='halfCourt'&&type='allCourt'代表当前创建的是半场和全场订单
    if(data.type == 'wildBall' || data.type == 'halfCourt' || data.type == 'allCourt') {
      let payRes = false;
      if(data.payType == 'online') {
         payRes = true;
      } else if (data.payType == 'offline') {
         let price = priceMap[param.vipLevel][data.type];
         param.balance -= price;
         //判断确保当前用户的余额是足够的
         if (param.balance < 0) {
          await transaction.rollback()
          return {
            success: false,
            message: "余额不足"
          }
        }
         //更新用户余额
         var docId = param["_id"];
         delete param["_id"];
         payRes = await transaction.collection('user').doc(docId).update({
         data: param
         })
      } 
      if (orderRes && userRes && payRes) {
        await transaction.commit()
        return {
          success: true,
          message: "pay success"
        }
      }
    }

    // let res0 = await transaction.collection('order').where({
    //   'date': '2022-08-03',
    //   'courtNumber': _.in([1, 2])
    // }).get()
    // let res0 = await transaction.collection('order').where({
    //   'orderTime': _.gte(new Date().getTime())
    // }).get()

  } catch (error) {
    return {
      success: false,
      error: error,
    }
  }
}