// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV,
  // throwOnNotFound: false  //以下设置将 doc.get 的行为改为：如果获取不到记录，不抛出异常，而是返回空。
})

const DB = cloud.database()
const _ = DB.command
const UserCollection = DB.collection('users')

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  
  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息

  let usertype = ""
  const wxContext = cloud.getWXContext()
  await UserCollection.where({
      _openid: wxContext.OPENID
    }).get().then(function(res){
      if(res.data.length!=0){
        usertype = res.data[0].usertype
      }
      else{
        usertype=0
      }
    })
    
  //   return result
  return {
    // event,
    openid: wxContext.OPENID,
    usertype:usertype
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
    // env: wxContext.ENV,
  }
}

