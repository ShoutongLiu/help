// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router');
cloud.init()
const DB = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
    const wxContext = cloud.getWXContext()
    // app.use 表示该中间件会适用于所有的路由
    app.use(async (ctx, next) => {
        ctx.data = {}
        await next()  //执行一下中间件.这是一个异步操作,要加上await
    })

    //根据_id查询需求详情
    app.router("cancelwaitCheck",async (ctx) =>{
      await DB.collection('mission').doc(event._id).get().then(res =>{
          ctx.data =  res.data.check
      })
      //还没通过审核，直接删除就完事
      if(ctx.data==0){
        await DB.collection('mission').doc(event._id).remove({
          success:function(res){
            ctx.body = { code: 0, msg:"撤销成功" }
          }
        })
      }else{
        //已经通过了审核，看看需求被接受了没
        await DB.collection('missionPass').where({orderNumber:event._id}).get({
          success:function(res){
            ctx.data = res.data[0].accept

          }
        })
        if (ctx.data == true){
          ctx.body = { code: -2, msg:"该需求已被志愿者接受，如若想撤销，请联系志愿者" }
        }else{
          //需求通过了审核，但是未被接受，残疾人还有权主动撤销
          await DB.collection('mission').doc(event._id).remove({
            success:function(res){
            }
          })
          //再撤销已经通过审核的该记录需求
          await DB.collection('missionPass').where({orderNumber:event._id}).remove()
          ctx.body = { code: 0, msg:"撤销成功" }
        }
      }
      
    })
  return app.serve()
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}