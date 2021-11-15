const jwtDecode = require('jwt-decode');
const { body, validationResult } = require('express-validator');
const { createToken, hashPassword, hashLaravelPassword, verifyPassword, verifyLaravelPassword } = require('../utils/authentication');
const query = require('../utils/sqlQuery');
const fileController = require("./file");
const camera_model = require('../model/camera');
const gpu_model = require('../model/gpu');
const ftp_model = require('../model/ftp');
const media_model = require('../model/media');
const video_model = require('../model/video');
const vehicle_model = require('../model/vehicle');
const gps_model = require('../model/gps')
const core_func = require('../utils/core_func');
const axios = require('axios');
//camera
let getRealTimeGpsInfos = async (req, res) => {
  try {
      let gpsdata = [];
      const { vehicles } = req.body;
      for(let i = 0; i < vehicles.length; i++){
        const {device_imei,camera_id,agent_name,agent_id,avatar,camera_type,gpu,nick_name,license_plate_number,type_name} = vehicles[i];
        const gps_result = await gps_model.lastdata(device_imei);
        if(gps_result.length > 0){
          // gps_result[0].address = await getReverseInfo(gpsdata.lat,gpsdata.lng);
          gps_result[0].camera_id = camera_id;
          gps_result[0].agent_name = agent_name;
          gps_result[0].agent_id = agent_id;
          gps_result[0].avatar = avatar;
          gps_result[0].camera_type = camera_type;
          gps_result[0].gpu = gpu;
          gps_result[0].nick_name = nick_name;
          gps_result[0].car_number = license_plate_number;
          gps_result[0].type_name = type_name;
          gpsdata.push(gps_result[0]);
        }
      }
      return res.status(200).json({ gpsdata:gpsdata});
  }
  catch (error) {
    console.log(error)
      return res.status(400).json({
          message: 'Something went wrong.', err: error
      });
  }
}
let getTrips = async (req, res) => {
    try {
        let gpsdata;
        const { imei } = req.body;
        const gps_result = await gps_model.lastdata(imei);
        if(gps_result.length > 0){
          gpsdata = gps_result[0];
          gpsdata.address = await getReverseInfo(gpsdata.lat,gpsdata.lng);
        }
        return res.status(200).json({ gpsdata:gpsdata});
    }
    catch (error) {
      console.log(error)
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let getPlayback = async (req, res) => {
  try {
      let address = {
        start:'',
        end:'',
      };
      let video = [];
      const { imei, start, end, history_tag} = req.body;
      const gps_result = await gps_model.getter(imei,start,end,history_tag);
      video = await video_model.getDateRange(imei,start,end,history_tag);
      if(gps_result.length > 0){         
          const len = gps_result.length-1;
          address.start = await getReverseInfo(gps_result[0].lat,gps_result[0].lng);
          address.end = await getReverseInfo(gps_result[len].lat,gps_result[len].lng);
      }
      return res.status(200).json({ gpsdata:gps_result, address:address, video:video });
  }
  catch (error) {
    console.log(error)
      return res.status(400).json({
          message: 'Something went wrong.', err: error
      });
  }
}
let getVehicleInfo = async (req, res) => {
  try {
      const { imei } = req.body;
      const vehicleInfo = await vehicle_model.getFromImei(imei);
      const loc = await getGeoInfo(vehicleInfo.vehicle_province);
      vehicleInfo.loc = loc;
      return res.status(200).json({result:vehicleInfo });
  }
  catch (error) {
    console.log(error)
      return res.status(400).json({
          message: 'Something went wrong.', err: error
      });
  }
}
let PlaybackDate = async (req, res) => {
  try {
      const { imei, history_tag} = req.body;
      const exist_gps = await gps_model.getByImei(imei,history_tag);
      let datelist = [];
      let start_index = 0;
      let today = new Date();
      for(let i = 31; i >= 0; i--) {
        const day = history_tag?new Date(today.getFullYear(), today.getMonth()-1, today.getDate()).setDate(new Date(today.getFullYear(), today.getMonth()-1, today.getDate()).getDate()-i):new Date().setDate(new Date().getDate()-i)
        const date_from =core_func.strftime(new Date(day).setHours(0,0,0,0),'YYYY-mm-dd hh:mm:ss');
        const date_to =core_func.strftime(new Date(day).setHours(23,59,59,999),'YYYY-mm-dd hh:mm:ss');
        const existdata = checkGpsDataExist(exist_gps,date_from,date_to,start_index);
        if(existdata[1]==-100) break;
        if(existdata[0]) datelist.push(core_func.strftime(day));
        start_index = existdata[1];
      }
      return res.status(200).json({result:datelist });
  }
  catch (error) {
    console.log(error)
      return res.status(400).json({
          message: 'Something went wrong.', err: error
      });
  }
}
let addressinfo = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const address = await getReverseInfo(lat,lng);
    return res.status(200).json({result:address });
  }
  catch (error) {
      return res.status(400).json({
          message: 'Something went wrong.', err: error
      });
  }
}
//function
let getReverseInfo = async (lat, lng) => {
  const ak = 'z45YihwOQtgSEbUBnlx2gmVXCaGW7RPs';
  try {
    const item =  await axios.get("http://api.map.baidu.com/reverse_geocoding/v3/?"+"location="+lat+","+lng+"&ak="+ak+"&output=json");  
    return item['data']['result']['formatted_address']
  } 
  catch (err) {
    console.log(err)
    return '';
  }
}
let getGeoInfo = async (address) => {
  const ak = 'z45YihwOQtgSEbUBnlx2gmVXCaGW7RPs';
  try {
    const item =  await axios.get("http://api.map.baidu.com/geocoding/v3/?"+"address="+encodeURIComponent(address)+"&ak="+ak+"&output=json");  
    if(item['data']['status']==0)
    return item['data']['result']['location']
    else return false
  } 
  catch (err) {
    console.log(err)
    return false;
  }
}
let checkGpsDataExist = (arr,from,to,from_index)=>{
 for(let i = from_index; i < arr.length; i++){
   const date_value = new Date(arr[i]['created_at']).getTime();
   const from_t = new Date(from).getTime();
   const to_t = new Date(to).getTime();
   if(date_value >from_t && date_value < to_t) return [true,i];
   if(date_value > to_t) return [false,i];
 }
 return [false,-100];
}
module.exports = {
    getTrips,
    getPlayback,
    getVehicleInfo,
    PlaybackDate,
    getRealTimeGpsInfos,
    addressinfo,
}
