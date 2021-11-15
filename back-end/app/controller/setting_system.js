const axios = require('axios');
const md5 = require('md5');
const app_status  = require("../model/app_status");
const vehicle_model = require("../model/vehicle");
const message_model = require("../model/message");
const core_func = require('../utils/core_func');
const messageController = require('../controller/messages')
const system_exe = () => {  
  setCookie();
  setBaidubuceToken();
  app_status.start_gpsapp();
  //system setting
  setInterval(()=>{
    console.log('setting cooking, baidutoken started')
    setCookie();
    setBaidubuceToken();
  },1000*60*60);
  //etc setting
  setInterval(()=>{
    messageController.checkStatus();
  },5000);
}
let setCookie = async() => {
  //state->all: all live broadcasts (default value) living: live broadcast, unstart: not live broadcast yet
  try{
    const item = await axios.post('http://117.21.178.59:18000/api/v1/login',{username:'admin',password:md5('admin')});
    if(item['data']["code"] == 200){
      live_key = 'sid='+ item['data']['data']['sid'];
      console.log('cookie newly set to ' + live_key)
      return true;
    }else return false
  }catch(err){
    // console.log(err);
    return false;
  }
}
let setBaidubuceToken = async() => {
  //state->all: all live broadcasts (default value) living: live broadcast, unstart: not live broadcast yet
  try{
    const item = await axios.get('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=cl8wGZTepFyGfrCCkMNHSw2d&client_secret=DnvCDLfgDPFX0Y3hxg3MUFCrNwsMFg6t&');
    baidubuce_token = item.data['access_token'];
  }catch(err){
    // console.log(err);
  }
}
module.exports = {
  system_exe,
}
