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

  let usertype = ""//用户类型
  let phone = ''//电话号码
  let realname = ''//真实姓名
  let order =''  //订单数
  let integral = '' //总积分
  let assess = ''
  let waitCheck = []   //待审核
  let waitAccept = []  //待接受
  let waitDone = []    //待完成
  let waitComment = [] //待评价
  let Cancelled = []   //已经取消
  const wxContext = cloud.getWXContext()
  await UserCollection.where({
    _openid: wxContext.OPENID
  }).get().then(function(res){
      if(res.data.length!=0){
        usertype = res.data[0].usertype
        phone = res.data[0].phone
        realname = res.data[0].realname
        order = res.data[0].completeOrder!=undefined?res.data[0].completeOrder:res.data[0].sendOrder
        integral = res.data[0].integral
        assess = res.data[0].assess
      }
      else{
        usertype=0
        phone = ''
        realname = ''
        order = 0
        integral = 0
        assess = 0
      }
    })
    //通过审核的残疾人，查询他发布的需求的记录
    if(usertype==1){ 
      //查询待审核的记录
      await MissionCollection.where({
        f_openid:wxContext.OPENID,
        check:0,
        cancel:false
      }).get().then(function(res){
        waitCheck=res.data
      })
      //查询待接受的记录
      await DB.collection('missionPass').where({
        f_openid:wxContext.OPENID,
        check:1,
        accept:false,
        cancel:false
      }).get().then(function(res){
        waitAccept =res.data
      })
      //残疾人的需求被志愿者接受，等待志愿者完成
      await DB.collection('missionPass').where({
        f_openid:wxContext.OPENID,
        check:1,
        accept:true,
        cancel:false,
        done:false,
      }).get().then(function(res){
        waitDone=res.data
      })
      //残疾人待评价的需求
      await DB.collection('missionPass').where({
        f_openid:wxContext.OPENID,
        check:1,
        accept:true,
        done:true,
        iscomment1:false
      }).get().then(function(res){
        waitComment=res.data
      })
      //残疾人已经取消的需求
      await MissionCollection.where({
        f_openid:wxContext.OPENID,
        cancel:true
      }).get().then(function(res){ 
        Cancelled=res.data
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
      await DB.collection('missionPass').where({
        t_openid:wxContext.OPENID,
        done:true,
        iscomment2:false
      }).get().then(function(res){
        waitComment =res.data
      })
      //志愿者已经取消的
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
    },{
      type:'waitComment',
      data:waitComment
    },{
      type:'Cancelled',
      data:Cancelled
    }
  ]
  
  return {
    // event,
    openid: wxContext.OPENID,
    usertype:usertype,
    phone:phone,
    realname:realname,
    order:order,
    integral:integral,
    assess:assess,
    userMissionInfo:userMissionInfo
     
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
    // env: wxContext.ENV,
  }
}

