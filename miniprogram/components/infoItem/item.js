// components/infoItem/item.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item: Object
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        goToDetail (e) {
            const { item } = e.currentTarget.dataset
            wx.navigateTo({
                url: `../../pages/detail/detail`,
                success: (res) => {
                    // 通过eventChannel向被打开页面传送数据
                    res.eventChannel.emit('item', { data: item })
                }
            });
        },
        callPhone (e) {
            const { phone } = e.currentTarget.dataset
            wx.makePhoneCall({
                phoneNumber: phone
            })
        }
    }
})
