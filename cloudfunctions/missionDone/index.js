
// 云函数入口文件
const cloud = require('wx-server-sdk')
//需求完成，给志愿者加积分，待评价
cloud.init()
const DB = cloud.database()
const _ = DB.command
const UserCollection = DB.collection('users')
const MissionPassCollection = DB.collection('missionPass')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //残疾人将改单状态改成完成状态
  await MissionPassCollection.doc(event._id).update({
    data:{
      done:true
    },
    success:function(res){
    }
  })
  //添加积分和完成的订单数
  await UserCollection.where({
    _openid:event.t_openid
  }).update({
    data:{
      integral:_.inc(event.integral),
      completeOrder:_inc(1)
    }
  })
  return {
      errcode:0,
      errMsg:'OK'
  }
}