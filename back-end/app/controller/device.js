const axios = require('axios');
const vehicle_model = require('../model/vehicle');
const gps_model = require('../model/gps')
const core_func = require('../utils/core_func');
let deviceAll = async (req, res) => {
  try {
    const {phone,role}=req.user;
    const item = await vehicle_model.deviceAll(phone,role)
    return res.json({result:item});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Something went wrong.', err: err
    });
  }
}
let pushStream = async (req, res) => {
  try {
    const {imei}=req.body;
    const params = new URLSearchParams();
    params.append('imei', imei);
    params.append('proNo', "128");
    params.append("serverFlagId","0");
    params.append("cmdContent","RTMP,ON,OUT#");
    params.append("language","zh");
    params.append("cmdType","normallins");
    params.append("requestId","1");
    params.append("sync","true");
    params.append("offLineFlag","false")
    params.append("platform","ts");
    params.append("timeOut","30");
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    };
    const item = await axios.post("http://117.21.178.59:9080/api/device/sendInstruct",params,config);
    console.log(item.data)
    if(item.data['code']==0) return res.status(200).json({message:item.data['msg']})
    else return res.status(401).json({message:"Something went wrong"});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Something went wrong.', err: err
    });
  }
}
let sendCommand = async (req, res) => {
  try {
    const {imei,cmd}=req.body;
    const params = new URLSearchParams();
    params.append('imei', imei);
    params.append('proNo', "128");
    params.append("serverFlagId","0");
    params.append("cmdContent",cmd);
    params.append("language","zh");
    params.append("cmdType","normallins");
    params.append("requestId","1");
    params.append("sync","true");
    params.append("offLineFlag","false")
    params.append("platform","ts");
    params.append("timeOut","30");
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    };
    const item = await axios.post("http://117.21.178.59:9080/api/device/sendInstruct",params,config);
    if(item.data['code']==0) return res.status(200).json({message:item.data['msg']})
    else return res.status(401).json({message:"Something went wrong"});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Something went wrong.', err: err
    });
  }
}
let gpsInfo = async (req, res) => {
  try {
    let gpsdata;
    let heartbeat;
    const { device_imei } = req.body;
    const gps_result = await gps_model.lastdata(device_imei);
    if(gps_result.length>0){
      gpsdata = gps_result[0];
      gpsdata.address = await getReverseInfo(gpsdata.lat,gpsdata.lng);
    }
    const hearbeat_result = await axios.get(`http://117.21.178.59:9080/api/device/deviceTrackerHB?imeis=${device_imei}`);
    if(hearbeat_result.data.code == 0){
      if(hearbeat_result.data.data.length>0){
        heartbeat = hearbeat_result.data.data[0];
        heartbeat.time = core_func.strftime(heartbeat.time);
      }
    }
    return res.json({heartbeat:heartbeat,gpsdata:gpsdata,raw:hearbeat_result.data});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Something went wrong.', err: err
    });
  }
}
let getReverseInfo = async (lat, lng) => {
  const ak = 'z45YihwOQtgSEbUBnlx2gmVXCaGW7RPs';
  try {
    const item =  await axios.get("http://api.map.baidu.com/reverse_geocoding/v3/?"+"location="+lat+","+lng+"&ak="+ak+"&output=json");  
    return item['data']['result']['formatted_address']
  } 
  catch (err) {
    return '';
  }
}
module.exports = {
  deviceAll,
  gpsInfo,
  getReverseInfo,
  pushStream,
  sendCommand,
}
