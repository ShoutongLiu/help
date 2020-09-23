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
                this.setData({ cardFont: res.tempFilePaths[0] })
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
                this.setData({ cardBack: res.tempFilePaths[0] })
            },
            fail: (err) => {
                console.log(err);
            },
        });
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
            title: '上传中...',
            mask: true
        });
        let promiseArr = []
        let fileds = []
        let images = []
        images.push(this.data.cardFont)
        images.push(this.data.cardBack)
        // 图片上传到云存储
        for (let i = 0; i < images.length; i++) {
            let p = new Promise((resolve, reject) => {
                let item = images[i]
                // 获取文件拓展名
                let suffix = /\.\w+$/.exec(item)[0]
                // 调用上传云存储函数(异步)
                wx.cloud.uploadFile({
                    cloudPath: 'card/' + Date.now() + '-' + Math.random() * 10000000 + suffix,
                    filePath: item,
                    success (res) {
                        console.log(res.fileID);
                        fileds = fileds.concat(res.fileID)
                        resolve()
                    },
                    file (err) {
                        console.log(err);
                        reject()
                    }
                })
            })
            promiseArr.push(p)
        }
        console.log(promiseArr);
        // 所有图片上传完后存入数据库
        Promise.all(promiseArr).then(res => {
            wx.cloud.callFunction({
                name:'Ocr',
                data: {
                    imgUrl1: this.cardFont,
                    imgUr2: this.cardBack
                }
            }).then(res => {
                console.log(res);
                wx.showToast({
                    title: '认证成功'
                });
                wx.hideLoading();
            }).catch(err => {
                wx.showToast({
                    title: err.errMsg,
                    icon: 'none',
                });
                wx.hideLoading();
            })
        })
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