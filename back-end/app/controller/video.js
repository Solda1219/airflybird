const vehicle_model = require('../model/vehicle')
const video_model = require('../model/video')
const cf = require('../utils/core_func')
const axios = require('axios');
const cloud_video_live_url = 'http://117.21.178.59:18000/api/v1/live/';
const live_snapShot_url = "http://117.21.178.59:18000/api/v1/record/";
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const md5 = require('md5');
ffmpeg.setFfmpegPath(ffmpegPath);
let getindex = async (req, res) => {
  try{
    let data = {
      live:{
        live:0,
        all:0,
      },
      vod:0
    }
    const { phone, role} = req.user;
    const vehicle_item = await vehicle_model.deviceAll(phone,role)
    data.live.all = vehicle_item.length
    //live
    let liveitem = [];
    liveitem = await getLiveItem('all','',0,100000);
    for(let i = 0 ; i < vehicle_item.length; i ++) {
      const {camera_id, agent_id, agent_name, id} = vehicle_item[i];
      for(let k = 0 ; k < liveitem.length; k++){
        if(camera_id == liveitem[k].id){
          const tt = liveitem[k];
          if(tt.session) data.live.live++
          break;
        }
      }
    }
    //vod
    for(let i = 0 ; i < vehicle_item.length; i ++){
      const vehicle = vehicle_item[i];
      const video_item = await video_model.getList(vehicle.camera_id);
      data.vod += video_item.length;
    }
    return res.status(200).json({result:data})
  }catch(err){
    console.log(err)
    return res.status(400).json({
      message: 'Something went wrong.', err: err
    });
  }
}
let getlive = async (req, res) => {
  try {
    const { phone, role} = req.user;
    const {state,q}=req.body;
    const vehiclitem = await vehicle_model.deviceAll(phone,role);
    //live
    let liveitem = [];
    liveitem = await getLiveItem(state,q,0,100000);
    const item = [];
      const livedata = liveitem;
      for(let i = 0 ; i < vehiclitem.length; i ++) {
        const {camera_id, agent_id, agent_name, id, device_imei} = vehiclitem[i];
        for(let k = 0 ; k < livedata.length; k++){
          if(camera_id == livedata[k].id){
            const dd = livedata[k];
            const tt = livedata[k];
            dd.vehicle_id = id;
            dd.agent_id = agent_id;
            dd.agent_name = agent_name;
            dd.id = tt.id;
            dd.name = tt.name;
            dd.push_switch = tt.actived;
            dd.push_stream = tt.authed;
            dd.share_switch = tt.shared;
            dd.live_status = tt.session? 'Live streaming':'Not yet live'; 
            dd.push_rate = tt.session? cf.formatBytes(tt.session.InBitrate):'';
            dd.push_traffic = tt.session? cf.formatBytes(tt.session.InBytes):'';
            dd.push_total_traffic = cf.formatBytes(tt.inFlow);
            dd.online_users = tt.session?tt.session.NumOutputs:'';
            dd.play_traffic = tt.session? cf.formatBytes(tt.session.OutBytes):'';
            dd.play_total_traffic = cf.formatBytes(tt.outFlow);
            dd.live_duration = tt.session?tt.session.Time:'';
            dd.preservation = tt.recordReserve;
            dd.start_time = tt.session?tt.session.StartTime:'';
            dd.end_time = tt.session?tt.session.EndTime:'';
            dd.update_time = tt.updateAt;
            item.push(dd);
            break;
          }
          if(k==(livedata.length-1)){
            const dd = {};
            dd.vehicle_id = id;
            dd.agent_id = agent_id;
            dd.agent_name = agent_name;
            dd.id = camera_id;
            dd.name = device_imei;
            dd.push_switch = false;
            dd.push_stream = false;
            dd.share_switch = false;
            dd.live_status = 'Not yet live'; 
            dd.push_rate = '';
            dd.push_traffic = '';
            dd.push_total_traffic = '';
            dd.online_users = '';
            dd.play_traffic = '';
            dd.play_total_traffic = '';
            dd.live_duration = '';
            dd.preservation = '';
            dd.start_time = '';
            dd.end_time = '';
            dd.update_time = '';
            item.push(dd);
            break;
          }
        }
      }
      return res.json({result:item});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Something went wrong.', err: err
    });
  }
}
let getliveForMonitor = async (req, res) => {
  try {
    const { phone, role} = req.user;
    const {state,q}=req.body;
    const vehiclitem = await vehicle_model.deviceAll(phone,role);
    //live
    let liveitem = [];
    liveitem = await getLiveItem(state,q,0,100000);
    const item = [];
      const livedata = liveitem;
      for(let i = 0 ; i < vehiclitem.length; i ++) {
        const {camera_id, agent_id, agent_name, id, device_imei} = vehiclitem[i];
        for(let k = 0 ; k < livedata.length; k++){
          if(camera_id == livedata[k].id){
            const dd = livedata[k];
            const tt = livedata[k];
            dd.vehicle_id = id;
            dd.agent_id = agent_id;
            dd.agent_name = agent_name;
            dd.id = tt.id;
            dd.name = tt.name;
            dd.push_switch = tt.actived;
            dd.push_stream = tt.authed;
            dd.share_switch = tt.shared;
            dd.live_status = tt.session? 'Live streaming':'Not yet live'; 
            dd.push_rate = tt.session? cf.formatBytes(tt.session.InBitrate):'';
            dd.push_traffic = tt.session? cf.formatBytes(tt.session.InBytes):'';
            dd.push_total_traffic = cf.formatBytes(tt.inFlow);
            dd.online_users = tt.session?tt.session.NumOutputs:'';
            dd.play_traffic = tt.session? cf.formatBytes(tt.session.OutBytes):'';
            dd.play_total_traffic = cf.formatBytes(tt.outFlow);
            dd.live_duration = tt.session?tt.session.Time:'';
            dd.preservation = tt.recordReserve;
            dd.start_time = tt.session?tt.session.StartTime:'';
            dd.end_time = tt.session?tt.session.EndTime:'';
            dd.update_time = tt.updateAt;
            item.push(dd);
            break;
          }
        }
      }
      return res.json({result:item});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Something went wrong.', err: err
    });
  }
}
let createlive = async(req,res) => {
  //state->all: all live broadcasts (default value) living: live broadcast, unstart: not live broadcast yet
  try{
    const item =  await axios.post(cloud_video_live_url+"save",req.body, {
      headers: {
        'Cookie':live_key
      }
    });
    if(item.data.code==200) {
      return res.json({message:'Successfully operated!',result:item.data.data});
    }
    else return res.status(401).json({
      message: 'Sever request is wrong!'
    });
  }catch(err){
    return res.status(400).json({
      message: 'Bad request.', err: err
    });
  }
}
let deletelive = async(req,res) => {
  //state->all: all live broadcasts (default value) living: live broadcast, unstart: not live broadcast yet
  try{
    const {id} = req.body;
    const item =  await axios.post(cloud_video_live_url+"remove",{id:id}, {
      headers: {
        'Cookie':live_key
      }
    });
    if(item.data.code==200) return res.json({message:'Successfully deleted!'});
    else return res.status(401).json({
      message: 'Sever request is wrong!'
    });
  }catch(err){
    return res.status(400).json({
      message: 'Bad request.', err: err
    });
  }
}
let getliveRecords = async(req,res) => {
  //state->all: all live broadcasts (default value) living: live broadcast, unstart: not live broadcast yet
  try{
    const { id, day} = req.body; 
    const item =  await axios.get(live_snapShot_url+"query_records?id="+id+"&day="+day, {
      headers: {
        'Cookie':live_key
      }
    });
    return res.json({message:'Successfully operated!',result:item.data.data,key:live_key});
  }catch(err){
    return res.status(400).json({
      message: 'Bad request.', err: err
    });
  }
}

