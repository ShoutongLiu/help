// miniprogram/pages/detail/detail.js
import typeData from '../../utils/typeData'
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item_detail: {},
        _id: '',
        isAccept: false,
        isShow: false,
        isFinesh: false,
        type: '',
        userType: 0,
        evaValue: '',
        evaPrice: '',
        evaluateArr: [
            {
                val: 5,
                text: '5分(非常满意)'
            },
            {
                val: 4,
                text: '4分(满意)'
            },
            {
                val: 3,
                text: '3分(一般)'
            },
            {
                val: 2,
                text: '2分(不满意)'
            },
            {
                val: 1,
                text: '1分(非常满意)'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        // 设置页面title
        const title = options.title
        wx.setNavigationBarTitle({
            title: title
        })

        const id = options._id
        this.setData({ isShow: app.globalData.isCheck, type: app.globalData.listType, userType: app.globalData.userType })
        if (id) {
            wx.cloud.callFunction({
                name: 'router',
                data: {
                    $url: 'querySingleMission',
                    _id: id
                }
            }).then(res => {
                const data = res.result.data
                this.handleData(data)
            })
        } else {
            const eventChannel = this.getOpenerEventChannel()
            eventChannel.on('item', (res) => {
                const data = res.data
                this.handleData(data)
            })
        }
    },

    // 获取对应类型
    handleData (data) {
        const target = typeData.find(v => {
            return v.val === data.demType
        })
        data.demType = target.text
        this.setData({ item_detail: data, isAccept: data.accept })
    },

    handleAccept () {
        if (app.globalData.userType === 0) {
            wx.showModal({
                title: '提示',
                content: '请先登录并成为志愿者',
                showCancel: false,
                success: () => {
                    wx.switchTab({
                        url: '../../pages/user/user'
                    })
                }
            })
            return
        }
        if (app.globalData.userType === 1) {
            wx.showModal({
                title: '提示',
                content: '您的身份不能接受需求',
                showCancel: false,
            })
            return
        }
        const tmplId = '35lJ7F4Ryes7-5lMzrq3gyn6HRGEsRHJCF62jQaSJSA'
        const { nickname, userType, address, phone, location } = app.globalData
        const dataObj = {
            doneName: nickname,
            _id: this.data.item_detail._id,
            usertype: userType,
            dis: this.data.item_detail.dis,
            address: address,
            v_phone: phone,
            v_location: location
        }
        console.log(dataObj);
        wx.requestSubscribeMessage({
            tmplIds: [tmplId],
            complete: (res) => {
                console.log(res);
                if (res.errMsg === 'requestSubscribeMessage:ok') {
                    wx.cloud.callFunction({
                        name: 'router',
                        data: {
                            $url: 'acceptMission',
                            ...dataObj
                        }
                    }).then(res => {
                        console.log(res, 'result');
                        if (res.result.code === 0) {
                            wx.hideLoading()
                            wx.showModal({
                                title: '接受成功',
                                content: '需求已接受，赶紧联系求助人，前往帮助吧！',
                                showCancel: false,
                                success: () => {
                                    wx.navigateBack()
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    // 已完成事件
    handleDone () {
        wx.showModal({
            title: '确定完成吗？',
            success: (res) => {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: 'missionDone',
                        data: {
                            _id: this.data.item_detail._id,
                            t_openid: this.data.item_detail.t_openid,
                            integral: parseInt(this.data.item_detail.price)
                        }
                    }).then(res => {
                        console.log(res)
                        if (res.result.errcode !== 0) {
                            wx.showToast({
                                title: '确定已完成失败',
                                icon: 'none'
                            })
                            return
                        }
                        wx.showToast({
                            title: '确定已完成'
                        })
                        this.setData({ isFinesh: true })
                    })
                }
            }
        })
    },
    // 拨打电话
    callPhone (e) {
        const { phone } = e.currentTarget.dataset
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },

    handleDel (e) {
        console.log(e);
        const { item } = e.currentTarget.dataset
        wx.showModal({
            title: '确定删除吗？',
            success: (res) => {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: 'deleteMission',
                        data: {
                            _id: item._id,
                            check: item.check,
                        }
                    }).then(res => {
                        console.log(res)
                        if (res.result.errCode !== 0) {
                            wx.showToast({
                                title: '删除失败',
                                icon: 'none'
                            })
                            return
                        }
                        wx.showToast({
                            title: '删除成功'
                        })
                        wx.navigateBack({ delta: 2 })
                    })
                }
            }
        })
    },

    // 点击选择分数
    radioChange (e) {
        console.log(e);
        this.setData({ evaPrice: e.detail.value })
    },
    // 获取评价内容
    bindTextInput (e) {
        this.setData({ evaValue: e.detail.value })
    },
    // 提交评价事件
    handleEvaluate (e) {
        const { item } = e.currentTarget.dataset
        const subObj = {
            _id: item._id,
            openid: item.t_openid,
            usertype: app.globalData.userType,
            assess: parseInt(this.data.evaPrice),
            comment: this.data.evaValue
        }
        wx.showLoading({
            title: '提交中',
        })
        wx.cloud.callFunction({
            name: 'commentConfirm',
            data: subObj
        }).then(res => {
            console.log(res);
            if (res.result.errCode !== 0) {
                wx.showToast({
                    title: '评价失败',
                    icon: 'none'
                })
                wx.hideLoading()
                return
            }
            wx.showToast({
                title: '评价成功'
            })
            wx.navigateBack({ delta: 2 })
            wx.hideLoading()
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