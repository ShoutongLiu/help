// miniprogram/pages/disabled/disabled.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardFont: '',
        cardBack: ''
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
    onSubmit () {
        if (!this.data.cardFont || !this.data.cardBack) {
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
        // Promise.all(promiseArr).then(res => {
        //     db.collection('blog').add({
        //         data: {
        //             ...userInfo,
        //             content,
        //             imgs: fileds,
        //             createTime: db.serverDate()  // 服务端时间
        //         }
        //     }).then(res => {
        //         console.log(res);
        //         wx.showToast({
        //             title: '发布成功'
        //         });
        //         wx.hideLoading();
        //         // 返回上一页面, 并刷新
        //         wx.navigateBack();
        //         let pages = getCurrentPages();
        //         const prevPage = pages[pages.length - 2]
        //         prevPage.onPullDownRefresh()

        //     }).catch(err => {
        //         wx.showToast({
        //             title: err.errMsg,
        //             icon: 'none',
        //         });
        //         wx.hideLoading();
        //     })
        // })
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