
  

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
const bubbleSort = function(arr){
  var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j].dis > arr[j+1].dis) {        //相邻元素两两对比
                var temp = arr[j+1];        //元素交换
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

exports.getDistance = getDistance
exports.bubbleSort = bubbleSort