// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB = cloud.database()
const _ = DB.command
const UserCollection = DB.collection('users')
const MissionCollection = DB.collection('mission')
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await MissionCollection.doc(event._id).remove({
    success:function(res){
      
    }
  })
  
  return {
    errCode:0,
    errMsg:'OK'
  }
}