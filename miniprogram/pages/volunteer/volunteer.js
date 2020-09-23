// miniprogram/pages/volunteer/volunteer.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        subject: [
            {
                title: '1.请选择世界最友好的国家',
                options: [
                    {value: 'USA', name: 'A.美国'},
                    {value: 'CHN', name: 'B.中国'},
                    {value: 'BRA', name: 'C.巴西'},
                    {value: 'JPN', name: 'D.日本'}
                ],
                answer: 'CHN'
            },
            {
                title: '2.请选择世界最不友好的国家',
                options: [
                    {value: 'USA', name: 'A.美国'},
                    {value: 'CHN', name: 'B.中国'},
                    {value: 'BRA', name: 'C.巴西'},
                    {value: 'JPN', name: 'D.日本'}
                ],
                answer: 'USA'
            },
            {
                title: '3.2020年夏季奥运会在哪个国家举行？',
                options: [
                    {value: 'USA', name: 'A.美国'},
                    {value: 'CHN', name: 'B.中国'},
                    {value: 'BRA', name: 'C.巴西'},
                    {value: 'JPN', name: 'D.日本'}
                ],
                answer: 'JPN'
            },
        ]
    },
    radioChange(e) {
        const newObj = this.data.subject
        const { index } = e.currentTarget.dataset
        const currentChoose = e.detail.value
        const currentItem = newObj[index]
        currentItem.currentChoose = currentChoose
        this.setData({subject: newObj})
    },

    handleSubmit() {
       let isFour =  this.data.subject.every(v => {
            return  Object.keys(v).length === 4
        })
        if (!isFour) {
            wx.showModal({
                title: '有未完成的题目',
                showCancel: false
            })
            return
        }
        let errArr = []
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
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        } else {
            wx.showToast({
                title: '恭喜通过测试',
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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