const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardFont: '',
        cardBack: '',
        usertype: 0,
    },
    onChooseFont () {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const path = res.tempFilePaths[0]
                this.uploadImg(path, 'cardFont')
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
                this.uploadImg(path, 'cardBack')
            },
            fail: (err) => {
                console.log(err);
            },
        });
    },


    // 上传函数
    uploadImg (path, type) {
        let suffix = /\.\w+$/.exec(path)[0]
        // 调用上传云存储函数(异步)
        wx.cloud.uploadFile({
            cloudPath: 'discard/' + Date.now() + '-' + Math.random() * 10000000 + suffix,
            filePath: path,
            success: (res) => {
                if (res.fileID) {
                    type === 'cardFont' ? this.setData({ cardFont: res.fileID }) : this.setData({ cardBack: res.fileID })
                    wx.showToast({
                        title: '上传成功',
                    })
                } else {
                    wx.showToast({
                        title: '上传失败',
                        icon: 'none'
                    })
                }
            },
            file (err) {
                console.log(err);
            }
        })
    },


    onSubmit () {
        if (!this.data.cardFont || !this.data.cardBack) {
            wx.showToast({
                title: '请上传图片',
                icon: 'none'
            });
            return
        }
        const tmplId = 'KTJQz1im9BH9tR7cNbUfSn9-HJc2djen_dmg9DL0dj0'
        wx.requestSubscribeMessage({
            tmplIds: [tmplId],
            complete: (res) => {
                console.log(res);
                if (res.errMsg === 'requestSubscribeMessage:ok') {
                    wx.showLoading({
                        title: '提交中...',
                        mask: true
                    });
                    wx.cloud.callFunction({
                        name: 'addusers',
                        data: {
                            usertype: 1,
                            Disability_Photo_ID: [this.data.cardFont, this.data.cardBack]
                        }
                    }).then(res => {
                        console.log(res);
                        if (res.result.code === 0) {
                            wx.showModal({
                                title: '认证成功',
                                showCancel: false,
                                success: (res) => {
                                    console.log(res);
                                    if (res.confirm) {
                                        wx.navigateBack()
                                    }
                                }
                            })
                        }
                        wx.hideLoading()
                    }).catch((err) => {
                        console.log(err);
                        wx.hideLoading()
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ usertype: app.globalData.userType })
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