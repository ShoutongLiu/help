//app.js
App({
    globalData: {
        userInfo: null,
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
        })
    }
})