//删除需求
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB = cloud.database()
const _ = DB.command
const UserCollection = DB.collection('users')
const MissionCollection = DB.collection('mission')
const MissionPassCollection = DB.collection('missionPass')
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if(event.check==0){
    await MissionCollection.doc(event._id).remove({
      success:function(res){
      }
    })
  }else{
    await MissionPassCollection.doc(event._id).remove({
      success:function(res){
      }
    })
  }
  
  
  return {
    errCode:0,
    errMsg:'OK'
  }
}