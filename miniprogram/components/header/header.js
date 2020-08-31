// components/header1/header.js
let keyWord = ''
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        location: String
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
        onSearch (e) {
            keyWord = e.detail.value
            this.triggerEvent('search', { keyWord })
        },
        // 位置选择
        chooseLocation () {
            this.triggerEvent('location')
        }
    }
})
