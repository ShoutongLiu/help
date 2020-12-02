// 计算时长函数
const transTime = (time) => {
    let length = null
    if (time % 3600000 !== 0) {
        const hours = Math.ceil((time / 1000 / 60 / 60)) + ' 小时'
        const minute = (time % 3600000) / 6000 + '分'
        length = hours + minute
    } else {
        length = Math.ceil((time / 1000 / 60 / 60)) + ' 小时'
    }
    return length
}

export default transTime