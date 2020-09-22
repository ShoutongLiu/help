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
const MissionCollection = DB.collection('mission')
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
  let waitCheck = []  //待审核
  let waitAccept = []  //待接受
  let waitDone = []    //待完成
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
    //残疾人的话查询他发布的需求的记录
    if(usertype==1){ 
      //查询待审核的记录
      await MissionCollection.where({
        f_openid:wxContext.OPENID,
        check:0
      }).get().then(function(res){
        waitCheck=res.data
      })
      //查询待接受的记录
      await DB.collection('missionPass').where({
        f_openid:wxContext.OPENID,
        check:1,
        accept:false
      }).get().then(function(res){
        waitAccept =res.data
      })
      //残疾人的需求被志愿者接受，等待志愿者完成
      await DB.collection('missionPass').where({
        f_openid:wxContext.OPENID,
        check:1,
        accept:true,
        done:false
      }).get().then(function(res){
        waitDone=res.data
      })
    }
    //志愿者的话查询他接受的需求的记录
    else if(usertype==2){
      //需要志愿者主动去待完成的任务
      await DB.collection('missionPass').where({
        t_openid:wxContext.OPENID,
        accept:true,
        done:false,
      }).get().then(function(res){
        waitDone =res.data
      })
      //志愿者待评价
    }
  
  let userMissionInfo = [
    {
      type:'waitCheck',
      data:waitCheck
    },{
      type:'waitAccept',
      data:waitAccept
    },{
      type:'waitDone',
      data:waitDone
    }
  ]
  //   return result
  return {
    // event,
    openid: wxContext.OPENID,
    usertype:usertype,
    userMissionInfo:userMissionInfo
     
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
    // env: wxContext.ENV,
  }
}

