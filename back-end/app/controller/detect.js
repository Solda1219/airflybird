const vehicle_model = require('../model/vehicle')
const video_model = require('../model/video')
const gpu_model = require('../model/gpu')
const agent_model = require('../model/agent')
const app_status_model = require('../model/app_status')
const cf = require('../utils/core_func')
const axios = require('axios');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const core_func = require('../utils/core_func');
const camera = require('../model/camera')
ffmpeg.setFfmpegPath(ffmpegPath);
let getstatus = async (req, res) => {
  try {
    let result = [];
    let info = {
      uploaded:0,
      downloaded:0,
      detected:0,
    };
    const { phone, role} = req.user;
    const { filter,startdate,enddate,gpu,history_tag} = req.body;
    const video = await video_model.getstatus(startdate,enddate,history_tag);
    const vehicles = await vehicle_model.deviceAll(phone,role);
    for (let c = 0; c < video.length; c++) {
      const video_c = video[c];
      //filter
      if(filter == 1 && video_c.status!=3) continue;
      else if(filter == 2 && video_c.status!=1) continue;
      else if(filter == 3 && video_c.detect_status!=1) continue;
      else if(filter == 4 && video_c.detect_status!=2) continue;
      //get vehicle
      const li = getValueFromArray(vehicles,'camera_id',video_c.camera_id)
      if(li===false) continue;
      if(gpu!=0 && li.gpu_id != gpu) continue;
      info.uploaded++;
      if(video_c.status == 3) info.downloaded++;
      if(video_c.detect_status == 2) info.detected++;
      // const wrong_result = await video_model.getWrongDetectResult(video_c.id) 
      // if(wrong_result.length==0) continue
      video_c.license_plate_number = li.license_plate_number;
      video_c.agent_id = li.agent_id;
      video_c.vehicle_id = li.id;
      video_c.agent_name = li.agent_name;
      video_c.gpu = li.gpu;
      video_c.video_size = cf.formatBytes(video_c.video_size);
      video_c.start_date_time = video_c.start_at?cf.strftime(video_c.start_at,'YYYY-mm-dd hh:mm:ss'):'';
      video_c.video_duration = cf.timeDeltaToDate(new Date(video_c.end_at).getTime()-new Date(video_c.start_at).getTime());
      video_c.new_video_size = cf.formatBytes(video_c.file_size);
      video_c.new_video_duration = cf.timeDeltaToDate(video_c.frame_count/video_c.fps*1000);
      video_c.downloaded_time = video_c.downloaded_time?cf.strftime(video_c.downloaded_time,'YYYY-mm-dd hh:mm:ss'):'';
      video_c.detect_duration = video_c.detected_end_time&&video_c.detected_start_time?cf.timeDeltaToDate(new Date(video_c.detected_end_time).getTime()-new Date(video_c.detected_start_time).getTime()):'';
      //get wrong detect_result status
      video_c.wrong_detect_result_info = video_c.detected_frame_count >0?''+video_c.wrong_detected_count+'/'+video_c.detected_frame_count:'no detected';
      video_c.wrong_detect_result_percent = video_c.detected_frame_count >0?video_c.wrong_detected_count/video_c.detected_frame_count*100:-1;
      result.push(video_c);
    }
    return res.status(200).json({ result: result , info:info});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
} 
let appstatus = async (req, res) => {
  try {
    const status_item = await app_status_model.getter();
    const today_start = core_func.strftime(new Date().setHours(0,0,0,1));
    const today_video = await video_model.getTodayVideo(today_start);
    for(let i = 0; i < status_item.length; i++){
      const {started_at,status} = status_item[i];
      const delta = new Date().getTime() - new Date(started_at).getTime();
      status_item[i].running_time = core_func.timeDeltaToDate(delta);
      status_item[i].started_at = core_func.strftime(started_at,'YYYY-mm-dd hh:mm:ss');
      if(status_item[i].name=='Video transfer app'){
        status_item[i].uploaded = today_video.length;
      }
    }
    const gpuList = await gpu_model.getter();
    for(let i = 0 ; i < gpuList.length; i++){
      const gpuStatus = [];
      const { id } = gpuList[i]; 
      const download_status = await app_status_model.download_status(id);
      if(download_status) {
        const li = {};
        const {datetime,status} = download_status;
        const delta = new Date().getTime() - new Date(datetime).getTime();
        li.name = "Download App Status"
        li.running_time = core_func.timeDeltaToDate(delta);
        li.started_at = core_func.strftime(datetime,'YYYY-mm-dd hh:mm:ss');
        const timeDelta = new Date().getTime() - new Date(li.started_at).getTime();
        li.status = Math.abs(timeDelta)<300000?status:0;
        gpuStatus.push(li)
      }else{
        const li = {};
        li.name = "Download App Status"
        li.running_time = "--:--:--";
        li.started_at = "--:--:--"
        li.status = 0;
        gpuStatus.push(li)
      }
      const detect_status = await app_status_model.detect_status(id);
      if(detect_status) {
        const li = {};
        const {datetime,status} = detect_status;
        const delta = new Date().getTime() - new Date(datetime).getTime();
        li.name = "Detect App Status"
        li.running_time = core_func.timeDeltaToDate(delta);
        li.started_at = core_func.strftime(datetime,'YYYY-mm-dd hh:mm:ss');
        const timeDelta = new Date().getTime() - new Date(li.started_at).getTime();
        li.status = Math.abs(timeDelta)<300000?status:0;
        gpuStatus.push(li)
      }else{
        const li = {};
        li.name = "Detect App Status"
        li.running_time = "--:--:--";
        li.started_at = "--:--:--"
        li.status = 0;
        gpuStatus.push(li)
      }
      const upload_status = await app_status_model.upload_status(id);
      if(upload_status) {
        const li = {};
        const {datetime,status} = upload_status;
        const delta = new Date().getTime() - new Date(datetime).getTime();
        li.name = "Upload App Status"
        li.running_time = core_func.timeDeltaToDate(delta);
        li.started_at = core_func.strftime(datetime,'YYYY-mm-dd hh:mm:ss');
        const timeDelta = new Date().getTime() - new Date(li.started_at).getTime();
        li.status = Math.abs(timeDelta)<300000?status:0;
        gpuStatus.push(li)
      }else{
        const li = {};
        li.name = "Upload App Status"
        li.running_time = "--:--:--";
        li.started_at = "--:--:--"
        li.status = 0;
        gpuStatus.push(li)
      }
      gpuList[i].app_status = gpuStatus;
    }
    return res.status(200).json({result:status_item,gpu:gpuList})
  } catch (err) {
    return res.status(400).json({ message: 'something went wrong' });
  }
}
//for detection review page
let getvod = async (req, res) => {
  try {
    const { phone, role} = req.user;
    const { checked, start, end, history_tag} = req.body;
    const video = await video_model.getdetectedvideo(start,end,history_tag);
    const vehicles = await vehicle_model.deviceAll(phone,role);
    let result = [];
    for (let i = 0; i < video.length; i++) {
      const video_c = video[i];
      const li = getValueFromArray(vehicles,'camera_id',video_c.camera_id);
      if(li===false) continue;
      video_c.carNumber = li.license_plate_number;
      video_c.agent_id = li.agent_id;
      video_c.vehicle_id = li.id;
      video_c.agent_name = li.agent_name;
      video_c.video_date = cf.strftime(video_c.video_date)
      video_c.checked_status = "Unchecked";
      video_c.reviewed = ''+video_c.wrong_checked+'/'+video_c.wrong_detected_count;
      //get violation count
      if(!video_c.wrong_detected_count) continue;
      //get checked_status
      if(video_c.wrong_checked > 0) video_c.checked_status = 'Checked';
      else video_c.checked_status = 'UnChecked';
      //filter data
      if(checked==0) result.push(video_c);
      else if(checked==1 && video_c.checked_status == 'Checked') result.push(video_c);
      else if(checked==2 && video_c.checked_status == 'UnChecked') result.push(video_c);
    }
    return res.status(200).json({ result: result });
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let deletevod = async(req,res) => {
  //state->all: all live broadcasts (default value) living: live broadcast, unstart: not live broadcast yet
  try{
    const {data,history_tag} = req.body;
    for(let k = 0 ; k < data.length; k ++){
      await video_model.deleteVod(data[k].id,history_tag)
    }
    return res.status(200).json({
      message: 'Successfully deleted'
    });
  }catch(err){
    return res.status(400).json({
      message: 'Bad request.', err: err
    });
  }
}
let getsnapInfo = async (req, res) => {
  try {
    const { video_id, sort, filter, history_tag} = req.body;
    const wrong_result = await video_model.getWrongDetectResult(video_id,sort,history_tag);
    let info = {
      total:wrong_result.length,
      review:0,
      report:0,
    }
    let item = []
    for(let i = 0; i < wrong_result.length; i++){
      const {is_check,is_report} = wrong_result[i];
      if(is_check==1) info.review++
      if(is_report==1) info.report++
      if(filter==1&&is_check==1) item.push(wrong_result[i])
      else if(filter==2&&is_check==0) item.push(wrong_result[i])
      else if(filter==3&&is_report==1) item.push(wrong_result[i])
      else if(filter==4&&is_report==0) item.push(wrong_result[i])
      else if(filter==0) item.push(wrong_result[i])
      else{
      }
    }
    const violation_type = await video_model.getViolationType();
    return res.status(200).json({result: item, type:violation_type, info:info, all:wrong_result});
  } catch (err) {
    return res.status(400).json({message: 'something went wrong' });
  }
}
let deletesnapInfo = async (req, res) => {
  try {
    const {data,history_tag} = req.body;
    for(let i = 0 ; i < data.length; i++){
      await video_model.deleteViolationInfo(data[i].id,history_tag);
    }
    if(data.length>0){
      const checked = await video_model.getChecked(data[0].video_id,history_tag);
      if(checked!==false) video_model.updateOne(data[0].video_id,{wrong_checked:checked.checked,reported:checked.reported, wrong_detected_count:checked.total},history_tag);
    }
    return res.status(200).json({message:'Successfully deleted'});
  } catch (err) {
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let locksnapInfo = async (req, res) => {
  try {
    const {data,history_tag} = req.body;
    // const lockornot = await video_model.LockOrNot(data.id,history_tag);
    // if(lockornot) return res.status(401).json({message:'This is editing now by other user'})
    // else{
    //   await video_model.lock(data.id,history_tag)
    //   return res.status(200).json({message:'Successfully locked'});
    // }
    await video_model.lock(data.id,history_tag)
    return res.status(200).json({message:'Successfully locked'});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let unlocksnapInfo = async (req, res) => {
  try {
    const {data,history_tag} = req.body;
    await video_model.unlock(data.id,history_tag)
    return res.status(200).json({message:'Successfully unlocked'});
  } catch (err) {
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let updatesnapinfo = async (req, res) => {
  try {
    const {data,history_tag} = req.body;
    await video_model.updateViolationInfo(data,history_tag);
    const checked = await video_model.getChecked(data.video_id,history_tag);
    if(checked!==false) video_model.updateOne(data.video_id,{wrong_checked:checked.checked,reported:checked.reported, wrong_detected_count:checked.total},history_tag);
    return res.status(200).json({ message: 'Successfully upadated' });
  } catch (err) {
    return res.status(400).json({ message: 'something went wrong' });
  }
}
let vodDetect = async (req, res) => {
  const { lat, lng,image,multi_detect} = req.body;
  let location= await getReverseInfo(lat,lng);
  try {
    const token = baidubuce_token;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    const params = new URLSearchParams()
    params.append('image', image)
    const detect_result = await axios.post(`https://aip.baidubce.com/rest/2.0/ocr/v1/license_plate?access_token=${token}`,params,{headers:headers});
    if('words_result' in detect_result.data){
      return res.status(200).json({number:detect_result.data.words_result.number,location:location});
    } 
    else return res.status(200).json({number:'',location:location});
  } 
  catch (err) {
    console.log(err)
    return res.status(404).json({code:240,message:'Something went wrong.'});
  }
}
//groupping
let moveToGroup = async(req,res) => {
  try{
    const {id,role} = req.user;
    const user_info = await agent_model.getUserInfo(id,role);
    const {data,group_name,history_tag} = req.body;
    for(let k = 0 ; k < data.length; k ++){
      const dataitem = {
        group_name:group_name,
        is_check:1,
        is_report:1,
        group_by:user_info.name,
        group_by_id:id,
        group_by_role:role,
        group_time:core_func.strftime(Date.now())
      };
      await video_model.moveToGroup(data[k].id,dataitem,history_tag)
    }
    return res.status(200).json({
      message: 'Success'
    });
  }catch(err){
    console.log(err)
    return res.status(400).json({
      message: 'Something went wrong', err: err
    });
  }
}
let deleteGroup = async(req,res) => {
  try{
    const {data,history_tag} = req.body;
    for(let k = 0 ; k < data.length; k ++){
      await video_model.deleteGroup(data[k].id,history_tag)
    }
    return res.status(200).json({
      message: 'Success'
    });
  }catch(err){
    return res.status(400).json({
      message: 'Bad request.', err: err
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
let getValueFromArray = (arr,key,value)=>{
  for(let i = 0; i < arr.length;i++)
    if(arr[i][key]==value) return arr[i]
  return false  
}
let getSpliteInfo = async (req, res) => {
  try {
    const { video_id, group, video_url, video_name, dur, splite_start} = req.body;
    const sss = String(splite_start).replace(':','').replace(':','')
    const nameToSplite ='_public/splited_videos/' + String(video_name).replace('.mp4','')+'_'+sss+'_'+dur+'.mp4';
    const fileexist = cf.existFile(nameToSplite);
    if(fileexist) return res.status(200).json({result: nameToSplite });
    const fileNameConverted = await spliteFileAndDownload(video_url, nameToSplite, splite_start, dur);
    return res.status(200).json({result: fileNameConverted });
  } catch (err) {
    return res.status(400).json({message: 'something went wrong' });
  }
}

const spliteFileAndDownload = async (video_url, video_name, start_time, duration) => {
  try {
    return new Promise((resolve, reject) => {
      const fileName = video_name;
      ffmpeg({ source: video_url, nolog: true })
        .setStartTime(start_time)
        .setDuration(duration)
        .output(fileName)
        .on('end', function (err) {
          if (!err) {
            return resolve({ status: 0, fileName: fileName });
          }
        })
        .on('error', function (err) {
          return resolve({ status: 240 });
        }).run();
    })
  } catch (err) {
    return resolve({ status: 240 });
  }
}
module.exports = {
  getstatus,
  getvod,
  deletevod,
  getsnapInfo,
  deletesnapInfo,
  updatesnapinfo,
  locksnapInfo,
  unlocksnapInfo,
  moveToGroup,
  deleteGroup,
  vodDetect,
  appstatus,
}
