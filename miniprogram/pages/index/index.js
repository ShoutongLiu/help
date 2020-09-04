//index.js
//获取应用实例
const app = getApp()
let QQMapWX = require('../../assets/map/qqmap-wx-jssdk.js');
// import data from '../../utils/data'
let keyWord = ''
Page({
    data: {
        value: '',
        address: '',
        helpData: [],
        location: {},
        area: '',
        tabVal: [
            {
                text: '离我最近',
                val: 'near'
            },
            {
                text: '积分最多',
                val: 'integral'
            },
            {
                text: '任务最难',
                val: 'hard'
            }
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
    onLoad () {
        this.authLocation()

    },

    // 获取附近的需求
    getDemand () {
        wx.cloud.callFunction({
            name: 'router',
            data: {
                $url: 'submitCoordinate',
                area: "广东省深圳市",
                location: {lat: 22.53332, lng: 113.93041}
            }
        }).then(res => {
            this.setData({ helpData: res.result })
            this.data.helpData.forEach(v => {
                this.data.typeData.forEach(i => {
                    if (v.demType === i.val) {
                        v.demType = i.text
                    }
                })
            })
        })
    },

    onSearch (e) {
        keyWord = e.detail.keyWord
        console.log(keyWord);
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
                app.globalData.location = location
                this.setData({ location })
                qqmapsdk.reverseGeocoder({
                    location,
                    success: (res) => {
                        const { recommend } = res.result.formatted_addresses
                        const { province, city } = res.result.address_component
                        let area = province === city ? province : province + city
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
                this.setData({ address: res.name })
            }
        })
    },
})
