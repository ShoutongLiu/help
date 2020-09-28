const app = getApp()
import typeData from '../../utils/typeData'
const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
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
        startTime: '',
        endTime: '',
        address: '',
        name: '',
        phone: '',
        submitObj: {},
        isHealth: false
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

    handleDisabled () {
        if (app.globalData.userType === 2) {
            wx.showModal({
                title: '你已认证志愿者',
                showCancel: false
            })
            return
        }
        wx.navigateTo({
            url: '../../pages/disabled/disabled',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.handleGetDate()
        this.handleGetTime()
        this.setData({ phone: app.globalData.phone, name: app.globalData.realname })
    },

    /**
 * 生命周期函数--监听页面显示
 */
    onShow: function () {
        this.handleIsHealth()
    },
    // 判断身份
    handleIsHealth () {
        const { userType } = app.globalData
        this.setData({ isHealth: userType === 1 ? true : false })
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
        // 默认时间段是2小时
        const endDate = new Date(date.getTime() + 1000 * 60 * 60 * 2)
        const endHours = endDate.getHours()
        this.setData({ startTime: currenTime, endTime: endHours + ':' + min })
    },
    // 提交表单
    handleSubmit () {
        const { index, typeArr, content, region, address, date, startTime, endTime, name, phone } = this.data
        if (!content || !address || !name || !phone) {
            wx.showModal({
                title: '请把信息填写完整',
                showCancel: false
            })
            return
        }
        if (app.globalData.userType === 0) {
            wx.showModal({
                title: '请先登录',
                showCancel: false
            })
            return
        }
        if (!reg.test(phone)) {
            wx.showModal({
                title: '请输入正确的电话号码',
                showCancel: false
            })
            return
        }
        const type = typeArr[index]
        const item = typeData.find(v => {
            return v.text === type
        })
        const area = region[0] + region[1]
        const serve_address = region[2] + address
        const start = date + ' ' + startTime
        const end = date + ' ' + endTime
        const submitObj = {
            demType: item.val,
            area,
            demContext: content,
            Address: serve_address,
            startTime: start,
            endTime: end,
            authorName: name,
            phone,
            authorAvatarUrl: app.globalData.avatar,
            location: app.globalData.location,
            usertype: app.globalData.userType
        }
        const tmplId = '35lJ7F4Ryes7-5lMzrq3gyn6HRGEsRHJCF62jQaSJSA'
        wx.requestSubscribeMessage({
            tmplIds: [tmplId],
            complete: (res) => {
                console.log(res);
                if (res.errMsg === 'requestSubscribeMessage:ok') {
                    wx.showLoading({
                        title: '提交中...',
                    })
                    wx.cloud.callFunction({
                        name: 'router',
                        data: {
                            $url: 'addMission',
                            data: submitObj
                        }
                    }).then(res => {
                        console.log(res);
                        if (!res.result.code === 0) {
                            wx.showModal({
                                content: '发布是败',
                                showCancel: false
                            })
                        }
                        wx.showModal({
                            title: '需求提交成功',
                            content: '24小时内即可审核完成',
                            showCancel: false
                        })
                        wx.hideLoading()
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