const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatar: '../../imgs/user-login.png',
        nickName: '',
        userType: '游客',
        tabArr: [
            {
                icon: 'completed',
                text: '待完成',
                type: "waitDone"
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
        v_tabArr: [
            {
                icon: 'shenhe',
                text: '待审核',
                type: "waitCheck"
            },
            {
                icon: 'hand',
                text: '待帮助',
                type: "waitAccept"
            },
            {
                icon: 'completed',
                text: '待完成',
                type: "waitDone"
            },
            {
                icon: 'pingjia',
                text: '待评价',
                type: 'waitComment'
            },
            {
                icon: 'quxiao',
                text: '已取消',
                type: 'Cancelled'
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

    judgeType (type) {
        switch (type) {
            case 0:
                this.setData({ userType: '游客' })
                break
            case 1:
                this.setData({ userType: '残疾人' })
                break
            case 2:
                this.setData({ userType: '志愿者' })
                break
        }
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
                            app.globalData.nickname = res.userInfo.nickName
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
        app.globalData.nickname = info.nickName
        this.setData({ nickName: info.nickName, avatar: info.avatarUrl })
    },

    handleSelect (e) {
        const { id } = e.currentTarget.dataset
        if (!app.globalData.nickname && id !== '4') {
            wx.showModal({
                title: '请先登录',
                showCancel: false,
            })
            return
        }
        switch (id) {
            case '1':
                if (app.globalData.phone) {
                    wx.showToast({
                        title: '你已经实名认证',
                        icon: 'none'
                    })
                    return
                }
                wx.navigateTo({
                    url: `../../pages/realName/realname`,
                })
                break
            case '2':
                if (app.globalData.userType === 1) {
                    wx.showToast({
                        title: '你已经认证残疾人',
                        icon: 'none'
                    })
                    return
                } else if (app.globalData.userType === 2) {
                    wx.showToast({
                        title: '你已经认证志愿者',
                        icon: 'none'
                    })
                    return
                }
                wx.navigateTo({
                    url: `../../pages/disabled/disabled`,
                })
                break
            case '3':
                if (app.globalData.userType === 1) {
                    wx.showToast({
                        title: '你已经认证残疾人',
                        icon: 'none'
                    })
                    return
                } else if (app.globalData.userType === 2) {
                    wx.showToast({
                        title: '你已经认证志愿者',
                        icon: 'none'
                    })
                    return
                }
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
            app.globalData.phone = res.result.phone
            app.globalData.realname = res.result.realname
            if (res.result.usertype === 2) {
                let newTab = this.data.tabArr
                this.addData(newTab, res.result.userMissionInfo)
                this.setData({ tabArr: newTab })
            } else {
                let v_newTab = this.data.v_tabArr
                this.addData(v_newTab, res.result.userMissionInfo)
                this.setData({ v_tabArr: v_newTab })
            }
            this.judgeType(res.result.usertype)
        })
    },

    // 匹配对应的数据
    addData (arr, res) {
        arr.forEach(v => {
            res.forEach(i => {
                if (v.type === i.type) {
                    v.data = i.data
                }
            })
        })
    },

    // 跳转到需求列表
    handleToList (e) {
        console.log(e);
        app.globalData.isCheck = true
        console.log(app)
        const { item } = e.currentTarget.dataset
        wx.navigateTo({
            url: `../../pages/listDetail/listDetail`,
            success: (res) => {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('item', { data: item })
            }
        });
    },

    handleToCenter () {
        wx.navigateTo({
            url: '../../pages/center/center',
        })
    },
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.login()
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