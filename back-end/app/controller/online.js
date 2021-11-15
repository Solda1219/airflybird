const axios = require('axios');
const core_func = require('../utils/core_func');
const model = require('../model/online');
const report_model = require('../model/report');
const msg_model = require('../model/message');
const vehicle_model = require('../model/vehicle');
const camera = require('../model/camera');
let push = async (req, res) => {
  try {
    const {token,data_list}=req.body;
    const realData = JSON.parse(data_list);
    const vehicles = await vehicle_model.getAll();
    if(!token) return res.status(401).json({code:'401',msg:'Invalid token.'});
    for(let i = 0 ; i < realData.length; i ++){
      const dataLoop = realData[i];
      const imei = dataLoop['imei'];
      const key = existInArray(imei,vehicles);
      if(key===false) continue;
      const v_data = vehicles[key];
      const insert_data = {
        type:dataLoop['type'],
        imei:dataLoop['imei'],
        time:core_func.utcToChina(dataLoop['time']),
      }
      await model.create(insert_data);
      await model.insertLast(insert_data);
    }
    return res.json({code:'0',msg:'Success'});
  }
  catch (err) {
    console.log(err);
    return res.status(400).json({code:'400',msg:'Something went wrong.'});
  }
}
function existInArray(imei,data){
  for(let i = 0 ; i < data.length; i++){
    if(data[i]['device_imei']==imei) return i;
  }
  return false;
}
module.exports = {
  push,
}
