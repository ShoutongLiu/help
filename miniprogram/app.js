//app.js
App({
    globalData: {
        userInfo: null,
        openid: ''
    },
    onLaunch: function () {
        wx.cloud.init({
            env: 'test-cloud-yv3p7',
            traceUser: true,
        })
        this.login()
    },

    login () {
        wx.cloud.callFunction({
            name: 'login'
        }).then(res => {
            console.log(res);
            const { openid } = res.result
            this.globalData.openid = openid
        })
    }
})