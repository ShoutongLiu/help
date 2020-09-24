// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
//腾讯云服务OCR
const tencentcloud = require("tencentcloud-sdk-nodejs");

const OcrClient = tencentcloud.ocr.v20181119.Client;
const models = tencentcloud.ocr.v20181119.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

let cred = new Credential("AKIDpRCE9sve8duuVTlhypre5f6JNIRQB2gH", "3uVr2SgeTxEF6kjV1PM4WieolRsHLAic");
let httpProfile = new HttpProfile();
httpProfile.endpoint = "ocr.tencentcloudapi.com";
let clientProfile = new ClientProfile();
clientProfile.httpProfile = httpProfile;
let client = new OcrClient(cred, "ap-guangzhou", clientProfile);

let req = new models.IDCardOCRRequest();


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let params = {
    "ImageUrl": event.ImageUrl,
    // "CardSide":"FRONT"
  };
  req.from_json_string(JSON.stringify(params));


  return new Promise((resolve, reject) => {  // 通过Promise容器来接收异步API的回调，然后通过当前脚本返回给客户端
    client.IDCardOCR(req, function(errMsg, response) {
     if (errMsg) {
      resolve({ "errMsg": errMsg })
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