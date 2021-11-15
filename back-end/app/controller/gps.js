const axios = require('axios');
const core_func = require('../utils/core_func');
const gps_model = require('../model/gps');
const vehicle_model = require('../model/vehicle');
const camera = require('../model/camera');
const report_model = require('../model/report');
let pushgps = async (req, res) => {
  try {
    const {token,data_list}=req.body;
    const realData = JSON.parse(data_list);
    const convertedData = await convertCoorByGroup(realData);
    // console.log(realData.length+"---"+convertedData.length)
    // console.log(convertedData)
    const date_now = core_func.strftime(new Date(),'YYYY-mm-dd hh:mm:ss');
    if(!token) return res.status(401).json({code:'401',msg:'Invalid token.'})
    //push gps
    for(let i = 0 ; i < realData.length; i ++){
      const data = realData[i];
      const {lat,lng} = data;
      if(convertedData[i].x!=0){
        const insert_data = {
          acc:data['acc'],
          direction:data['direction'],
          gateInfo:data['gate_info'],
          gateTime:core_func.utcToChina(data['gate_time']),
          gpsMode:data['gps_mode'],
          gpsSpeed:data['gps_speed'],
          gpsTime:core_func.utcToChina(data['gps_time']),
          imei:data['imei'],
          lat:convertedData[i].y,
          lng:convertedData[i].x,
          lat_ori:lat,
          lng_ori:lng,
          posType:data['pos_type'],
          created_at:date_now,
        }
        await gps_model.pushgps(insert_data)
        await gps_model.insertLast(insert_data)
      }
    }
    return res.json({code:'0',msg:'Success'});
  }
  catch (err) {
    console.log(err);
    return res.status(400).json({code:'400',msg:'Something went wrong.'});
  }
}

let convertCoorByGroup = async (arr) => {
  // console.log('input-length is= '+arr.length)
  const chunked = chunk(arr,100);
  // console.log('chunked to =' + chunked.length)
  let result = [];
  for(let i = 0 ; i < chunked.length; i++)
  {
    const listOfcoor = makeCoorArr(chunked[i]);
    const convertedData = await(coorToBaiduFormat(listOfcoor));
    for(let k=0;k<convertedData.length;k++) result.push(convertedData[k])
    await sleep(20);
  }
  // console.log('result-is')
  // console.log(result.length)
  return result;
}
let coorToBaiduFormat = async (listOfCoor) => {
  const ak = 'z45YihwOQtgSEbUBnlx2gmVXCaGW7RPs';
  try {
    const item =  await axios.get("http://api.map.baidu.com/geoconv/v1/?coords="+listOfCoor+"&from=1&to=5&ak="+ak+"&output=json");
    if(!item['data']['result'].length) return makeTempArray[listOfCoor.length];
    return item['data']['result']
  }
  catch (err) {
    // console.log('error')
    if(listOfCoor.length) return makeTempArray[listOfCoor.length];
    else return [];
  }
}
const makeCoorArr = (arr) => {
  let str = '';
  for(let i = 0; i< arr.length; i++){
    const {lat,lng} = arr[i];
    if(i>0) str += ';';
    if(!lat || !lng) str +='0,0'
    else str+= ''+String(lng).trim()+','+String(lat).trim()
  }
  return str;
}
const chunk = (array, size) =>
  array.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(array.slice(i, i + size))
    return acc
  }, [])
function existInArray(imei,data){
  for(let i = 0 ; i < data.length; i++){
    if(data[i]['imei']==imei) return i;
  }
  return false;
}
const makeTempArray = (size) => {
  const temp=[];
  for(let i = 0 ; i < size; i++){
    temp.push([{x:0,y:0}]);
  }
  return temp;
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
// test()
module.exports = {
  pushgps,
}
