//后台管理调用的云函数
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB = cloud.database()
const _ = DB.command
const UserCollection = DB.collection('users')
const MissionCollection = DB.collection('mission') //待审核的需求
const MissionPassCollection = DB.collection('missionPass') //通过的需求
const MissionReject = DB.collection('missionReject') //未通过的需求
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext() //"{"wxContext":{"APPID":"wxa3a65a7c6c164c52","ENV":"test-cloud-yv3p7","SOURCE":"wx_http"}}
  let checkData = event.checkData //审核请求的数据
  if(event.checkResult==1){
    await MissionCollection.doc(checkData._id).remove()//删除待审核的需求
    await MissionPassCollection.add({ //添加审核过的需求
        data: {
            orderNumber:checkData._id,
            f_openid: checkData.f_openid,
            t_openid:'',
            startTime: checkData.startTime,
            endTime:checkData.startTime,
            area: checkData.area,
            Address: checkData.Address,
            authorAvatarUrl: checkData.authorAvatarUrl,
            authorName: checkData.authorName,
            check: 1, //该需求通过了管理员审核
            demContext: checkData.demContext,
            demType: checkData.demType,
            location: checkData.location,
            phone: checkData.phone,
            cancel:false,//默认没有取消
            price:checkData.price, //管理员打的积分
            v_location:{},
            v_phone:'',
            accept:false,
            dis:0,
            done:false,
            doneName:'',
            checkDateTime:checkData.checkDateTime, //审核时间
            iscomment1:false,
            iscomment2:false,
        }
      }).then(res => {
          if (res.errMsg == 'collection.add:ok') {
          } else {
          }
        })
    await UserCollection.where({_openid:checkData.f_openid}).update({
      data:{
        sendOrder:_.inc(1)   //发出的需求的单数加1
      }
    })
  }else{
    await MissionCollection.doc(checkData._id).remove()//删除待审核的需求
    await MissionReject.add({ //添加审核未通过的需求
      data:{
          orderNumber:checkData._id,
          f_openid: checkData.f_openid,
          startTime: checkData.startTime,
          endTime:checkData.startTime,
          area: checkData.area,
          Address: checkData.Address,
          authorAvatarUrl: checkData.authorAvatarUrl,
          authorName: checkData.authorName,
          check: 2, //该需求未通过管理员审核
          demContext: checkData.demContext,
          demType: checkData.demType,
          location: checkData.location,
          phone: checkData.phone,
          refusal:checkData.refusal, //拒绝理由
          checkDateTime:checkData.checkDateTime, //审核时间
      }
    })
  }
  return {
    result:"审核完成"
    // wxContext
    // data:event.checkData
    // openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
  }
}