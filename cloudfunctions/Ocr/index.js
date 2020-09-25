// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
//腾讯云服务OCR
const tencentcloud = require("tencentcloud-sdk-nodejs");

const secretId = "AKIDpRCE9sve8duuVTlhypre5f6JNIRQB2gH"
const secretKey = "3uVr2SgeTxEF6kjV1PM4WieolRsHLAic"
const OcrClient = tencentcloud.ocr.v20181119.Client;
const models = tencentcloud.ocr.v20181119.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

let cred = new Credential(secretId,secretKey );
// 实例化一个http选项，可选的，没有特殊需求可以跳过。
let httpProfile = new HttpProfile();
httpProfile.reqMethod = "POST";  // post请求(默认为post请求)(POST or GET)
httpProfile.reqTimeout = 30;  // 请求超时时间，单位为秒(默认60秒)
httpProfile.endpoint = "ocr.tencentcloudapi.com";// 指定接入地域域名(默认就近接入)

// 实例化一个client选项，可选的，没有特殊需求可以跳过
let clientProfile = new ClientProfile();
clientProfile.signMethod = "TC3-HMAC-SHA256";  // 指定签名算法(默认为HmacSHA256)(HmacSHA1, HmacSHA256)
clientProfile.httpProfile = httpProfile;
let client = new OcrClient(cred, "ap-guangzhou", clientProfile);

let req = new models.IDCardOCRRequest();


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //下载文件
  const res = await cloud.downloadFile({
    fileID: event.fileID,
  })
  //生成base64
  const buffer = res.fileContent.toString('base64')
  let params = {
    "ImageBase64": buffer,
    "CardSide":event.type
    // "Config": "{\"CropIdCard\":true}"
  };
  req.from_json_string(JSON.stringify(params));


  return new Promise((resolve, reject) => {  // 通过Promise容器来接收异步API的回调，然后通过当前脚本返回给客户端
    client.IDCardOCR(req, function(errMsg, response) {
     if (errMsg) {
      resolve({ "errMsg": errMsg})
     }
     console.log(typeof(response))
     resolve({ "userInfo": response})
   });
  })
  
  
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}