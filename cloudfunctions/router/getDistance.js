
  

const getDistance= function (location1, location2){

  var radLat1 = location1.lat * Math.PI / 180.0
  var radLat2 = location2.lat * Math.PI / 180.0
  var a = radLat1 - radLat2
  var b = location1.lng * Math.PI / 180.0 - location2.lng * Math.PI / 180.0
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
  Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * 6378.137// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000  
  return s  //km
}

exports.getDistance = getDistance