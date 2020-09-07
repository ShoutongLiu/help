//app.js
App({
    globalData: {
        userInfo: null,
        userType: 0,
        openid: '',
        avatar: '',
        nickname: '',
        location: {}
    },
    onLaunch: function () {
        wx.cloud.init({
            env: 'test-cloud-yv3p7',
            traceUser: true,
        })
    },
})