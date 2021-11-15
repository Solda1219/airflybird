const jwtDecode = require('jwt-decode');
const { body, validationResult } = require('express-validator');
const { createToken, hashPassword, hashLaravelPassword, verifyPassword, verifyLaravelPassword } = require('../utils/authentication');
const query = require('../utils/sqlQuery');
const fileController = require("./file");
const camera_model = require('../model/camera');
const gpu_model = require('../model/gpu');
const ftp_model = require('../model/ftp');
const media_model = require('../model/media');
const vehicle_model = require('../model/vehicle');
const video_model = require('../model/video')
const core_func = require('../utils/core_func');
//camera
let getCameras = async (req, res) => {
    try {
        const { phone, role, id } = req.user;
        const item = await camera_model.getter();
        return res.status(200).json({ result: item });
    }
    catch (error) {
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let createCameras = async (req, res) => {
    try {
        const { phone, role, id } = req.user;
        const data = req.body;
        const exist = await camera_model.exist(data.camera_id)
        if(exist > 0) return res.status(401).json({message:'Camera already exist.'})

        const created = await camera_model.create({
            camera_id:data.camera_id,
            camera_type:data.camera_type,
            device_imei:data.device_imei,
            manufacturer:data.manufacturer,
            production_date:data.production_date,
            storage_date:data.storage_date,
            parameter:data.parameter,
            created_at:core_func.strftime(Date.now(),"YYYY-mm-dd hh:mm:ss"),
            owner:id,
        });
        if(created == true) return res.json({ message: 'Successfully created!' });
        else return res.status(401).json({message:'Creation failed. Please try again.'})
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let editCameras = async (req, res) => {
    try {
        const { phone, role, id } = req.user;
        const data = req.body;
        const exist = await camera_model.existNotme(data.camera_id,data.id)
        if(exist > 0) return res.status(401).json({message:'Camera already exist.'})
        const updated = await camera_model.update({
            id:data.id,
            camera_id:data.camera_id,
            camera_type:data.camera_type,
            device_imei:data.device_imei,
            manufacturer:data.manufacturer,
            production_date:data.production_date,
            storage_date:data.storage_date,
            parameter:data.parameter,
            updated_at:core_func.strftime(Date.now(),"YYYY-mm-dd hh:mm:ss"),
            owner:id,
        });
        if(updated == true) return res.json({ message: 'Successfully updated!' });
        else return res.status(401).json({message:'Update failed. Please try again.'})
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let resetTermOfCameras = async (req, res) => {
    try {
        const { phone, role, id } = req.user;
        const {start,end,vehicle_number} = req.body;
        const updated = await vehicle_model.update({
            start:start,
            end:end,
            id:vehicle_number
        }); 
        if(updated == true) return res.json({ message: 'Successfully updated!' });
        else return res.status(401).json({message:'Update failed. Please try again.'})
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let delCameras = async (req, res) => {
    try {
        const data = req.body;
        const deleted = await camera_model.del(data.id);
        if(deleted) return res.status(200).json({message:'Successfully deleted.'})
        else return res.status(401).json({message:'Delete failed. Please try again.'})
    }
    catch (error) {
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
//FTP
let getFTP = async (req, res) => {
    try {
        const { phone, role, id } = req.user;
        const item = await ftp_model.getter();
        return res.status(200).json({ result: item });
    }
    catch (error) {
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let createFTP = async (req, res) => {
    try {
        const { phone, role, id } = req.user;
        const data = req.body;
        const exist = await ftp_model.exist(data.server_id,data.ip_address)
        if(exist > 0) return res.status(401).json({message:'Ip_address or Server id already exist'})

        const created = await ftp_model.create({
            server_id:data.server_id,
            server_name:data.server_name,
            protocol:data.protocol,
            ip_address:data.ip_address,
            port:data.port,
            encryption:data.encryption,
            login_type:data.login_type,
            user_name:data.user_name,
            password:data.password,
            description:data.description,
            created_at:core_func.strftime(Date.now(),"YYYY-mm-dd hh:mm:ss"),
        });
        if(created == true) return res.json({ message: 'Successfully created!' });
        else return res.status(401).json({message:'Creation failed. Please try again.'})
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let editFTP = async (req, res) => {
    try {
        const { phone, role, id } = req.user;
        const data = req.body;
        const exist = await ftp_model.existNotme(data.server_id,data.ip_address,data.id)
        if(exist > 0) return res.status(401).json({message:'Ip_address or Server id already exist.'})
        const updated = await ftp_model.update({
            id:data.id,
            server_id:data.server_id,
            server_name:data.server_name,
            protocol:data.protocol,
            ip_address:data.ip_address,
            port:data.port,
            encryption:data.encryption,
            login_type:data.login_type,
            user_name:data.user_name,
            password:data.password,
            description:data.description,
            updated_at:core_func.strftime(Date.now(),"YYYY-mm-dd hh:mm:ss"),
        });
        if(updated == true) return res.json({ message: 'Successfully updated!' });
        else return res.status(401).json({message:'Update failed. Please try again.'})
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let delFTP = async (req, res) => {
    try {
        const data = req.body;
        const deleted = await ftp_model.del(data.id);
        if(deleted) return res.status(200).json({message:'Successfully deleted.'})
        else return res.status(401).json({message:'Delete failed. Please try again.'})
    }
    catch (error) {
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
//Media
let getMedia = async (req, res) => {
    try {
        const item = await media_model.getter();
        return res.status(200).json({ result: item });
    }
    catch (error) {
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let createMedia = async (req, res) => {
    try {
        const { phone, role, id } = req.user;
        const data = req.body;
        const exist = await media_model.exist(data.server_id)
        if(exist > 0) return res.status(401).json({message:'Server already exist.'})

        const created = await media_model.create({
            server_id:data.server_id,
            address:data.address,
            server_start:data.server_start,
            server_end:data.server_end,
            domain_name:data.domain_name,
            ip_address:data.ip_address,
            user_name:data.user_name,
            password:data.password,
            camera_url:data.camera_url,
            camera_token:data.camera_token,
            living_url:data.living_url,
            living_token:data.living_token,
            created_at:core_func.strftime(Date.now(),"YYYY-mm-dd hh:mm:ss"),
        });
        if(created == true) return res.json({ message: 'Successfully created!' });
        else return res.status(401).json({message:'Creation failed. Please try again.'})
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let editMedia = async (req, res) => {
    try {
        const { phone, role, id } = req.user;
        const data = req.body;
        const exist = await media_model.existNotme(data.server_id,data.id)
        if(exist > 0) return res.status(401).json({message:'Camera already exist.'})
        const updated = await media_model.update({
            id:data.id,
            server_id:data.server_id,
            address:data.address,
            server_start:data.server_start,
            server_end:data.server_end,
            domain_name:data.domain_name,
            ip_address:data.ip_address,
            user_name:data.user_name,
            password:data.password,
            camera_url:data.camera_url,
            camera_token:data.camera_token,
            living_url:data.living_url,
            living_token:data.living_token,
            updated_at:core_func.strftime(Date.now(),"YYYY-mm-dd hh:mm:ss"),
        });
        if(updated == true) return res.json({ message: 'Successfully updated!' });
        else return res.status(401).json({message:'Update failed. Please try again.'})
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let delMedia = async (req, res) => {
    try {
        const data = req.body;
        const deleted = await media_model.del(data.id);
        if(deleted) return res.status(200).json({message:'Successfully deleted.'})
        else return res.status(401).json({message:'Delete failed. Please try again.'})
    }
    catch (error) {
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
//Media
let getGPU = async (req, res) => {
    try {
        const item = await gpu_model.getter();
        // for(let i = 0; i < item.length; i++){
        //     const detectS = await video_model.gpuDetectStatus(item[i].id)
        //     item[i].video_name = !detectS? 0: detectS.video_name;
        //     item[i].detect_start = !detectS? 0: detectS.detected_start_time;
        // }
        return res.status(200).json({ result: item });
    }
    catch (error) {
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let createGPU = async (req, res) => {
    try {
        const { phone, role, id } = req.user;
        const data = req.body;
        const exist = await gpu_model.exist(data.code,data.gpu_address)
        if(exist > 0) return res.status(401).json({message:'Server name or Code already exist.'})
        const created = await gpu_model.create({
            gpu_address:data.gpu_address,
            code:data.code,
            user_id:id,
            gpu_location:data.gpu_location,
            description:data.description,
            camera_setting:data.camera_setting,
            image_url:data.image_url,
            video_url:data.video_url,
            media_type:data.media_type,
            event_type:data.event_type,
            status:0,
            frame_frequency:data.frame_frequency,
            frame_width:data.frame_width,
            frame_height:data.frame_height,
            max_record_frame:data.max_record_frame,
            created_at:core_func.strftime(Date.now(),"YYYY-mm-dd hh:mm:ss"),
        });
        if(created == true) return res.json({ message: 'Successfully created!' });
        else return res.status(401).json({message:'Creation failed. Please try again.'})
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let editGPU = async (req, res) => {
    try {
        const { phone, role, id } = req.user;
        const data = req.body;
        const exist = await gpu_model.existNotme(data.code,data.server_id,data.id)
        if(exist > 0) return res.status(401).json({message:'Server name or Code already exist.'})
        const updated = await gpu_model.update({
            id:data.id,
            gpu_address:data.gpu_address,
            code:data.code,
            user_id:id,
            gpu_location:data.gpu_location,
            description:data.description,
            camera_setting:data.camera_setting,
            image_url:data.image_url,
            video_url:data.video_url,
            media_type:data.media_type,
            event_type:data.event_type,
            status:data.status,
            frame_frequency:data.frame_frequency,
            frame_width:data.frame_width,
            frame_height:data.frame_height,
            max_record_frame:data.max_record_frame,
            updated_at:core_func.strftime(Date.now(),"YYYY-mm-dd hh:mm:ss"),
        });
        if(updated == true) return res.json({ message: 'Successfully updated!' });
        else return res.status(401).json({message:'Update failed. Please try again.'})
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let delGPU = async (req, res) => {
    try {
        const data = req.body;
        const deleted = await gpu_model.del(data.id);
        if(deleted) return res.status(200).json({message:'Successfully deleted.'})
        else return res.status(401).json({message:'Delete failed. Please try again.'})
    }
    catch (error) {
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
let cameras = async (req, res) => {
    try {
        const data = req.body;
        const item = await camera_model.getGPUCamera(data.id);
        return res.status(200).json({result:item})
    }
    catch (error) {
        return res.status(400).json({
            message: 'Something went wrong.', err: error
        });
    }
}
module.exports = {
    getCameras,
    createCameras,
    editCameras,
    resetTermOfCameras,
    delCameras,
    getFTP,
    createFTP,
    editFTP,
    delFTP,
    getMedia,
    createMedia,
    editMedia,
    delMedia,
    getGPU,
    createGPU,
    editGPU,
    delGPU,
    cameras,
}
