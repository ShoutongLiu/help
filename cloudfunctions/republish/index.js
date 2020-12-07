// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const DB = cloud.database()
const _ = DB.command
const UserCollection = DB.collection('users')
const MissionCollection = DB.collection('mission')

// 云函数入口函数    业务：残疾人重新发布需求

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  await MissionCollection.doc(event._id).update({
    data:{
      demType:event.demType,
      demContext:event.demContext,
      area:event.area,
      Address:event.Address,
      startTime:event.startTime,
      endTime:event.endTime,
      phone:event.phone,
      cancel:false //关闭取消状态
    },
    success:function(res){
    }
  })
  return {
    errCode:0,
    errMsg:'OK'
  }
}