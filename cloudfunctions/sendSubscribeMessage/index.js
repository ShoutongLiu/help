// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const result = await cloud.openapi.subscribeMessage.send({
            templateId: '35lJ7F4Ryes7-5lMzrq3gyn6HRGEsRHJCF62jQaSJSA',
            touser: event.openid,
            page: `/pages/detail/detail?_id=${event._id}`,
            lang: 'zh_CN',
            data: {
                name1: {
                    value: event.authorName
                },
                name5: {
                    value: event.doneName
                },
                date7: {
                    value: event.startTime
                },
                date6: {
                    value: event.endTime
                },
                thing8: {
                    value: event.Address
                }
            },
            miniprogramState: 'developer'
        })
        return result
    } catch (err) {
        return err
    }
}