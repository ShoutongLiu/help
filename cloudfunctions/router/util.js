
  
//根据经纬度计算直线距离
const getDistance= function (location1, location2){

  var radLat1 = location1.lat * Math.PI / 180.0
  var radLat2 = location2.lat * Math.PI / 180.0
  var a = radLat1 - radLat2
  var b = location1.lng * Math.PI / 180.0 - location2.lng * Math.PI / 180.0
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
  Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * 6378.137// EARTH_RADIUS;
  s = Math.round(s * 10000)/10000  
  return parseInt(s)  //km
}

//冒泡排序算法
const bubbleSort = function(arr){
    var low = 0;
    var high= arr.length-1; //设置变量的初始值
    var tmp,j;
    while (low < high) {
        for (j= low; j< high; ++j) //正向冒泡,找到最大者
            if (arr[j].dis > arr[j+1].dis) {
                tmp = arr[j]; arr[j]=arr[j+1];arr[j+1]=tmp;
            }
        --high;                 //修改high值, 前移一位
        for (j=high; j>low; --j) //反向冒泡,找到最小者
            if (arr[j].dis < arr[j-1].dis) {
                tmp = arr[j]; arr[j]=arr[j-1];arr[j-1]=tmp;
            }
        ++low;                  //修改low值,后移一位
    }
    return arr;
}

exports.getDistance = getDistance
exports.bubbleSort = bubbleSort