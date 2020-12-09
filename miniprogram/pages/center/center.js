const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userType: '游客',
        avatar: '',
        seiviceInfo: {},
        assess: 0,
    },



    handleLoginOut () {
        app.globalData.nickname = ''
        app.globalData.openid = ''
        app.globalData.userType = 0
        wx.clearStorage({
            success: (() => {
                console.log('success');
            })
        })
        // wx.navigateBack()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { assess, order } = app.globalData.serviceInfo
        // 计算综合评价
        let num = (assess === 0 && order == 0) ? 0.00 : (assess / order).toFixed(2)
        this.setData({
            userType: options.usertype,
            avatar: app.globalData.avatar,
            serviceInfo: app.globalData.serviceInfo,
            assess: num
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
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