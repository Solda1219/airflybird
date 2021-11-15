const vehicle_model = require('../model/vehicle');
const video_model = require('../model/video');
const gps_model = require('../model/gps');
const heartbeat_model = require('../model/heartbeat');
const axios = require('axios');
const core_func = require('../utils/core_func');
const AdmZip = require('adm-zip');
const path = require('path');
const agent_model = require('../model/agent');
const model = require('../model/report');
const real_mode = true;
let tripreport = async (req, res) => {
  try {
    let result = [];
    let v_arr = [];
    let date_arr = [];
    const { phone, role} = req.user;
    const { dateDefine,startdate,enddate,agent,mode,imei,history_tag} = req.body;
    // console.log([dateDefine,startdate,enddate,agent,mode,imei,history_tag])
    const vehicles = await vehicle_model.deviceAll(phone,role);
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
    //get start and end date array
    if(mode=='overview'){
      date_arr.push({from:startdate,to:enddate})
    }else{
      date_arr = core_func.splite_days(new Date(startdate), new Date(enddate))
    }
    // console.log(date_arr)
    //get trip result
    for(let i = 0; i < date_arr.length; i++){
      const {from,to} = date_arr[i];
      const tripdata = await gps_model.getAll(from,to,history_tag);
      for(let k = 0; k < v_arr.length;k++){
        const li = JSON.parse(JSON.stringify(v_arr[k]));//license,device_imei,model,
        const f_data = core_func.filter_array(tripdata,'imei',li['device_imei']);
        const totalMile = core_func.calcTotalMile(f_data);
        li.total_mile = totalMile<100?Math.floor(totalMile*1000)/1000:Math.floor(totalMile*10)/10;
        const travelTime = core_func.calcTravelTime(f_data);
        li.travel_time = core_func.timeDeltaToDate(travelTime);
        li.avg_speed = Math.floor(core_func.calcAvgSpeed(f_data)*100)/100;
        li.max_speed = core_func.maxSpeed(f_data);
        li.start_point = from;
        li.end_point = to;
        if(f_data.length>0){
          result.push(li)
          // console.log([li['device_imei'],li.total_mile,li.travel_time,li.avg_speed,li.max_speed])
        }
      }
    }
    // console.log(result);
    return res.status(200).json({ result: result});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let violationreport = async (req, res) => {
  try {
    let result = [];
    const { phone, role} = req.user;
    const { startdate,enddate,vehicle,camera,type,history_tag,download} = req.body;
    const violation_type = await video_model.getViolationType();
    const videoitem = await video_model.getAll(history_tag);
    //get data for date range
    const item = await video_model.getWrongDetectResultWithDateRangeForReport(startdate,enddate,history_tag);
    //array unique
    for(let i = 0; i < item.length; i++){
      const exist = exist_inarray(result,'group_name',item[i]['group_name']);
      item[i].type_name = getType(violation_type,item[i].type)
      item[i].datefulltime = item[i].datetime;
      item[i].datetime = core_func.gethhmmss(item[i].datetime)
      item[i].camera_id = getCameraId(videoitem,item[i].video_id)
      if(exist===false){
        item[i].image_number = 1;
        const data_l = JSON.parse(JSON.stringify(item[i]))
        item[i].child_item = [data_l];
        result.push(item[i])
      }else{
        result[exist].image_number++;
        const data_l = JSON.parse(JSON.stringify(item[i]))
        result[exist].child_item.push(data_l)
      }
    }
    //filter by download
    if(download == 1)
      result = result.filter(x=>x.downloaded>0)
    if(download == 2)
      result = result.filter(x=>x.downloaded==0||!x.downloaded)
    //filter by type
    if(type != 'all'){
      result = result.filter(x=>x.type==type)
    }    
    //filter by vehicle
    if(vehicle){
      const i_a = []
      for(let i = 0; i < vehicle.length; i++){
        for(let k = 0; k < result.length; k++){
           if(vehicle[i]==result[k].vehicle_number) i_a.push(result[k])
        }
      }
      result = i_a;
    }
    //filter by camera
    if(camera){
      const i_a = []
      for(let i = 0; i < camera.length; i++){
        for(let k = 0; k < result.length; k++){
            if(camera[i]==result[k].camera_id) i_a.push(result[k])
        }
      }
      result = i_a;
    }
    return res.status(200).json({ result: result});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let OverViewReport = async (req, res) => {
  try {
    let result = [];
    const { phone, role} = req.user;
    const { startdate,enddate,agent,imei,history_tag} = req.body;
    const vehicles = await vehicle_model.deviceAll(phone,role);
    const reportOverspeed = await model.getReportTypeOne('overspeed');
    const reportOverParking = await model.getReportTypeOne('parking');
    if(reportOverspeed==false||reportOverParking==false) return res.status(200).json({message:'Report type table is not correct.'});
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
    // const tripdata = await gps_model.getAll(startdate,enddate,history_tag);
    for(let k = 0; k < v_arr.length;k++){
      const li = JSON.parse(JSON.stringify(v_arr[k]));//license,device_imei,model,
      const f_data = await gps_model.getDataRangeByImei(startdate,enddate,li['device_imei'],history_tag);
      const totalMile = core_func.calcTotalMile(f_data);
      const totalOverSpeed = await extractOverSpeed(f_data,reportOverspeed.value,reportOverspeed.range,real_mode);
      const totalOverParking = await extractParking(f_data,reportOverParking.value,reportOverParking.range,real_mode);
      const itemToadd = {
        device_name:li.license_plate_number,
        imei:li.device_imei,
        model:li.model,
        total_mile:totalMile<100?Math.floor(totalMile*1000)/1000:Math.floor(totalMile*10)/10,
        overspeed:totalOverSpeed.length,
        stopover:totalOverParking.length,
      }    
      result.push(itemToadd)
    }
    // console.log(result);
    return res.status(200).json({ result: result});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let OverSpeedReport = async (req, res) => {
  try {
    let result = [];
    const { phone, role} = req.user;
    const { startdate,enddate,agent,imei,history_tag} = req.body;
    const vehicles = await vehicle_model.deviceAll(phone,role);
    const reportType = await model.getReportTypeOne('overspeed');
    const R_val = reportType?reportType.value:60;
    const R_range = reportType?reportType.range:1;
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
    // const tripdata = await gps_model.getAll(startdate,enddate,history_tag);
    for(let k = 0; k < v_arr.length;k++){
      const li = JSON.parse(JSON.stringify(v_arr[k]));//license,device_imei,model,
      const f_data = await gps_model.getDataRangeByImei(startdate,enddate,li['device_imei'],history_tag);
      const r_data = await extractOverSpeed(f_data,R_val,R_range,real_mode);
      for(let i = 0 ; i < r_data.length; i ++){
        r_data[i].device_name = li.license_plate_number;
        r_data[i].imei = li.device_imei;
        r_data[i].model = li.model;
        r_data[i].status = 'overspeed';
        result.push(r_data[i]);
      }
    }
    // console.log(result);
    return res.status(200).json({ result: result});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let ParkingReport = async (req, res) => {
  try {
    let result = [];
    const { phone, role} = req.user;
    const { startdate,enddate,agent,imei,history_tag} = req.body;
    const vehicles = await vehicle_model.deviceAll(phone,role);
    const reportType = await model.getReportTypeOne('parking');
    const R_val = reportType?reportType.value:0;
    const R_range = reportType?reportType.range:10;
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
    // const tripdata = await gps_model.getAll(startdate,enddate,history_tag);
    for(let k = 0; k < v_arr.length;k++){
      const li = JSON.parse(JSON.stringify(v_arr[k]));//license,device_imei,model,
      // const f_data = core_func.filter_array(tripdata,'imei',li['device_imei']);
      const f_data = await gps_model.getDataRangeByImei(startdate,enddate,li['device_imei'],history_tag);
      const r_data = await extractParking(f_data,R_val,R_range,real_mode);
      for(let i = 0 ; i < r_data.length; i ++){
        r_data[i].device_name = li.license_plate_number;
        r_data[i].imei = li.device_imei;
        r_data[i].model = li.model;
        r_data[i].status = 'parking';
        result.push(r_data[i]);
      }
    }
    // console.log(result);
    return res.status(200).json({ result: result});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let IdlingReport = async (req, res) => {
  try {
    let result = [];
    const { phone, role} = req.user;
    const { startdate,enddate,agent,imei,history_tag} = req.body;
    const vehicles = await vehicle_model.deviceAll(phone,role);
    const reportType = await model.getReportTypeOne('idling');
    const R_val = reportType?reportType.value:0;
    const R_range = reportType?reportType.range:10;
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
    // const tripdata = await gps_model.getAll(startdate,enddate,history_tag);
    for(let k = 0; k < v_arr.length;k++){
      const li = JSON.parse(JSON.stringify(v_arr[k]));//license,device_imei,model,
      // const f_data = core_func.filter_array(tripdata,'imei',li['device_imei']);
      const f_data = await gps_model.getDataRangeByImei(startdate,enddate,li['device_imei'],history_tag);
      const r_data = await extractIdling(f_data,R_val,R_range,real_mode);
      for(let i = 0 ; i < r_data.length; i ++){
        r_data[i].device_name = li.license_plate_number;
        r_data[i].imei = li.device_imei;
        r_data[i].model = li.model;
        r_data[i].status = 'idling';
        result.push(r_data[i]);
      }
    }
    // console.log(result);
    return res.status(200).json({ result: result});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let IgnitionReport = async (req, res) => {
  try {
    let result = [];
    const { phone, role} = req.user;
    const { startdate,enddate,agent,imei,history_tag} = req.body;
    const vehicles = await vehicle_model.deviceAll(phone,role);
    const reportType = await model.getReportTypeOne('ignition');
    const R_val = reportType?reportType.value:0;
    const R_range = reportType?reportType.range:10;
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
    // const tripdata = await gps_model.getAll(startdate,enddate,history_tag);
    for(let k = 0; k < v_arr.length;k++){
      const li = JSON.parse(JSON.stringify(v_arr[k]));//license,device_imei,model,
      // const f_data = core_func.filter_array(tripdata,'imei',li['device_imei']);
      const f_data = await gps_model.getDataRangeByImei(startdate,enddate,li['device_imei'],history_tag);
      const r_data = await extractIgnition(f_data,R_val,R_range,real_mode);
      for(let i = 0 ; i < r_data.length; i ++){
        r_data[i].device_name = li.license_plate_number;
        r_data[i].imei = li.device_imei;
        r_data[i].model = li.model;
        r_data[i].status = 'Ignition';
        result.push(r_data[i]);
      }
    }
    // console.log(result);
    return res.status(200).json({ result: result});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let OnlineReport = async (req, res) => {
  try {
    let result = [];
    const { phone, role} = req.user;
    const { startdate,enddate,agent,imei,history_tag} = req.body;
    const vehicles = await vehicle_model.deviceAll(phone,role);
    const reportType = await model.getReportTypeOne('offline');
    const R_val = reportType?reportType.value:0;
    const R_range = reportType?reportType.range:1;
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
    const dataitem = await heartbeat_model.getRange(startdate,enddate);
    for(let k = 0; k < v_arr.length;k++){
      const li = JSON.parse(JSON.stringify(v_arr[k]));//license,device_imei,model,
      const f_data = core_func.filter_array(dataitem,'imei',li['device_imei']);
      const r_data = await extractOnline(f_data,R_val,R_range,real_mode);
      for(let i = 0 ; i < r_data.length; i ++){
        r_data[i].device_name = li.license_plate_number;
        r_data[i].imei = li.device_imei;
        r_data[i].model = li.model;
        r_data[i].status = 'online';
        result.push(r_data[i]);
      }
    }
    // console.log(result);
    return res.status(200).json({ result: result});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let OfflineReport = async (req, res) => {
  try {
    let result = [];
    const { phone, role} = req.user;
    const { startdate,enddate,agent,imei,history_tag} = req.body;
    const vehicles = await vehicle_model.deviceAll(phone,role);
    const reportType = await model.getReportTypeOne('offline');
    const R_val = reportType?reportType.value:0;
    const R_range = reportType?reportType.range:1;
    const end_dateTime = new Date(enddate).getTime()>new Date().getTime()?core_func.strftime(Date.now()):enddate;
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
    const dataitem = await heartbeat_model.getRange(startdate,end_dateTime);
    for(let k = 0; k < v_arr.length;k++){
      const li = JSON.parse(JSON.stringify(v_arr[k]));//license,device_imei,model,
      const f_data = core_func.filter_array(dataitem,'imei',li['device_imei']);
      const r_data = await extractOffline(li['device_imei'],f_data,startdate,end_dateTime,R_val,R_range,real_mode);
      for(let i = 0 ; i < r_data.length; i ++){
        r_data[i].device_name = li.license_plate_number;
        r_data[i].imei = li.device_imei;
        r_data[i].model = li.model;
        r_data[i].status = 'offline';
        result.push(r_data[i]);
      }
    }
    // console.log(result);
    return res.status(200).json({ result: result});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let getViolationType = async (req, res) => {
  try {
    const violation_type = await video_model.getViolationType();
    return res.status(200).json({result: violation_type});
  } catch (err) {
    return res.status(400).json({message: 'something went wrong' });
  }
}
let copydownloadurl = async (req, res) => {
  try {
    const data = req.body;
    // creating archives
    let zip = new AdmZip();
    const zip_name = 'violation_trip_'+new Date().getTime();
    // add file directly
    // var content = "inner content of the file";
    // zip.addFile("test.txt", Buffer.alloc(content.length, content), "entry comment goes here");
    // add local file
    for(let i = 0 ; i < data.length; i++){
      for(let k = 0; k < data[i].child_item.length; k++){
        const li = data[i].child_item[k];
        const group_name = data[i].group_name;
        const path_local = path.join(`${__dirname}/../../${li.image_url}`);
        const folder_name = group_name;
        const file_name = group_name+'-'+(k+1)+li.image_url.substring(li.image_url.lastIndexOf('.'));
        zip.addLocalFile(path_local,folder_name,file_name);
      }
    }
    // update file headers
    zip.getEntries().forEach(entry => {
      entry.header.flags |= 0x0800;                                          // Set bit 11 - APP Note 4.4.4 Language encoding flag (EFS)
    });
    // or write everything to disk
    zip.writeZip(path.join(`${__dirname}/../../_public/download/${zip_name}.zip`));
    return res.status(200).json({ name: `www.aidetecting.com/_public/download/${zip_name}.zip`});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let recorddownload = async (req, res) => {
  try {
    const {data,op_id,op_name,history_tag} = req.body;
    const {id,role} = req.user;
    const user_info = await agent_model.getUserInfo(id,role);
    for(let i = 0 ; i < data.length; i++){
       const dataitem={
         op_id:op_id,
         op_name:op_name,
         group_time:data[i].group_time,
         group_name:data[i].group_name,
         user_id:id,
         user_role:role,
         user_name:user_info.name,
         user_phone:user_info.phone,
         downloaded:1,
         created_at:core_func.strftime(Date.now()),
       }
       await video_model.record_wrongdetect_download(dataitem,history_tag);
    }
    return res.status(200).json({ message: 'success'});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let getrecorddownload = async (req, res) => {
  try {
    const {data,history_tag} = req.body; 
    const {id,role} = req.user;
    const item = await video_model.getDownloadedRecordOfViolation(id,role,data.group_name);
    for(let i = 0; i < item.length; i++){
      item[i].created_at = core_func.strftime(item[i].created_at)
    }
    return res.status(200).json({ result: item});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
//functions
const extractOverSpeed = async (gpsData,Rval,Rrange,tag=true) => {
  const data = JSON.parse(JSON.stringify(gpsData));
  const item = [];
  let checked = [];
  for(let i = 0 ; i < data.length; i++){
    const {acc,gpsTime,gpsSpeed,lat,lng} = data[i];
    if(Number(gpsSpeed)>Rval&&i<(data.length-1)){
      checked.push(data[i]);
    }
    else{
      if(checked.length<1){
        checked = [];
        continue;
      }
      if(Number(gpsSpeed)>Rval) checked.push(data[i])
      const first = checked[0];
      const last = checked[checked.length-1];
      if(!first.gpsTime||!last.gpsTime){
        checked = [];
        continue;
      }
      const DateDelta = (new Date(last.gpsTime).getTime() - new Date(first.gpsTime).getTime())/(1000*60);
      if(DateDelta>Rrange){
        const s_addr = tag?await getReverseInfo(first.lat,first.lng):'';
        const e_addr = tag?await getReverseInfo(last.lat,last.lng):'';
        const preparedData = {
          start_time:core_func.strftime(first.gpsTime),
          end_time:core_func.strftime(last.gpsTime),
          start_address:s_addr,
          end_address:e_addr,
          duration:core_func.timeDeltaToDate(DateDelta*60*1000),
        }
        item.push(JSON.parse(JSON.stringify(preparedData)));
      }
      checked = [];
    }
  }
  return item;
}
const extractParking = async (gpsData,Rval,Rrange,tag=true) => {
  const data = JSON.parse(JSON.stringify(gpsData));
  const item = [];
  let checked = [];
  for(let i = 0 ; i < data.length; i++){
    const {acc,gpsTime,gpsSpeed,lat,lng} = data[i];
    if(acc==0&&i<(data.length-1)){
      checked.push(data[i]);
    }
    else{
      if(checked.length<1){
        checked = [];
        continue;
      }
      if(acc==0) checked.push(data[i])
      const first = checked[0];
      const last = checked[checked.length-1];
      if(!first.gpsTime||!last.gpsTime){
        checked = [];
        continue;
      }
      const DateDelta = (new Date(last.gpsTime).getTime() - new Date(first.gpsTime).getTime())/(1000*60);
      if(DateDelta>Rrange){
        const s_addr = tag?await getReverseInfo(first.lat,first.lng):'';
        const e_addr = tag?await getReverseInfo(last.lat,last.lng):'';
        const preparedData = {
          start_time:core_func.strftime(first.gpsTime),
          end_time:core_func.strftime(last.gpsTime),
          start_address:s_addr,
          end_address:e_addr,
          duration:core_func.timeDeltaToDate(DateDelta*60*1000),
        }
        item.push(JSON.parse(JSON.stringify(preparedData)));
      }
      checked = [];
    }
  }
  return item;
}
const extractIdling = async (gpsData,Rval,Rrange,tag=true) => {
  const data = JSON.parse(JSON.stringify(gpsData));
  const item = [];
  let checked = [];
  for(let i = 0 ; i < data.length; i++){
    const {acc,gpsTime,gpsSpeed,lat,lng} = data[i];
    if((Number(gpsSpeed)<=0&&acc==1)&&i<(data.length-1)){
      checked.push(data[i]);
    }
    else{
      if(Number(gpsSpeed)<=0&&acc==1) checked.push(data[i])
      if(checked.length<1){
        checked = [];
        continue;
      }
      const first = checked[0];
      const last = checked[checked.length-1];
      if(!first.gpsTime||!last.gpsTime){
        checked = [];
        continue;
      }
      const DateDelta = (new Date(last.gpsTime).getTime() - new Date(first.gpsTime).getTime())/(1000*60);
      if(DateDelta>Rrange){
        const s_addr = tag?await getReverseInfo(first.lat,first.lng):'';
        const e_addr = tag?await getReverseInfo(last.lat,last.lng):'';
        const preparedData = {
          start_time:core_func.strftime(first.gpsTime),
          end_time:core_func.strftime(last.gpsTime),
          start_address:s_addr,
          end_address:e_addr,
          duration:core_func.timeDeltaToDate(DateDelta*60*1000),
        }
        item.push(JSON.parse(JSON.stringify(preparedData)));
      }
      checked = [];
    }
  }
  return item;
}
const extractIgnition = async (gpsData,Rval,Rrange,tag=true) => {
  const data = JSON.parse(JSON.stringify(gpsData));
  const item = [];
  let checked = [];
  for(let i = 0 ; i < data.length; i++){
    const {acc,gpsTime,gpsSpeed,lat,lng} = data[i];
    if(acc==1&&i<(data.length-1)){
      if(i<20) console.log([gpsSpeed,gpsTime])
      checked.push(data[i]);
    }
    else{
      if(acc==1) checked.push(data[i])
      if(checked.length<1){
        checked = [];
        continue;
      }
      const first = checked[0];
      const last = checked[checked.length-1];
      if(!first.gpsTime||!last.gpsTime){
        checked = [];
        continue;
      }
      const DateDelta = (new Date(last.gpsTime).getTime() - new Date(first.gpsTime).getTime())/(1000*60);
      if(DateDelta>Rrange){
        const s_addr = tag?await getReverseInfo(first.lat,first.lng):'';
        const e_addr = tag?await getReverseInfo(last.lat,last.lng):'';
        const preparedData = {
          start_time:core_func.strftime(first.gpsTime),
          end_time:core_func.strftime(last.gpsTime),
          start_address:s_addr,
          end_address:e_addr,
          duration:core_func.timeDeltaToDate(DateDelta*60*1000),
        }
        item.push(JSON.parse(JSON.stringify(preparedData)));
      }
      checked = [];
    }
  }
  return item;
}
const extractIgnition1 = async (gpsData,Rval,Rrange,tag=true) => {
  const data = JSON.parse(JSON.stringify(gpsData));
  const item = [];
  let checked = [];
  let startStatus = -1;
  for(let i = 0 ; i < data.length; i++){
    const {acc,gpsTime,gpsSpeed,lat,lng} = data[i];
    if(startStatus==-1){
      startStatus = acc;
    }
    if((acc==startStatus)&&i<(data.length-1)){
      checked.push(data[i]);
    }
    else{
      if(checked.length<1){
        checked = [];
        continue;
      }
      if(acc==startStatus) checked.push(data[i]);
      const first = checked[0];
      const last = checked[checked.length-1];
      if(!first.gpsTime||!last.gpsTime){
        checked = [];
        continue;
      }
      const DateDelta = (new Date(last.gpsTime).getTime() - new Date(first.gpsTime).getTime())/(1000*60);
      if(DateDelta>Rrange){
        const s_addr = tag?await getReverseInfo(first.lat,first.lng):'';
        const e_addr = tag?await getReverseInfo(last.lat,last.lng):'';
        const preparedData = {
          start_time:core_func.strftime(first.gpsTime),
          end_time:core_func.strftime(last.gpsTime),
          status:startStatus=='0'?'OFF':'ON',
          start_address:s_addr,
          end_address:e_addr,
          duration:core_func.timeDeltaToDate(DateDelta*60*1000),
        }
        item.push(JSON.parse(JSON.stringify(preparedData)));
      }
      checked = [];
      startStatus = -1;
      i--;
    }
  }
  return item;
}
const extractOnline = async (Data,Rval,Rrange,tag=true) => {
  const data = JSON.parse(JSON.stringify(Data));
  let checked = [];
  const item = [];
  for(let i = 0 ; i < data.length; i++){
    checked.push(data[i]);
    if(checked.length<3) continue;
    const sTime = checked[0].time;
    const first = checked[checked.length-2].time;
    const last = checked[checked.length-1].time;
    const DateDelta = (new Date(last).getTime() - new Date(first).getTime())/(1000*60);
    if(DateDelta>Rrange){
      // const s_addr = tag?await getReverseInfo(first.lat,first.lng):'';
      // const e_addr = tag?await getReverseInfo(last.lat,last.lng):'';
      const Delta = (new Date(first).getTime() - new Date(sTime).getTime())/(1000*60);
      const preparedData = {
        start_time:core_func.strftime(sTime),
        end_time:core_func.strftime(first),
        duration:core_func.timeDeltaToDate(Delta*60*1000),
      }
      item.push(JSON.parse(JSON.stringify(preparedData)));
      checked = [];
      i--;
    }
    else if(i==(data.length-1)){
      // const s_addr = tag?await getReverseInfo(first.lat,first.lng):'';
      // const e_addr = tag?await getReverseInfo(last.lat,last.lng):'';
      const Delta = (new Date(last).getTime() - new Date(sTime).getTime())/(1000*60);
      const preparedData = {
        start_time:core_func.strftime(sTime),
        end_time:core_func.strftime(last),
        duration:core_func.timeDeltaToDate(Delta*60*1000),
      }
      item.push(JSON.parse(JSON.stringify(preparedData)));
      checked = [];
      i--;
    }
  }
  return item;
}
const extractOffline = async (imei,Data,start_time,end_time,Rval,Rrange,tag=true) => {
  const onlineData = await extractOnline(Data,Rval,Rrange,tag);
  const item = [];
  let C_start = start_time;
  for(let i = 0 ; i < onlineData.length; i++){
    const C_end = onlineData[i].start_time;
    const DateDelta = (new Date(C_end).getTime() - new Date(C_start).getTime())/(1000*60);
    if(DateDelta>Rrange){
      const gpsLastData = await gps_model.getLastExistedData(core_func.strftime(C_start),imei)
      const s_addr = tag&&gpsLastData!==false?await getReverseInfo(gpsLastData.lat,gpsLastData.lng):'';
      const preparedData = {
        start_address:s_addr,
        start_time:core_func.strftime(C_start),
        end_time:core_func.strftime(C_end),
        duration:core_func.timeDeltaToDate(DateDelta*60*1000),
      }
      item.push(JSON.parse(JSON.stringify(preparedData)));
      C_start = onlineData[i].end_time
    }
  }
  const C_lastedstart = onlineData.length>0?onlineData[onlineData.length-1].end_time:start_time;
  const C_lastedend = end_time;
  const DateDelta = (new Date(C_lastedend).getTime() - new Date(C_lastedstart).getTime())/(1000*60);
  if(DateDelta>Rrange){
    const gpsLastData = await gps_model.getLastExistedData(core_func.strftime(C_lastedstart),imei)
    const s_addr = tag&&gpsLastData!==false?await getReverseInfo(gpsLastData.lat,gpsLastData.lng):'';
    const preparedData = {
      start_address:s_addr,
      start_time:core_func.strftime(C_lastedstart),
      end_time:core_func.strftime(C_lastedend),
      duration:core_func.timeDeltaToDate(DateDelta*60*1000),
    }
    item.push(JSON.parse(JSON.stringify(preparedData)));
  }
  return item;
}

const exist_inarray = (arr,key,value)=>{
  for(let i = 0; i< arr.length; i++){
    if(arr[i][key]==value) return i
  }
  return false;
}
const getType = (arr,id) => {
  for(let i =0 ; i < arr.length; i++){
    if(arr[i].id == id) return arr[i].type;
  }
  return '';
}
const getCameraId = (arr,video_id) => {
  for(let i =0 ; i < arr.length; i++){
    if(arr[i].id == video_id) return arr[i].camera_id;
  }
  return '';
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
  tripreport,
  violationreport,
  OverSpeedReport,
  ParkingReport,
  IdlingReport,
  IgnitionReport,
  OnlineReport,
  OfflineReport,
  getViolationType,
  copydownloadurl,
  recorddownload,
  getrecorddownload,
  OverViewReport,
}
