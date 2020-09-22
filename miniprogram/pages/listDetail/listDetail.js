const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('item', (res) => {
        console.log(res);
        app.globalData.listType = res.data.type
        const list = res.data.data || []
        if (list.length > 0) {
            list.forEach(v => {
                v.accept = false
                const length = (new Date(v.endTime)) - (new Date(v.startTime)) 
                v.length = this.transTime(length)
            })
        }
        this.setData({listData: list })
        // 修改页面title
        wx.setNavigationBarTitle({
            title: res.data.text
        })
    })
  },


   // 计算时长函数
   transTime(time) {
    let length  = null
    if (time % 3600000 !== 0) {
        const hours = Math.ceil((time / 1000 / 60 / 60)) + ' 小时'
        const minute = (time % 3600000) / 6000 + '分'
        length = hours + minute
    } else {
        length = Math.ceil((time / 1000 / 60 / 60)) + ' 小时'
    }
    return length
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