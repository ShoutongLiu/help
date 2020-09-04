// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router');
cloud.init()

const DB = cloud.database()
const _ = DB.command
const UserCollection = DB.collection('users')
const MissionCollection = DB.collection('mission')

//计算距离的函数
const util = require('getDistance.js')
 

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  const wxContext = cloud.getWXContext() 
   // app.use 表示该中间件会适用于所有的路由
   app.use(async (ctx,next)=>{
    ctx.data = {}
    await next()  //执行一下中间件.这是一个异步操作,要加上await
  })

  //校验用户是否合法
  app.router('checkUser', async (ctx) => {
    await UserCollection.where(_.and([
      {
        _openid: wxContext.OPENID
      },
      {
        usertype: event.usertype
      }])).get().then(function(res){
        if(res.data.length!=0) {
          ctx.data.checkResult = "合法用户!"
        }
        else{
          ctx.data.checkResult = "用户未注册!"
        }
      })
    ctx.body={code: 0, data: ctx.data}  
  })
  app.router('admin/kind/delete', async (ctx) => {
    try {
      return await db.collection('kind').doc(event.kind._id).remove()    
    } 
    catch (e) 
    {   
      console.error(e)    
    }  
  });
  //残疾人发布需求
  app.router('addMission',async(ctx) => {
    if(event.usertype!=1){
      ctx.body={errMsg: "只有注册后的残疾人才能发布需求！"}
      
    }else{
      await MissionCollection.add({
        data: {
          _openid:wxContext.OPENID,
          description: "learn cloud database",
          due: new Date("2018-09-01"),
          done: false
        }
      }).then(res=>{
        if(res.errMsg=='collection.add:ok'){
          ctx.data.addmission = "发布成功"
        }else{
          ctx.data.addmission = "发布失败"
        }
      })
      ctx.body={code: 0, data: ctx.data}
    }
  })

  //根据用户的位置，计算到残疾人需要的服务位置的距离
  app.router('submitCoordinate',async(ctx) => {
    await MissionCollection.where(_.and([
      {
        check: true //通过管理员的审核
      },
      {
        accept: false  //但是没有被接单
      },{
        area:event.area  //地区，省和市
      }])).get().then(function(res){
        let missionArr = []
        let dataArr = res.data
        dataArr.forEach((el,i)=>{
          //距离单位：km
          let dis = util.getDistance(event.location,el.location)
          el.dis = dis
          missionArr.push(el)
        })
        ctx.body = missionArr
      })
  })
  return app.serve()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}