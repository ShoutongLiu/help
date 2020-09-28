import typeData from '../../utils/typeData'
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item: {
            type: Object,
        }
    },
    // 监听器
    observers: {
        ['item.demType'] (demType) {
            this.setData({
                type: this.tranType(demType)
            })
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        type: '',
        typeData,
    },


    /**
     * 组件的方法列表
     */
    methods: {
        goToDetail (e) {
            if (app.globalData.userType === 1) {
                wx.showToast({
                    title: '残疾人不能接单',
                    icon: 'none'
                })
                return
            }
            const { item } = e.currentTarget.dataset
            if (app.globalData.listType === 'waitCheck') {
                wx.navigateTo({
                    url: `../../pages/checkEdit/checkEdit`,
                    success: (res) => {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('item', { data: item })
                    }
                });
            } else {
                wx.navigateTo({
                    url: `../../pages/detail/detail`,
                    success: (res) => {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('item', { data: item })
                    }
                });
            }
        },
        callPhone (e) {
            const { phone } = e.currentTarget.dataset
            wx.makePhoneCall({
                phoneNumber: phone
            })
        },
        tranType (demType) {
            let currentType = this.data.typeData.find(v => {
                return v.val === demType
            })
            return currentType.text
        }
    }
})
