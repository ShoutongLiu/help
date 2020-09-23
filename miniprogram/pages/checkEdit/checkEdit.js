// miniprogram/pages/checkEdit/checkEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemData: {},
    typeArr: ['物资需求', '出行需求', '房屋修理', '个人护理', '其他'],
    index: 0,
    _id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('item', (res) => {
        console.log(res.data);
        res.data.newAddress = res.data.area + res.data.Address
        this.setData({itemData: res.data, _id: res.data._id})
    })
  },

   // 获取需求类型
    bindPickerTypeChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },

    bindStartTime: function (e) {
        this.setData({
            startTime: e.detail.value
        })
    },
    bindEndTime: function (e) {
        this.setData({
            endTime: e.detail.value
        })
    },

    // 提交事件
    handleSubmit() {
        console.log(this.data.itemData);
    }, 

    // 撤销
    handleCancel() {
        wx.showLoading()
        wx.cloud.callFunction({
            name: 'cancelMission',
            data: {
                $url: 'cancelwaitCheck',
                _id: this.data._id,
                // _id: 'b8df3bd65f69d1d600407428601de590'
            }
        }).then(res => {
            if (res.result.coed ===  0) {
                wx.showToast({
                  title: '撤销成功',
                })
            }
            wx.hideLoading()
        }).catch(() => {
            wx.hideLoading()
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