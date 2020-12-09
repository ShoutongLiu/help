//index.js
//获取应用实例
const app = getApp()
let QQMapWX = require('../../assets/map/qqmap-wx-jssdk.js');
import transTime from '../../utils/computeTime'
let keyWord = ''

Page({
    data: {
        isIndex: true,
        value: '',
        address: '',
        helpData: [],
        result: [],
        ajaxLocation: {},
        area: '',
        sortType: 'near',
        tabVal: [
            {
                text: '离我最近',
                val: 'near'
            },
            {
                text: '积分最多',
                val: 'integral'
            },
            // {
            //     text: '任务最难',
            //     val: 'hard'
            // }
        ],
        typeData: [
            {
                val: 1,
                text: '物资需求'
            },
            {
                val: 2,
                text: '出行需求'
            },
            {
                val: 3,
                text: '房屋修理'
            },
            {
                val: 4,
                text: '个人护理'
            },
            {
                val: 5,
                text: '其他'
            },
        ]
    },
    onShow () {
        app.globalData.isCheck = false
        app.globalData.isIndex = true
        this.authLocation()
    },

    // 获取附近的需求
    getDemand () {
        wx.showLoading({
            title: '加载中...'
        })
        wx.cloud.callFunction({
            name: 'router',
            data: {
                $url: 'submitCoordinate',
                area: this.data.area,
                location: this.data.ajaxLocation
            }
        }).then(res => {
            res.result.forEach(v => {
                let end = new Date(v.endTime.replace(/-/g, '/')).getTime()
                let start = new Date(v.startTime.replace(/-/g, '/')).getTime()
                const length = end - start
                v.length = transTime(length)
            })
            this.setData({ helpData: res.result, result: res.result })
            console.log(this.data.helpData);
            wx.hideLoading()
            wx.stopPullDownRefresh()
        })
    },


    onSearch (e) {
        keyWord = e.detail.keyWord
        let searchArr = []
        this.data.result.forEach(v => {
            if (v.demContext.indexOf(keyWord) > -1) {
                searchArr.push(v)
            }
        })
        this.setData({ helpData: searchArr })
    },
    // 判断权限获取位置信息
    authLocation () {
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: () => {
                            this.getLocationInfo()
                        },
                        fail: () => {
                            wx.showModal({
                                title: '位置获取失败',
                                content: '请点击右上角的三个点到设置打开获取位置服务，并重新进入小程序',
                                showCancel: false
                            })
                            this.setData({ address: '位置获取失败' })
                        }
                    })
                } else {
                    this.getLocationInfo()
                }
            },
            fail: () => {
            }
        })
    },
    // 根据坐标获取位置信息
    getLocationInfo () {
        const qqmapsdk = new QQMapWX({
            key: 'XPUBZ-6WG3X-QLJ4K-7ZCRD-REKN6-L5BDO'
        });
        wx.getLocation({
            success: (res) => {
                const location = { latitude: res.latitude, longitude: res.longitude }
                const ajaxLocation = { lat: res.latitude, lng: res.longitude }
                app.globalData.location = location
                this.setData({ ajaxLocation })
                qqmapsdk.reverseGeocoder({
                    location,
                    success: (res) => {
                        const { recommend } = res.result.formatted_addresses
                        const { province, city } = res.result.address_component
                        let area = province === city ? province : province + city
                        app.globalData.address = recommend
                        this.setData({ address: recommend, area })
                        this.getDemand()        // 调用函数获取数据
                    },
                    fail: (res) => {
                        console.log(res);
                    }
                })
            },
            fail: () => {
                wx.showModal({
                    title: '位置获取失败',
                    content: '请检查手机定位是否打开',
                    showCancel: false
                })
                this.setData({ address: '位置获取失败' })
            }
        })
    },
    onChoose () {
        wx.chooseLocation({
            success: (res) => {
                const ajaxLocation = { lat: res.latitude, lng: res.longitude }
                app.globalData.address = res.name
                this.setData({ address: res.name, ajaxLocation })
                console.log(this.data.location);
                this.getDemand()
            }
        })
    },

    // 排序函数
    compare (property, type) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            // 根据传入的类型判断大小排序
            if (type === 'near') {
                return parseInt(value1) - parseInt(value2)
            } else {
                return parseInt(value2) - parseInt(value1)
            }
        }
    },

    // 点击排序
    handleSort (e) {
        const value = e.currentTarget.dataset.val
        this.setData({ sortType: value })
        switch (value) {
            case 'near':
                let priceArr = this.data.helpData.sort(this.compare('dis', 'near'))
                this.setData({ helpData: priceArr })
                break;
            case 'integral':
                let disArr = this.data.helpData.sort(this.compare('price', 'integral'))
                this.setData({ helpData: disArr })
                break;

            default:
                break;
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.getDemand();
    },
})
