// miniprogram/pages/checkEdit/checkEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemData: {},
    typeArr: ['物资需求', '出行需求', '房屋修理', '个人护理', '其他'],
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('item', (res) => {
        console.log(res.data);
        res.data.newAddress = res.data.area + res.data.Address
        this.setData({itemData: res.data})
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