// miniprogram/pages/detail/detail.js
import typeData from '../../utils/typeData'
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item_detail: {},
        _id: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('item', (res) => {
            const data = res.data
            const target = typeData.find(v => {
                return v.val === data.demType
            })
            data.demType = target.text
            this.setData({ item_detail: data })
        })
    },

    handleAccept () {
        if (app.globalData.userType !== 2) {
            wx.showModal({
                title: '提示',
                content: '请先登录并注册志愿者',
                showCancel: false,
                success: () => {
                    wx.navigateBack()
                }
            })
            return
        }
        const tmplId = '2hpkO7Ngbs1RkKG6n1FtNYVPDuB-vfwJjQhvm75Y_zw'
        const { nickname, userType } = app.globalData
        const dataObj = {
            doneName: nickname,
            _id: this.data.item_detail._id,
            usertype: userType
        }
        wx.requestSubscribeMessage({
            tmplIds: [tmplId],
            complete: (res) => {
                console.log(res);
                if (res.errMsg === 'requestSubscribeMessage:ok') {
                    wx.cloud.callFunction({
                        name: 'router',
                        data: {
                            $url: 'acceptMission',
                            ...dataObj
                        }
                    }).then(res => {
                        console.log(res, 'result');
                        if (res.result.code === 0) {
                            wx.hideLoading()
                            wx.showModal({
                                title: '接受成功',
                                content: '需求已接受，赶紧联系求助人，前往帮助吧！',
                                showCancel: false,
                                success: () => {
                                    wx.navigateBack()
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    // 拨打电话
    callPhone (e) {
        const { phone } = e.currentTarget.dataset
        wx.makePhoneCall({
            phoneNumber: phone
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
    onShow: function (options) {
        console.log(options);
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