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
    app.use(async (ctx, next) => {
        ctx.data = {}
        await next()  //执行一下中间件.这是一个异步操作,要加上await
    })

    //校验用户是否合法
    // app.router('checkUser', async (ctx) => {
    //     await UserCollection.where(_.and([
    //         {
    //             _openid: wxContext.OPENID
    //         },
    //         {
    //             usertype: event.usertype
    //         }])).get().then(function (res) {
    //             if (res.data.length != 0) {
    //                 ctx.data.checkResult = "合法用户!"
    //             }
    //             else {
    //                 ctx.data.checkResult = "用户未注册!"
    //             }
    //         })
    //     ctx.body = { code: 0, data: ctx.data }
    // })
    // app.router('admin/kind/delete', async (ctx) => {
    //     try {
    //         return await db.collection('kind').doc(event.kind._id).remove()
    //     }
    //     catch (e) {
    //         console.error(e)
    //     }
    // });
    //残疾人发布需求
    app.router('addMission', async (ctx) => {
        event = event.data
        if(event.usertype==0){
          ctx.body = { errMsg: "用户未登陆!" }
        }
        else if (event.usertype != 1) {
            ctx.body = { errMsg: "只有注册后的残疾人才能发布需求！",usertype:event.usertype}
        }
      
         else {
            await MissionCollection.add({
                data: {
                    f_openid:wxContext.OPENID,
                    Address: event.Address,
                    Difficulty:0, //难度系数默认0
                    ServiceDateTime: event.ServiceDateTime,
                    accept:false, //默认没有人接单
                    area: event.area,
                    authorAvatarUrl:event.authorAvatarUrl,
                    authorName:event.authorName,
                    check:false, //默认没有通过管理员审核
                    demContext:event.demContext,
                    demType:event.demType,
                    done:false,  //默认此单未完成
                    doneName:"",//默认处理人的微信昵称为空
                    location:event.location,
                    phone:event.phone,
                    price:"",  //默认积分为空,管理员打分
                    t_openid:""  //默认处理人的openid为空
                }
            }).then(res => {
                if (res.errMsg == 'collection.add:ok') {
                    ctx.data.addmission = "发布成功"
                } else {
                    ctx.data.addmission = "发布失败"
                }
            })
            ctx.body = { code: 0, data: ctx.data }
        }
    })
    //志愿者接受需求
    app.router('acceptMission',async(ctx)=>{
        if(event.usertype != 1){
            ctx.body = { errMsg: "只有注册后的志愿者才能接需求！",usertype:event.usertype}
        }else{
            await MissionCollection.doc(event._id).update({
                // data 传入需要局部更新的数据
                data: {
                    // 表示将 done 字段置为 true
                    accept: true,
                    doneName:event.doneName,
                    t_openid:wxContext.OPENID
                }
            })
            .then(res=>{
                if(res.stats.updated ==1){
                    ctx.body = { code:0,Msg: "接单成功!"}
                    
                }else{
                    ctx.body = { Msg: "接单失败!"}
                }
            })
            .catch(console.error)
            console.log("志愿者推送消息")
            await MissionCollection.doc(event._id).get().then(res=>{
                let openid = [res.data.f_openid,res.data.t_openid]
                let doneName = res.data.doneName
                let date = res.data.ServiceDateTime
                let demContext = res.data.demContext
                let message=[]
                openid.forEach((item,i)=>{
                    cloud.callFunction({
                        name:'sendSubscribeMessage',
                        data:{
                            openid:item,
                            doneName:doneName,
                            date:date,
                            demContext:demContext
                        }
                    })
                    message.push({openid:item,
                        doneName:res.data.doneName,
                        date:res.data.ServiceDateTime,
                        demContext:res.data.demContext})
                })
                ctx.body = { Msg: message}
            })
            
        }
        
        // if(ctx.body.Msg="接单成功"){
        //     console.log("开始触发消息推送")
        //     //订阅消息触发器 ,触发两次
        //     await MissionCollection.doc(event._id).get().then(res=>{
        //         ctx.body = { code:0,Msg: res}
        //         
        //     })
        // }
        
        
    })
    //根据用户的位置，计算到残疾人需要的服务位置的距离
    app.router('submitCoordinate', async (ctx) => {
        await MissionCollection.where(_.and([
            {
                check: true //通过管理员的审核
            },
            {
                accept: false  //但是没有被接单
            }, {
                area: event.area  //地区，省和市
            }])).get().then(function (res) {
                let missionArr = []
                let dataArr = res.data
                dataArr.forEach((el, i) => {
                    //距离单位：km
                    let dis = util.getDistance(event.location, el.location)
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