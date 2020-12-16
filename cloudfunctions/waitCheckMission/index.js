// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const DB = cloud.database()
const _ = DB.command
// const UserCollection = DB.collection('users')
const MissionCollection = DB.collection('mission') //待审核的需求
// const MissionPassCollection = DB.collection('missionPass') //通过的需求

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext() //"{"wxContext":{"APPID":"wxa3a65a7c6c164c52","ENV":"test-cloud-yv3p7","SOURCE":"wx_http"}}
  await MissionCollection.where({
        check: 0 //管理员还未审核
    }).orderBy('startTime', 'desc').get().then(function (res) {
      event.data =res.data
    })
  return {
    
    respData:event.data,
    // openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
  }
}