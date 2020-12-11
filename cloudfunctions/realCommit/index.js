// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

const DB = cloud.database()
const _ = DB.command

// 云函数入口函数
exports.main = async (event, context) => {
  context.code = 0
  context.errMsg = 'OK'
  const wxContext = cloud.getWXContext()
  await DB.collection('userInfo').where({_openid: wxContext.OPENID}).get().then(res=>{
    context.isReal = res.data.length?true:false
  })
  // 用户未实名的话添加进数据库
  if(!context.isReal){
    await DB.collection('userInfo').add({
      data:{
        _openid: wxContext.OPENID,
        realnameInfo:event.realnameInfo,
        fileID:event.fileID     //居民身份证照片的云存储ID
      }
    }).then(res=>{})
    await DB.collection('users').add({
      data:{
        _openid:wxContext.OPENID,
        usertype:0,
        phone:event.phone,
        realname:event.realnameInfo.Name,
        integral:0,
      }
    })
  }else{
    context.code = -1001
    context.errMsg = '提交失败，该用户已经实名'
  }
  return {code:context.code,errMsg:context.errMsg}

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}