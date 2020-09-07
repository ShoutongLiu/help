// miniprogram/pages/detail/detail.js
import typeData from '../../utils/typeData'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item_detail: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('item', (res) => {
            console.log(res);
            const data = res.data
            const target = typeData.find(v => {
                return v.val === data.demType
            })
            console.log(target);
            data.demType = target.text
            data.ServiceDateTime = data.ServiceDateTime
            this.setData({ item_detail: data })
        })
    },

    handleAccept () {
        wx.showModal({
            title: '接受成功',
            content: '需求已接受，赶紧联系求助人，前往帮助吧！',
            showCancel: false
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