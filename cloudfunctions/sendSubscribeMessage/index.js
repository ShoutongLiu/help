// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const result = await cloud.openapi.subscribeMessage.send({
            templateId: '2hpkO7Ngbs1RkKG6n1FtNYVPDuB-vfwJjQhvm75Y_zw',
            touser: event.openid,
            pagepath: `/pages/detail/detail?_id=${event._id}`,
            lang: 'zh_CN',
            data: {
                thing1: {
                    value: event.doneName
                },
                thing2: {
                    value: '您有一项任务待完成'
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