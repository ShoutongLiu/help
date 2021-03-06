// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const DB = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  context.code=0
  context.errMsg = 'OK'
  const wxContext = cloud.getWXContext()
  await DB.collection('userInfo').where({_openid:wxContext.OPENID}).get().then(res=>{
    context.result = res.data.length?true:false
  })
  
  if(context.result){
    //注册志愿者
    if(event.usertype==2){
      await DB.collection('users').where({
        _openid:wxContext.OPENID
      }).update({
        data:{
          certificationTime:Date.now(),//认证时间
          usertype:2,
          assess:0 ,//评价总得分
          completeOrder:0//完成的总共订单数
        }
      })
    }
    //注册残疾人
    else{
      await DB.collection('users').where({
        _openid:wxContext.OPENID
      }).update({
        data:{
          certificationTime:Date.now(),//认证时间
          usertype:10,  //10 代表申请残疾人，等待审核
          Disability_Photo_ID:event.Disability_Photo_ID, //残疾照片ID
          assess:0,//评价得分
          sendOrder:0 ,//发出的订单数
          DisabilityLevel:0, //伤残等级
          DisabilityType:0  //伤残类别
        }
      })
    }
    
  }else{
    //用户未实名
    context.code=-1002
    context.errMsg = '注册失败，用户未实名'
  }

  return {
    code:context.code,
    errMsg:context.errMsg,
  }
}