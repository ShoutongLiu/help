
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
            res.data.date = res.data.startTime.split(' ')[0]
            res.data.startTime = res.data.startTime.split(' ')[1]
            res.data.endTime = res.data.endTime.split(' ')[1]
            this.setData({ itemData: res.data, _id: res.data._id })
        })
    },

    // 获取需求类型
    bindPickerTypeChange: function (e) {
        this.setValue(e, 'demType')
    },

    // 省市选择
    bindRegionChange (e) {
        this.setValue(e, 'area')
    },

    bindServeDate (e) {
        this.setValue(e, 'date')
    },

    bindStartTime (e) {
        this.setValue(e, 'startTime')
    },
    bindEndTime (e) {
        this.setValue(e, 'endTime')
    },

    bindContext (e) {
        console.log(e)
        this.setValue(e, 'demContext')
    },

    bindAddress (e) {
        this.setValue(e, 'Address')
    },

    setValue (e, attr) {
        console.log(e)
        let item = this.data.itemData
        item[attr] = e.detail.value
        this.setData({
            itemData: item
        })
    },

    // 提交事件
    handleSubmit () {
        const reObj = {
            demType: parseInt(this.data.itemData.demType),
            demContext: this.data.itemData.demContext,
            area: this.data.itemData.area,
            Address: this.data.itemData.Address,
            startTime: this.data.itemData.date + ' ' + this.data.itemData.startTime,
            endTime: this.data.itemData.date + ' ' + this.data.itemData.endTime,
            phone: this.data.itemData.phone,
            _id: this.data.itemData._id,
        }
        wx.showModal({
            title: '确定重新发布吗？',
            success: (res) => {
                if (res.confirm) {
                    console.log(reObj)
                    wx.cloud.callFunction({
                        name: 'republish',
                        data: reObj
                    }).then(res => {
                        console.log(res);
                        if (res.result.errCode !== 0) {
                            wx.showToast({
                                title: '重新发布失败',
                                icon: 'none'
                            })
                            return
                        }
                        wx.showToast({
                            title: '重新发布成功！'
                        })
                        wx.navigateBack({ delta: 2 })
                    })
                }
            }
        })
    },

    // 撤销
    handleCancel () {
        wx.showModal({
            title: '确定撤消吗？',
            success: (res) => {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: 'cancelMission',
                        data: {
                            $url: 'cancelwaitCheck',
                            _id: this.data._id,
                            // _id: 'b8df3bd65f69d1d600407428601de590'
                        }
                    }).then(res => {
                        console.log(res);
                        if (res.result.code !== 0) {
                            wx.showToast({
                                title: '撤消失败',
                                icon: 'none'
                            })
                            return
                        }
                        wx.showToast({
                            title: '撤消成功'
                        })
                        wx.navigateBack({ delta: 2 })
                    })
                }
            }
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