import subjectArr from '../../utils/subject'
let timer = null
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        subject: [],
        usertype: 0,
    },
    radioChange (e) {
        const newObj = this.data.subject
        const { index } = e.currentTarget.dataset
        const currentChoose = e.detail.value
        const currentItem = newObj[index]
        currentItem.currentChoose = currentChoose
        this.setData({ subject: newObj })
    },

    handleSubmit () {
        let isFour = this.data.subject.every(v => {
            return Object.keys(v).length === 4
        })
        if (!isFour) {
            wx.showModal({
                title: '有未完成的题目',
                showCancel: false
            })
            return
        }
        let errArr = []

        // 判断是否正确
        this.data.subject.forEach(v => {
            if (v.answer !== v.currentChoose) {
                errArr.push(v)
            }
        })
        // 只允许错2题
        if (errArr.length > 2) {
            wx.showModal({
                title: '未能通过',
                content: '是否重新测试？',
                success: (res) => {
                    console.log(res);
                    if (res.confirm) {
                        this.reset()
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        wx.navigateBack()
                    }
                }
            })
            return
        }
        wx.showLoading({
            title: '提交中...',
        })
        wx.cloud.callFunction({
            name: 'addusers',
            data: {
                usertype: 2
            }
        }).then(res => {
            console.log(res);
            if (res.result.code === 0) {
                wx.showModal({
                    title: '恭喜通过测试',
                    showCancel: false,
                    success: (res) => {
                        console.log(res);
                        if (res.confirm) {
                            wx.navigateBack()
                        }
                    }
                })
                wx.hideLoading()
            } else {
                wx.showModal({
                    title: '认证失败',
                    content: res.result.errMsg,
                    showCancel: false,
                    success: (res) => {
                        if (res.confirm) {
                            wx.navigateBack()
                        }
                    }
                })
                wx.hideLoading()
            }
        }).catch((err) => {
            console.log(err);
            wx.hideLoading()
        })

    },
    // 重置题目
    reset () {
        wx.showLoading()
        this.setData({ subject: [] })
        timer = setTimeout(() => {
            wx.hideLoading()
            this.setData({ subject: subjectArr })
        }, 1000)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ subject: subjectArr, usertype: app.globalData.userType })
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
        clearTimeout(timer)
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