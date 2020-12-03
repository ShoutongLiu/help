const app = getApp()
import transTime from '../../utils/computeTime'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listData: [],
        isIndex: false,
        title: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('item', (res) => {
            console.log(res);
            app.globalData.listType = res.data.type
            const list = res.data.data || []
            if (list.length > 0) {
                list.forEach(v => {
                    v.accept = false
                    let end = new Date(v.endTime.replace(/-/g, '/')).getTime()
                    let start = new Date(v.startTime.replace(/-/g, '/')).getTime()
                    const length = end - start
                    v.length = transTime(length)
                })
            }
            this.setData({ listData: list, title: res.data.text })
            // 修改页面title
            wx.setNavigationBarTitle({
                title: res.data.text
            })
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
        app.globalData.isIndex = false
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