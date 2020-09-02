//index.js
//获取应用实例
var QQMapWX = require('../../assets/map/qqmap-wx-jssdk.js');
let keyWord = ''
Page({
    data: {
        value: '',
        location: '',
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
        ]
    },
    onLoad () {
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
                                content: '请点击右上角的三个点到设置打开获取位置服务',
                                showCancel: false
                            })
                            this.setData({ location: '位置获取失败' })
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
    onSearch (e) {
        keyWord = e.detail.keyWord
        console.log(keyWord);
    },
    getLocationInfo () {
        const qqmapsdk = new QQMapWX({
            key: 'XPUBZ-6WG3X-QLJ4K-7ZCRD-REKN6-L5BDO'
        });
        wx.getLocation({
            success: (res) => {
                const location = { latitude: res.latitude, longitude: res.longitude }
                qqmapsdk.reverseGeocoder({
                    location,
                    success: (res) => {
                        console.log(res);
                        const { recommend } = res.result.formatted_addresses
                        this.setData({ location: recommend })
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
                this.setData({ location: '位置获取失败' })
            }
        })
    },
    onChoose () {
        wx.chooseLocation({
            success: (res) => {
                this.setData({ location: res.name })
            }
        })
    },

})