//for video vod page
let getvod = async (req, res) => {
  try {
    let item = [];
    const { phone, role} = req.user;
    const { startdate,enddate,history_tag}=req.body;
    const video_item = await video_model.getvod(startdate,enddate,history_tag);
    const vehicle_item = await vehicle_model.deviceAll(phone,role)
    for(let i = 0 ; i < video_item.length; i ++){
      const video_c = video_item[i];
      const li = getValueFromArray(vehicle_item,'camera_id',video_c.camera_id);
      if(li===false) continue;
      video_c.vehicle_id = li.id;
      video_c.agent_name = li.agent_name;
      video_c.agent_id = li.agent_id;
      video_c.carNumber = li.license_plate_number;
      video_c.video_date = cf.strftime(video_c.video_date,'YYYY-mm-dd hh:mm:ss');
      video_c.recording_time = cf.strftime(video_c.start_at,'YYYY-mm-dd hh:mm:ss');
      video_c.dur = cf.timeDeltaToDate(new Date(video_c.end_at).getTime()-new Date(video_c.start_at).getTime())
      item.push(video_c)
    }
    res.json({result:item})
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Something went wrong.', err: err
    });
  }
}
let deletevod = async(req,res) => {
  //state->all: all live broadcasts (default value) living: live broadcast, unstart: not live broadcast yet
  try{
    const {data,history_tag} = req.body;
    for(let k = 0 ; k < data.length; k ++){
      await video_model.deleteOne(data[k].id,history_tag)
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

//_api function
let getLiveItem = async(state,q,start,limit) => {
  //state->all: all live broadcasts (default value) living: live broadcast, unstart: not live broadcast yet
  try{
    const liveitem =  await axios.post(cloud_video_live_url+"list",{state:state,q:q,start:start,limit:limit},
    {
      headers: {
        'Cookie':live_key
      }
    });
    return liveitem['data']['data']['rows']
  }catch(err){
    return false;
  }
}
let getValueFromArray = (arr,key,value)=>{
  for(let i = 0; i < arr.length;i++)
    if(arr[i][key]==value) return arr[i]
  return false  
}
module.exports = {
  getlive,
  createlive,
  deletelive,
  getliveRecords,
  getvod,
  deletevod,
  getindex,
  getliveForMonitor,
}
