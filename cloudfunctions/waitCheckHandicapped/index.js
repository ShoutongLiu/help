// 云函数入口文件
//待审核的残疾人申请单
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const DB = cloud.database()
const _ = DB.command
const UserCollection = DB.collection('users')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await UserCollection.where({
    usertype: 10 //管理员还未审核的残疾人申请
  }).orderBy('certificationTime', 'desc').get().then(function (res) {
    event.data =res.data
  })
  return {
    respData:event.data
  }
}