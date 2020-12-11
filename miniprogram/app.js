//app.js
App({
    globalData: {
        userInfo: null,
        userType: 0,
        openid: '',
        avatar: '',
        nickname: '',
        location: {},
        isCheck: false,
        isIndex: true,
        address: '',
        listType: '',
        realname: '',
        phone: '',
        serviceInfo: {},
    },
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'test-cloud-yv3p7',
                traceUser: true,
            })
        }
    },
})