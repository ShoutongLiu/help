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
          
    },

})