const axios = require('axios');
const core_func = require('../utils/core_func');
const model = require('../model/alert');
const report_model = require('../model/report');
const msg_model = require('../model/message');
const vehicle_model = require('../model/vehicle');
const camera = require('../model/camera');
const real_mode = true;
let push = async (req, res) => {
  try {
    const {token,data_list}=req.body;
    // console.log('here');
    // console.log(data_list)
    const realData = JSON.parse(data_list);
    const date_now = core_func.strftime(new Date(),'YYYY-mm-dd hh:mm:ss');
    const vehicles = await vehicle_model.getAll();
    if(!token) return res.status(401).json({code:'401',msg:'Invalid token.'})
    for(let i = 0 ; i < realData.length; i ++){
      const dataLoop = realData[i];
      const {type,msg,postTime} = dataLoop;
      const imei = msg['deviceImei'];
      const key = existInArray(imei,vehicles);
      if(key===false) continue;
      const v_data = vehicles[key];
      const insert_data = {
        imei:msg['deviceImei'],
        msg:JSON.stringify(msg),
        postTime:postTime,
        type:type,
        alertType:msg['alertType'],
        vehicle_id:v_data.id,
        device_name:v_data.license_plate_number,
        account:v_data.real_name,
        created_at:date_now,
      }
      await model.create(insert_data);
    }
    return res.json({code:'0',msg:'Success'});
  }
  catch (err) {
    console.log('err');
    return res.status(400).json({code:'400',msg:'Something went wrong.'});
  }
}
let getAlert = async (req, res) => {
  try {
    const {phone, role} = req.user;
    const vehicles = await vehicle_model.deviceAll(phone,role);
    const todayValue = core_func.strftime(new Date().setHours(0,0,0,1));
    const result = [];
    const item = await model.getList(todayValue);
    for(let i =0 ; i < item.length; i++){
      const data = JSON.parse(JSON.stringify(item[i]));
      const exist = existInArray(data.imei,vehicles);
      if(exist===false) continue;
      data.postTime = core_func.strftime(data.postTime);
      data.alertTypeName = getAlertType(data.alertType).name_ch;
      data.description = getAlertType(data.alertType).description;
      result.push(data)
    }
    return res.json({result:result});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({message:'Something went wrong.'});
  }
}
let getMessage = async (req, res) => {
  try {
    const result = [];
    const {phone, role} = req.user;
    const {imei,vehicle_number,type,status} = req.body;
    const vehicles = await vehicle_model.deviceAll(phone,role);
    const todayValue = core_func.strftime(new Date().setHours(0,0,0,0));
    const msg = await msg_model.getList(todayValue);
    for(let i =0 ; i < msg.length; i++){
      const data = JSON.parse(JSON.stringify(msg[i]));
      if(type==0&&data.msg_type!=0) continue;
      if(type==1&&data.msg_type!=1) continue;
      if(type==2&&data.msg_type!=2) continue;
      if(status==1&&data.status!=1) continue;
      if(status==0&&data.status!=0) continue;
      if(imei&&data.imei!=imei) continue;
      const exist = existInArray(data.imei,vehicles);
      if(exist===false) continue;
      const ve = vehicles[exist];
      if(vehicle_number&&vehicle_number!=ve.license_plate_number) continue;
      data.vehicle_number = ve.license_plate_number;
      data.start = ve.start;
      data.end = ve.end;
      data.model = ve.model;
      data.type_name = ve.type_name;
      data.created_at = core_func.strftime(data.created_at);
      data.msgTypeName = getMessageType(data.msg_type);
      data.msgContent = getMessageContent(data.msg_type);
      data.status_name = data.status?'read':'unread';
      result.push(data)
    }
    return res.json({result:result});
  }
  catch (err) {
    return res.status(400).json({message:'Something went wrong.'});
  }
}
let readAlert = async (req, res) => {
  try {
    const {phone, role} = req.user;
    const {data,read} = req.body;
    for(let i =0 ; i < data.length; i++){
      await model.update(data[i].id,{is_read:read})
    }
    return res.json({message:'Success'});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({message:'Something went wrong.'});
  }
}
let readMessage = async (req, res) => {
  try {
    const {phone, role} = req.user;
    const data = req.body;
    for(let i =0 ; i < data.length; i++){
      await msg_model.update(data[i].id,{status:1})
    }
    return res.json({message:'Success'});
  }
  catch (err) {
    return res.status(400).json({message:'Something went wrong.'});
  }
}
let remark = async (req, res) => {
  try {
    const {id, role} = req.user;
    const {src, data} = req.body;
    await model.update(src.id,{is_read:1,operator:data.operator,content:data.content,user_id:id,user_role:role});
    return res.json({message:'Success'});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({message:'Something went wrong.'});
  }
}
let getBasicSetting = async (req, res) => {
  try {
    let result={};
    const item = await report_model.getReportType();
    for(let i =0 ; i < item.length; i++){
      const {name,value,range} = item[i];
      if(name=='offline'){
        result.offline_range=range;
      }
      if(name=='parking'){
        result.parking_range=range;
      }
      if(name=='idling'){
        result.idling_range=range;
        result.idling_val=range;
      }
    }
    return res.json({result:result});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({message:'Something went wrong.'});
  }
}
let editBasicSetting = async (req, res) => {
  try {
    const  {offline_range,parking_range,idling_range,idling_val} = req.body;
    await report_model.editReportType('offline',{range:offline_range});
    await report_model.editReportType('parking',{range:parking_range});
    await report_model.editReportType('idling',{range:idling_range,value:idling_val});
    return res.json({message:'Sucess'});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({message:'Something went wrong.'});
  }
}
let getAlertReport = async (req, res) => {
  try {
    let result = [];
    const { phone, role} = req.user;
    const { startdate,enddate,agent,imei,history_tag} = req.body;
    const vehicles = await vehicle_model.deviceAll(phone,role);
    //------filter part----------
    let v_arr = [];
    //filter by agent
    if(role=='super'||role=='admin'){
      if(agent!='all') v_arr = core_func.filter_array(vehicles,'agent_id',agent)
      else v_arr = vehicles
    }else{
      v_arr = vehicles
    }
    //filter by imei
    if(imei){
      let i_a = [];
      const item = JSON.parse(JSON.stringify(v_arr));
      for(let i = 0; i < imei.length; i++){
        const get_i = core_func.filter_array(item,'device_imei',imei[i]);
        i_a=i_a.concat(get_i);
      }
      v_arr = i_a;
    }
    //get result
    const item = await model.getListByDate(startdate,enddate);
    for(let k = 0; k < v_arr.length;k++){
      const li = JSON.parse(JSON.stringify(v_arr[k]));//license,device_imei,model,
      const f_data = core_func.filter_array(item,'imei',li['device_imei']);
      for(let i =0 ; i < f_data.length; i++){
        const data = JSON.parse(JSON.stringify(f_data[i]));
        data.postTime = core_func.strftime(data.postTime);
        data.alertTypeName = getAlertType(data.alertType).name_ch;
        data.description = getAlertType(data.alertType).description;
        result.push(data)
      }
    }
    return res.json({result:result});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({message:'Something went wrong.'});
  }
}
let getTypeForAlertReport = async (req, res) => {
  try {
    const HexAndDexVal = [
      {de:128,hex:'0x80',name_ch:'后视镜振动报警',name_en:'',description:'Launching the function of vibration warn on rearview mirror'},
      {de:129,hex:'0x81',name_ch:'后视镜超流量报警',name_en:'',description:'Launching warn on rearview due to internet traffic usage exceeded the regular standard'},
      {de:130,hex:'0x82',name_ch:'设备重启',name_en:'',description:'Resetting device'},
      {de:132,hex:'0x84',name_ch:'1号摄象头不正常',name_en:'',description:'The camera of Num 1 goes wrong'},
      {de:133,hex:'0x85',name_ch:'2号摄象头不正常',name_en:'',description:'The camera of Num 2 goes wrong'},
      {de:134,hex:'0x86',name_ch:'SDK卡无法识别',name_en:'',description:'Being unable to identify SDK card'},
      {de:135,hex:'0x87',name_ch:'后视镜超速报警',name_en:'',description:'Launching warn on rearview once the car overspeeds'},
      {de:136,hex:'0x88',name_ch:'断电报警',name_en:'',description:'Launching Power alarm due to loss of power'},
      {de:137,hex:'0x89',name_ch:'无USB摄象头',name_en:'',description:'The camera without USB interface.'},
      {de:144,hex:'0x90',name_ch:'急加速',name_en:'',description:'Rapid acceleration'},
      {de:145,hex:'0x91',name_ch:'急减速',name_en:'',description:'Rapid deceleration'},
      {de:146,hex:'0x92',name_ch:'急转弯',name_en:'',description:'Sharp turn of vehicle'},
      {de:147,hex:'0x93',name_ch:'撞车报警',name_en:'',description:'Launching warn because of collision'},
      {de:138,hex:'0x8A',name_ch:'断油电告警恢复',name_en:'',description:'Restoring of Oil cur-off power warn'},
      {de:139,hex:'0x8B',name_ch:'断油电告警断开',name_en:'',description:'Powering off Oil cur-off power warn'},
      {de:141,hex:'0x8D',name_ch:'运输模式切换陆运报警',name_en:'',description:'Switching the mode of the land transportation warn'},
      {de:142,hex:'0x8E',name_ch:'环境异常报警',name_en:'',description:'Abnormal circumstance warning'},
      {de:149,hex:'0x95',name_ch:'运输模式切换海运报警',name_en:'',description:'Switching the mode of the sea transportation warn'},
      {de:150,hex:'0x96',name_ch:'运输模式切换静置报警',name_en:'',description:'Switching the mode of the static warn'},
      {de:140,hex:'0x8C',name_ch:'疲劳驾驶',name_en:'',description:'Fatigue driving'},
      {de:151,hex:'0x97',name_ch:'接打电话',name_en:'',description:'The driver Uses phone when driving the car'},
      {de:154,hex:'0x9A',name_ch:'抽烟',name_en:'',description:'Driver Smoking'},
      {de:143,hex:'0x8F',name_ch:'分神驾驶',name_en:'',description:'No concentration on driving for driver'},
      {de:148,hex:'0x94',name_ch:'驾驶员异常',name_en:'',description:'Abnormal behavior of driver'},
      {de:152,hex:'0x98',name_ch:'主动抓拍',name_en:'',description:'Camera Activly Captures images'},
      {de:153,hex:'0x99',name_ch:'驾驶员变更',name_en:'',description:'Driver Change'},
      {de:1000,hex:'',name_ch:'Offline alert',name_en:'',description:'Idicate device has been offline over than preset time.'},
      {de:1001,hex:'',name_ch:'Parking alert',name_en:'',description:'When car acc is OFF and car keep static over that park threhold time, parking alert will be triggered.'},
      {de:1002,hex:'',name_ch:'Idling laert',name_en:'',description:'When car acc is ON but speed is lower than idling threhold value, idling alert will be triggered.'},
    ]
    return res.json({result:HexAndDexVal});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({message:'Something went wrong.'});
  }
}
let getAlertDetailReport = async (req, res) => {
  try {
    let result = [];
    const { phone, role} = req.user;
    const { startdate,enddate,agent,imei,type,history_tag} = req.body;
    const vehicles = await vehicle_model.deviceAll(phone,role);
    //------filter part----------
    let v_arr = [];
    //filter by agent
    if(role=='super'||role=='admin'){
      if(agent!='all') v_arr = core_func.filter_array(vehicles,'agent_id',agent)
      else v_arr = vehicles
    }else{
      v_arr = vehicles
    }
    //filter by imei
    if(imei){
      let i_a = [];
      const item = JSON.parse(JSON.stringify(v_arr));
      for(let i = 0; i < imei.length; i++){
        const get_i = core_func.filter_array(item,'device_imei',imei[i]);
        i_a=i_a.concat(get_i);
      }
      v_arr = i_a;
    }
    //get result
    const item = await model.getListByDate(startdate,enddate);
    for(let k = 0; k < v_arr.length;k++){
      const li = JSON.parse(JSON.stringify(v_arr[k]));//license,device_imei,model,
      const f_data = core_func.filter_array(item,'imei',li['device_imei']);
      for(let i =0 ; i < f_data.length; i++){
        if(type.length>0){
          const existInType = core_func.filter_array(type,'de',f_data[i]['alertType']);
          if(existInType.length==0) continue;
        }
        const data = JSON.parse(JSON.stringify(f_data[i]));
        data.postTime = core_func.strftime(data.postTime);
        data.alertTypeName = getAlertType(data.alertType).name_ch;
        data.description = getAlertType(data.alertType).description;
        result.push(data)
      }
    }
    return res.json({result:result});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({message:'Something went wrong.'});
  }
}
let getDrivingbehaviourReport = async (req, res) => {
  try {
    let result = [];
    const { phone, role} = req.user;
    const { startdate,enddate,agent,imei,type,history_tag} = req.body;
    const vehicles = await vehicle_model.deviceAll(phone,role);
    //------filter part----------
    let v_arr = [];
    //filter by agent
    if(role=='super'||role=='admin'){
      if(agent!='all') v_arr = core_func.filter_array(vehicles,'agent_id',agent)
      else v_arr = vehicles
    }else{
      v_arr = vehicles
    }
    //filter by imei
    if(imei){
      let i_a = [];
      const item = JSON.parse(JSON.stringify(v_arr));
      for(let i = 0; i < imei.length; i++){
        const get_i = core_func.filter_array(item,'device_imei',imei[i]);
        i_a=i_a.concat(get_i);
      }
      v_arr = i_a;
    }
    else{
      v_arr = [];
    }
    //related behaviour type
    let typeBE = type.length==0?getDrivceBeType():type;
    let addr = "";
    //get result
    const item = await model.getListByDate(startdate,enddate);
    for(let k = 0; k < v_arr.length;k++){
      const li = JSON.parse(JSON.stringify(v_arr[k]));//license,device_imei,model,
      const f_data = core_func.filter_array(item,'imei',li['device_imei']);
      for(let i =0 ; i < f_data.length; i++){
        if(typeBE.length>0){
          const existInType = core_func.filter_array(typeBE,'de',f_data[i]['alertType']);
          console.log([existInType,f_data[i]['alertType']])
          if(existInType.length==0) continue;
        }
        const data = JSON.parse(JSON.stringify(f_data[i]));
        if(data.msg){
          const {lat,lng} = JSON.parse(data.msg); 
          addr = real_mode?await getReverseInfo(lat,lng):'';
        }else addr = "";
        data.postTime = core_func.strftime(data.postTime);
        data.alertTypeName = getAlertType(data.alertType).name_ch;
        data.description = getAlertType(data.alertType).description;
        data.alertAddress = addr;
        result.push(data)
      }
    }
    return res.json({result:result});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({message:'Something went wrong.'});
  }
}
let getTypeOfDrive = async (req, res) => {
  try {
    const HexAndDexVal = [
      {de:144,hex:'0x90',name_ch:'急加速',name_en:'',description:'Rapid acceleration'},
      {de:145,hex:'0x91',name_ch:'急减速',name_en:'',description:'Rapid deceleration'},
      {de:146,hex:'0x92',name_ch:'急转弯',name_en:'',description:'Sharp turn of vehicle'},
      {de:147,hex:'0x93',name_ch:'撞车报警',name_en:'',description:'Launching warn because of collision'},
      {de:140,hex:'0x8C',name_ch:'疲劳驾驶',name_en:'',description:'Fatigue driving'},
      {de:151,hex:'0x97',name_ch:'接打电话',name_en:'',description:'The driver Uses phone when driving the car'},
      {de:154,hex:'0x9A',name_ch:'抽烟',name_en:'',description:'Driver Smoking'},
      {de:143,hex:'0x8F',name_ch:'分神驾驶',name_en:'',description:'No concentration on driving for driver'},
      {de:148,hex:'0x94',name_ch:'驾驶员异常',name_en:'',description:'Abnormal behavior of driver'},
    ]
    return res.json({result:HexAndDexVal});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({message:'Something went wrong.'});
  }
}
//functions
let getMessageType = (id)=>{
  if(id==0) return "Device Offline";
  if(id==1) return "Due soon";
  if(id==2) return "Device Expired";
  return '';
}
let getMessageContent = (id)=>{
  if(id==0) return "Device is offline.";
  if(id==1) return "Device will be expired soon.";
  if(id==2) return "Device is expired.";
  return '';
}
function existInArray(imei,data){
  for(let i = 0 ; i < data.length; i++){
    if(data[i]['device_imei']==imei) return i;
  }
  return false;
}
let getAlertType = (val)=>{
  const HexAndDexVal = [
    {de:128,hex:'0x80',name_ch:'后视镜振动报警',name_en:'',description:'Launching the function of vibration warn on rearview mirror'},
    {de:129,hex:'0x81',name_ch:'后视镜超流量报警',name_en:'',description:'Launching warn on rearview due to internet traffic usage exceeded the regular standard'},
    {de:130,hex:'0x82',name_ch:'设备重启',name_en:'',description:'Resetting device'},
    {de:132,hex:'0x84',name_ch:'1号摄象头不正常',name_en:'',description:'The camera of Num 1 goes wrong'},
    {de:133,hex:'0x85',name_ch:'2号摄象头不正常',name_en:'',description:'The camera of Num 2 goes wrong'},
    {de:134,hex:'0x86',name_ch:'SDK卡无法识别',name_en:'',description:'Being unable to identify SDK card'},
    {de:135,hex:'0x87',name_ch:'后视镜超速报警',name_en:'',description:'Launching warn on rearview once the car overspeeds'},
    {de:136,hex:'0x88',name_ch:'断电报警',name_en:'',description:'Launching Power alarm due to loss of power'},
    {de:137,hex:'0x89',name_ch:'无USB摄象头',name_en:'',description:'The camera without USB interface.'},
    {de:144,hex:'0x90',name_ch:'急加速',name_en:'',description:'Rapid acceleration'},
    {de:145,hex:'0x91',name_ch:'急减速',name_en:'',description:'Rapid deceleration'},
    {de:146,hex:'0x92',name_ch:'急转弯',name_en:'',description:'Sharp turn of vehicle'},
    {de:147,hex:'0x93',name_ch:'撞车报警',name_en:'',description:'Launching warn because of collision'},
    {de:138,hex:'0x8A',name_ch:'断油电告警恢复',name_en:'',description:'Restoring of Oil cur-off power warn'},
    {de:139,hex:'0x8B',name_ch:'断油电告警断开',name_en:'',description:'Powering off Oil cur-off power warn'},
    {de:141,hex:'0x8D',name_ch:'运输模式切换陆运报警',name_en:'',description:'Switching the mode of the land transportation warn'},
    {de:142,hex:'0x8E',name_ch:'环境异常报警',name_en:'',description:'Abnormal circumstance warning'},
    {de:149,hex:'0x95',name_ch:'运输模式切换海运报警',name_en:'',description:'Switching the mode of the sea transportation warn'},
    {de:150,hex:'0x96',name_ch:'运输模式切换静置报警',name_en:'',description:'Switching the mode of the static warn'},
    {de:140,hex:'0x8C',name_ch:'疲劳驾驶',name_en:'',description:'Fatigue driving'},
    {de:151,hex:'0x97',name_ch:'接打电话',name_en:'',description:'The driver Uses phone when driving the car'},
    {de:154,hex:'0x9A',name_ch:'抽烟',name_en:'',description:'Driver Smoking'},
    {de:143,hex:'0x8F',name_ch:'分神驾驶',name_en:'',description:'No concentration on driving for driver'},
    {de:148,hex:'0x94',name_ch:'驾驶员异常',name_en:'',description:'Abnormal behavior of driver'},
    {de:152,hex:'0x98',name_ch:'主动抓拍',name_en:'',description:'Camera Activly Captures images'},
    {de:153,hex:'0x99',name_ch:'驾驶员变更',name_en:'',description:'Driver Change'},
    {de:1000,hex:'',name_ch:'Offline alert',name_en:'',description:'Idicate device has been offline over than preset time.'},
    {de:1001,hex:'',name_ch:'Parking alert',name_en:'',description:'When car acc is OFF and car keep static over that park threhold time, parking alert will be triggered.'},
    {de:1002,hex:'',name_ch:'Idling laert',name_en:'',description:'When car acc is ON but speed is lower than idling threhold value, idling alert will be triggered.'},
  ]
  for(let i = 0; i < HexAndDexVal.length; i++){
    if(HexAndDexVal[i].de == val) return HexAndDexVal[i];
  }
  return{de:2000,hex:'',name_ch:'ICCID',name_en:'',description:'Card alert'};
}
let getDrivceBeType = (val)=>{
  const HexAndDexVal = [
    {de:144,hex:'0x90',name_ch:'急加速',name_en:'',description:'Rapid acceleration'},
    {de:145,hex:'0x91',name_ch:'急减速',name_en:'',description:'Rapid deceleration'},
    {de:146,hex:'0x92',name_ch:'急转弯',name_en:'',description:'Sharp turn of vehicle'},
    {de:147,hex:'0x93',name_ch:'撞车报警',name_en:'',description:'Launching warn because of collision'},
    {de:140,hex:'0x8C',name_ch:'疲劳驾驶',name_en:'',description:'Fatigue driving'},
    {de:151,hex:'0x97',name_ch:'接打电话',name_en:'',description:'The driver Uses phone when driving the car'},
    {de:154,hex:'0x9A',name_ch:'抽烟',name_en:'',description:'Driver Smoking'},
    {de:143,hex:'0x8F',name_ch:'分神驾驶',name_en:'',description:'No concentration on driving for driver'},
    {de:148,hex:'0x94',name_ch:'驾驶员异常',name_en:'',description:'Abnormal behavior of driver'},
  ]
  return HexAndDexVal;
}
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
module.exports = {
  push,
  getAlert,
  getMessage,
  readAlert,
  readMessage,
  remark,
  editBasicSetting,
  getBasicSetting,
  getAlertReport,
  getTypeForAlertReport,
  getAlertDetailReport,
  getDrivingbehaviourReport,
  getTypeOfDrive,
}
