// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const DB = cloud.database()
const _ = DB.command
const MissionCollection = DB.collection('mission')

// 云函数入口函数
exports.main = async (event, context) => {
  var result=null
  await MissionCollection.where(
    {
        check: false //通过管理员的审核
    }
    ).get().then(function (res) {
      if(res.data.length!=0){
        result = res.data
      }else{
        result = "没有待审核的任务单!"
      }
    })
    return result
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}