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
let getoverview = async (req, res) => {
  try {
    let info = {
      total_camera:0,
      total_car:0,
      online_camera:0,
      offline_camera:0,
      exp_car:0,
      exps_car:0,
      total_video:0,
      vio_video:0,
      total_reviewed:0,
      total_grouped:0,
    };
    const total_camera = await camera.getter();
    info.total_camera = total_camera.length;
    const total_car = await vehicle_model.getAll();
    for(let i = 0 ; i < total_car.length; i++){
      const {id,end} = total_car[i];
      if(!id) continue;
      info.total_car++;
      const today = new Date().getTime();
      const endTime = new Date(end).getTime()
      const expSoonDate = 7;
      const delta = endTime - today;
      if (delta < 3600 * 24 * 1000 * expSoonDate && delta > 0) info.exps_car++;
      if (delta < 0 ) info.exp_car++;
    }
    const offline_camera = await camera.getOffline();
    info.offline_camera = offline_camera.length;
    info.online_camera = info.total_camera-offline_camera.length;
    info.total_video = await video_model.getTotalLength();
    info.vio_video = await video_model.getTotalViolatonVideo();
    info.total_reviewed = await video_model.getTotalReviewed();
    info.total_grouped = await video_model.getTotalGrouped();
    return res.status(200).json({ result:info});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'something went wrong' });
  }
} 
module.exports = {
  getoverview,
}
