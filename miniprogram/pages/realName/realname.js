// miniprogram/pages/realName/realname.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardFont: '../../imgs/back.png',
        cardBack: '../../imgs/font.png',
        region: ['广东省', '深圳市', '南山区'],
        address: ''
    },
    onChooseFont () {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const path = res.tempFilePaths[0]
                this.handleUpload(path, 1)
            },
            fail: (err) => {
                console.log(err);
            },
        });
    },
    onChooseBack () {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const path = res.tempFilePaths[0]
                this.handleUpload(path, 2)
            },
            fail: (err) => {
                console.log(err);
            },
        });
    },
    // 上传图片
    handleUpload(path, num) {
        wx.showLoading({
          title: '上传中...',
        })
        num === 1 ? this.setData({ cardFont: path }) : this.setData({ cardBack: path })
        let obj = num  === 1 ? { imgUrl1: path } : { imgUrl2: path }
        wx.cloud.callFunction({
            name:'Ocr',
            data: obj
        }).then(res => {
            console.log(res);
            wx.showToast({
                title: '上传成功'
            });
            wx.hideLoading();
        }).catch(err => {
            wx.showToast({
                title: err.errMsg,
                icon: 'none',
            });
            wx.hideLoading();
        })
        // let suffix = /\.\w+$/.exec(path)[0]
        // 调用上传云存储函数(异步)
        // wx.cloud.uploadFile({
        //     cloudPath: 'card/' + Date.now() + '-' + Math.random() * 10000000 + suffix,
        //     filePath: path,
        //     success: (res) => {
                
        //     },
        //     file (err) {
        //         console.log(err);
        //     }
        // })
    },
    // 地区选择
    bindRegionChange: function (e) {
        this.setData({
            region: e.detail.value
        })
    },
    handleGetAddress (e) {
        this.setData({ address: e.detail.value })
    },
    onSubmit () {
        let reg = RegExp(/http/)
        if (!reg.exec(this.data.cardFont) || !reg.exec(this.data.cardBack)) {
            wx.showToast({
                title: '请上传图片',
                icon: 'none'
            });
            return
        }
        wx.showLoading({
            title: '提交中...',
            mask: true
        });
        wx.hideLoading()
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