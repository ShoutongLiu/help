// pages/send/send.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 0,
        typeArr: ['物资需求', '出行需求', '房屋修理', '个人护理', '其他'],
        content: '',
        region: ['广东省', '深圳市', '南山区'],
        customItem: '全部',
        date: '',
        time: '',
        address: '',
        name: '',
        phone: '',
        submitObj: {}
    },

    // 获取需求类型
    bindPickerTypeChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },
    // 地区选择
    bindRegionChange: function (e) {
        this.setData({
            region: e.detail.value
        })
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    // 需求描述
    handleInputContent (e) {
        this.setData({ content: e.detail.value })
    },
    // 具体地址
    handleGetAddress (e) {
        this.setData({ address: e.detail.value })
    },
    handleGetName (e) {
        this.setData({ name: e.detail.value })
    },
    handleGetPhone (e) {
        this.setData({ phone: e.detail.value })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.handleGetDate()
        this.handleGetTime()
    },

    handleGetDate () {
        const date = new Date()
        const month = (date.getMonth() + 1).toString().length === 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
        const current_date = date.getFullYear() + '-' + month + '-' + date.getDate()
        this.setData({ date: current_date })
    },
    handleGetTime () {
        const date = new Date()
        const min = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes()
        const currenTime = date.getHours() + ':' + min
        this.setData({ time: currenTime })
    },
    // 提交表单
    handleSubmit () {
        const { index, typeArr, content, region, address, date, time, name, phone } = this.data
        if (!content || !address || !name || !phone) {
            wx.showModal({
                title: '请把信息填写完整',
                showCancel: false
            })
            return
        }
        const type = typeArr[index]
        const serve_address = region[0] + region[1] + region[2] + address
        const serve_time = date + ' ' + time
        const obj = {
            type,
            content,
            serve_address,
            serve_time,
            name,
            phone
        }
        this.setData({ submitObj: obj })
        console.log(this.data.submitObj);
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