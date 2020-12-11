//提交评价接口
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const DB = cloud.database()
const _ = DB.command
const UserCollection = DB.collection('users')
const MissionPassCollection = DB.collection('missionPass') //通过的需求

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //残疾人提交评价
  if(event.usertype==1){
    await MissionPassCollection.doc(event._id).update({
      data:{
        iscomment1:true,
        comment1:event.comment,
      }
    })
  }else{
    //志愿者提交评价
    await MissionPassCollection.doc(event._id).update({
      data:{
        iscomment2:true,
        comment2:event.comment,
      }
    })
  }
  await UserCollection.where({_openid:event.openid}).update({
    data:{
      assess:_.inc(event.assess)
    }
  })
  return {
    errCode:0,
    errMsg:'OK'
  }
}