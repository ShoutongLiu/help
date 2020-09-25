// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

const DB = cloud.database()
const _ = DB.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await DB.collection('userInfo').where({_openid: wxContext.OPENID}).get().then(res=>{
    console.log(res.data)
  })
  await DB.collection('userInfo').add({
    data:{
      _openid: wxContext.OPENID,
      realnameInfo:event.realnameInfo,
      phone:event.phone
    }
  }).then(res=>{})
  return "提交成功"

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}