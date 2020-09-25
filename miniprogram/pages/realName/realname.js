const regPhone = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardFont: '../../imgs/back.png',
        cardBack: '../../imgs/font.png',
        fontInfo: null,
        backInfo: null,
        fileID1:'',
        fileID2:'',
        phone: '',
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
          mask: true
        })
        let suffix = /\.\w+$/.exec(path)[0]
        num === 1 ? this.setData({ cardFont: path }) : this.setData({ cardBack: path })
        let pathName = 'card/' + Date.now() + '-' + Math.random() * 10000000 + suffix
        // let pathName = num === 1 ? `card/font${suffix}` : `card/back${suffix}`
        // 调用上传云存储函数(异步)
        wx.cloud.uploadFile({
            cloudPath: pathName,
            filePath: path,
            success: (res) => {
                console.log(res);
                num === 1 ? this.setData({fileID1: res.fileID}) : this.setData({fileID2: res.fileID})
                wx.cloud.callFunction({
                    name:'Ocr',
                    data: {
                        fileID: res.fileID,
                        type: num === 1 ? 'FRONT' : 'BACK'
                    }
                }).then(res => {
                    console.log(res);
                    if (res.result.userInfo) {
                        wx.showToast({
                            title: '图片识别成功'
                        });
                        num === 1 ? this.setData({fontInfo: res.result.userInfo}) : this.setData({backInfo: res.result.userInfo})
                    } else {
                        this.renzhengFail(this.data.fileID)
                    }
                    wx.hideLoading();
                }).catch(err => {
                    console.log(err);
                    this.renzhengFail(this.data.fileID)
                    wx.hideLoading();
                })
            },
            file (err) {
                wx.hideLoading();
                console.log(err);
            }
        })
    },

    renzhengFail(fileID) {
        wx.showToast({
            title: '识别失败，请重新上传',
            icon: 'none',
        });
          // 认证失败，删除
        wx.cloud.deleteFile({
            fileList: [fileID],
            success: res => {
                console.log(res.fileList)
            },
            fail: console.error
        })
    },

    // 获取电话
    handleGetphone(e) {
        console.log(e);
        this.setData({phone: e.detail.value})
    },  

    onSubmit () {  
        if (this.data.cardFont.indexOf('http') !== -1) || (this.data.cardBack.indexOf('http') !== -1) {
            wx.showToast({
                title: '请上传图片',
                icon: 'none'
            });
            return
        }
        if (!this.data.phone) {
            wx.showToast({
                title: '请填写手机号码',
                icon: 'none'
            });
            return
        }

        if (!regPhone.test(this.data.phone)) {
            wx.showToast({
                title: '请输入正确的电话号码',
                icon: 'none'
            })
            return
        }

        if (!this.data.fontInfo || !this.data.backInfo) {
            wx.showToast({
                title: '请输入通过识别',
                icon: 'none'
            })
            return
        }
        wx.showLoading({
            title: '提交中...',
            mask: true
        });
        let fontObj = this.data.backInfo
        fontObj.Authority = this.data.fontInfo.Authority
        fontObj.ValidDate = this.data.fontInfo.ValidDate
        const {fileID1, fileID2} = this.data
        wx.cloud.callFunction({
            name: 'realCommit',
            data: {
                realnameInfo: fontObj,
                phone: this.data.phone,
                fileID:[fileID1, fileID2]
            }
        }).then(res => {
            console.log(res)
            if (res.result.code === 0) {
                wx.showModal({
                    title: '实名认证成功',
                    showCancel: false,
                    success: (res) => {
                        if (res.confirm) {
                            wx.navigateBack()
                        } 
                    }
                })
              
            } else {
                wx.showModal({
                    title: '实名认证失败',
                    content: res.result.errMsg,
                    showCancel: false
                }) 
            }
        })
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