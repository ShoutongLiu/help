const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatar: '../../imgs/user-login.png',
        nickName: '',
        tabArr: [
            {
                icon: 'shenhe',
                text: '待审核'
            },
            {
                icon: 'hand',
                text: '待帮助'
            },
            {
                icon: 'completed',
                text: '待完成'
            },
            {
                icon: 'pingjia',
                text: '待评价'
            },
            {
                icon: 'quxiao',
                text: '已取消'
            }
        ],
        cardArr: [
            {
                text: '实名认证',
                id: '1'
            },
            {
                text: '残疾人认证',
                id: '2'
            },
            {
                text: '志愿者认证',
                id: '3'
            },
            {
                text: '关于我们',
                id: '4'
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.handleSetting()
    },

    handleSetting () {
        //  查看是否授权
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: (res) => {
                            this.login()
                            app.globalData.avatar = res.userInfo.avatarUrl
                            this.setData({ nickName: res.userInfo.nickName, avatar: res.userInfo.avatarUrl })
                        }
                    })
                }
            }
        })
    },
    bindGetUserInfo (e) {
        this.login()
        const info = e.detail.userInfo
        app.globalData.avatar = info.avatarUrl
        this.setData({ nickName: info.nickName, avatar: info.avatarUrl })
    },

    handleSelect (e) {
        const { id } = e.currentTarget.dataset
        switch (id) {
            case '1':
                wx.navigateTo({
                    url: `../../pages/realName/realname`,
                })
                break
            case '2':
                wx.navigateTo({
                    url: `../../pages/disabled/disabled`,
                })
                break
            case '3':
                wx.navigateTo({
                    url: `../../pages/volunteer/volunteer`,
                })
                break
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    login () {
        wx.cloud.callFunction({
            name: 'login'
        }).then(res => {
            console.log(res);
            app.globalData.openid = res.result.openid
            app.globalData.userType = res.result.usertype
        })
    },
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})