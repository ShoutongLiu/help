// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  try {
    const result = await cloud.openapi.subscribeMessage.send({
      templateId: '2hpkO7Ngbs1RkKG6n1FtNYVPDuB-vfwJjQhvm75Y_zw',
      touser: event.openid,
      page: 'index',
      lang: 'zh_CN',
      data: {
        thing1: {
          value: event.authorName
        },
        thing2: {
          value: '爱心帮益提醒'
        },
        date3: {
          value: event.date
        },
        thing4: {
          value: event.demContext
        }
      },
      miniprogramState: 'developer'
    })
    return result
  } catch (err) {
    return err
  }
}