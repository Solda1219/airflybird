const jwtDecode = require('jwt-decode');
const { body, validationResult } = require('express-validator');
const { createToken, hashPassword, hashLaravelPassword, verifyPassword, verifyLaravelPassword } = require('../utils/authentication');
const query = require('../utils/sqlQuery');
const setting = require('../../config/setting');
const fileController = require("./file");
const vehicel_model = require('../model/vehicle');
const camera_model = require('../model/camera');
const agent_model = require('../model/agent');
const gpu_model = require('../model/gpu');
const core_func = require('../utils/core_func');
const axios = require('axios');
//admin
let getAdmins = async (req, res) => {
  try {
    const { phone, role, id } = req.user;
    const item = await query.get('tb_gpu_user', '*', `WHERE NOT phone_number=${setting.superAdmin} AND NOT id=${id}`);
    return res.json({ result: item });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let createAdmins = async (req, res) => {
  try {
    const { name, email, phone_number, password } = req.body;
    const exist = await query.get('tb_gpu_user', '*', `WHERE phone_number="${phone_number}"`);
    if (exist.length > 0) return res.status(401).json({ message: 'This account already exist.' });
    const newpassword = await hashPassword(password);
    const create = await query.create('tb_gpu_user', {
      name: name,
      email: email,
      phone_number: phone_number,
      password: newpassword,
    });
    return res.json({ message: 'Successfully created!' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let editAdmins = async (req, res) => {
  try {
    const { id } = req.body;
    const data = req.body;
    const exist = await query.get('tb_gpu_user', '*', `WHERE phone_number=${data.phone_number} AND NOT id=${id}`);
    if (exist.length > 0) return res.status(401).json({ message: 'This phone_number already exist.' });
    delete data.id;
    const update = await query.update('tb_gpu_user', data, `WHERE id=${id}`);
    if (update.affectedRows == 0) return res.status(401).json({ message: 'Successfully not created. Please try again.' });
    return res.json({ message: 'Successfully operated!' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let delAdmins = async (req, res) => {
  try {
    const { id } = req.body;
    const exist = await query.get('tb_gpu_user', '*', `WHERE id=${id}`);
    if (exist.length == 0) return res.status(401).json({ message: 'This account not exist.' });
    const del = await query.del('tb_gpu_user', `WHERE id=${id}`);
    if (del.affectedRows == 0) return res.status(401).json({ message: 'Successfully not deleted. Please try again.' });
    return res.json({message: 'Successfully operated!' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let resetPasswordAdmin = async (req, res) => {
  try {
    const { id } = req.body;
    const exist = await query.get('tb_gpu_user', '*', `WHERE id=${id}`);
    if (exist.length == 0) return res.status(401).json({ message: 'This account not exist.' });
    const password = await hashPassword('12345678');
    const update = await query.update('tb_gpu_user', { password: password }, `WHERE id=${id}`);
    if (update.affectedRows == 0) return res.status(401).json({ message: 'Failed. Please try again.' });
    return res.json({ message: 'Password successfully reseted to 12345678' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
//agents
let getAgents = async (req, res) => {
  try {
    const { phone, role } = req.user;
    if (role==='super'||role==='admin'){
      const item = await query.get('agents', '*');
      //add users length
      for (let i = 0; i < item.length; i++) {
        const usersL = await vehicel_model.agentUserList(item[i].id);
        item[i].users = usersL.length;
      }
      return res.status(200).json({ result: item });
    }else{
      return [];
    }
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let getAgentUserList = async (req, res) => {
  try {
    const { id } = req.body;
    const item = await vehicel_model.agentUserList(id);
    return res.status(200).json({ result: item });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let createAgents = async (req, res) => {
  try {
    await fileController._uploadAccountImages(req, res);
    const data = req.body;
    const { contact_number, password } = data;
    const exist = await query.get('agents', '*', `WHERE contact_number="${contact_number}"`);
    if (exist.length > 0) return res.status(401).json({ message: 'This account already exist.' });
    const newpassword = await hashPassword(password);
    delete data.id;
    data.password = newpassword;
    const create = await query.create('agents', data);
    return res.json({message: 'Successfully created!' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let editAgents = async (req, res) => {
  try {
    await fileController._uploadAccountImages(req, res);
    const data = req.body;
    const { contact_number, password, id } = data;
    const exist = await query.get('agents', '*', `WHERE contact_number="${contact_number}" AND NOT id = ${id}`);
    if (exist.length > 0) return res.status(401).json({ message: 'This account already exist.' });
    const newpassword = await hashPassword(password);
    delete data.id;
    delete data.users;
    const update = await query.update('agents', data, `WHERE id=${id}`);
    const { phone, role } = req.user;
    return res.json({ message: 'Successfully updated!' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let delAgents = async (req, res) => {
  try {
    const { id } = req.body;
    const exist = await query.get('agents', '*', `WHERE id=${id}`);
    if (exist.length == 0) return res.status(401).json({ message: 'This account not exist.' });
    const del = await query.del('agents', `WHERE id=${id}`);
    if (del.affectedRows == 0) return res.status(401).json({ message: 'Successfully not deleted. Please try again.' });
    return res.json({ message: 'Successfully operated!' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let resetPasswordAgents = async (req, res) => {
  try {
    const { id } = req.body;
    const exist = await query.get('agents', '*', `WHERE id=${id}`);
    if (exist.length == 0) return res.status(401).json({ message: 'This account not exist.' });
    const password = await hashPassword('12345678');
    const update = await query.update('agents', { password: password }, `WHERE id=${id}`);
    if (update.affectedRows == 0) return res.status(401).json({ message: 'Failed. Please try again.' });
    return res.json({ message: 'Password successfully reseted to 12345678' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
//customer
let gpsInfo = async (req, res) => {
  try {
    let gpsdata = [];
    let heartbeat;
    const { camera_index } = req.body;
    const cameraOne = await camera_model.getOne(camera_index); 
    if(cameraOne===false) return res.status(401).json({message:'Camera not exist'});
    const device_imei = cameraOne.device_imei;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    const params = new URLSearchParams();
    const today = new Date();
    const start_time = new Date(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate(),today.getUTCHours()-1,today.getUTCMinutes(),today.getUTCSeconds());
    const end_time = new Date(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate(),today.getUTCHours(),today.getUTCMinutes(),today.getUTCSeconds());
    params.append('startTime', core_func.strftime(start_time,"YYYY-mm-dd hh:mm:ss"));
    params.append('endTime', core_func.strftime(end_time,"YYYY-mm-dd hh:mm:ss"));
    params.append('imei', device_imei);
    const gps_result = await axios.post(`http://117.21.178.59:9080/api/tracker/trackByTime`,params,{headers:headers});
    if(gps_result.data.code == 0){
      if(gps_result.data.data.length>0) {
        gpsdata = gps_result.data.data[gps_result.data.data.length-1];
        gpsdata.address = await getReverseInfo(gpsdata.lat,gpsdata.lng)
      }
    }
    const hearbeat_result = await axios.get(`http://117.21.178.59:9080/api/device/deviceTrackerHB?imeis=${device_imei}`);
    if(hearbeat_result.data.code == 0){
      if(hearbeat_result.data.data.length>0) heartbeat = hearbeat_result.data.data[0];
    }
    return res.json({heartbeat:heartbeat,gpsdata:gpsdata});
  }
  catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Something went wrong.', err: err
    });
  }
}
let getEndusers = async (req, res) => {
  try {
    const { phone, role, id } = req.user;
    const typeAll = await vehicel_model.typeAll();
    const agentList = await agent_model.getList(phone, role);
    const remainCamera = await camera_model.getRemain();
    const gpuList = await gpu_model.getter();
    const item = await vehicel_model.deviceAll(phone, role);
    return res.status(200).json({ result: item, agentList: agentList, cameraList: remainCamera, gpuList: gpuList, typeList: typeAll });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let createEndusers = async (req, res) => {
  try {
    await fileController._uploadAccountImages(req, res);
    const { phone, role, id } = req.user;
    const data = req.body;
    const exist = await query.get('vehicles', '*', `WHERE phone="${data.phone}"`);
    if (exist.length > 0) return res.status(401).json({ message: 'This account already exist.' });
    const newpassword = await hashPassword(data.password);
    data.password = newpassword;
    const c_id = await vehicel_model.create(
      {
        real_name: data.real_name,
        vehicle_type_id: data.vehicle_type_id,
        brand: data.brand,
        date_of_production: data.date_of_production,
        purchase_date: data.purchase_date,
        date_of_issue: data.date_of_issue,
        identification_code: data.identification_code,
        color: data.color,
        license_plate_number: data.license_plate_number,
        phone: data.phone,
        vehicle_city: data.vehicle_city,
        vehicle_province: data.vehicle_province,
        model: data.model,
        driving_license: data.driving_license,
        nick_name: data.nick_name,
        password: data.password,
        agent_id: data.agent_id,
        start: data.start,
        end: data.end,
        avatar: data.avatar,
        created_at: data.created_at,
      }
    );
    await camera_model.update({
      id: data.camera_index,
      camera_type: data.camera_type,
      install_date: data.install_date,
      installation_site: data.installation_site,
      sim_card_number: data.sim_card_number,
      left_position: data.left_position,
      right_position: data.right_position,
      gpu_id: data.gpu_id,
      vehicle_number: c_id,
      status: data.status,
    });
    return res.json({ message: 'Successfully created!' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let editEndusers = async (req, res) => {
  try {
    await fileController._uploadAccountImages(req, res);
    const data = req.body;
    const { id } = data;
    const exist = await query.get('vehicles', '*', `WHERE phone="${data.phone}" AND NOT id = ${data.id}`);
    if (exist.length > 0) return res.status(401).json({ message: 'This account already exist.' });
    const newpassword = await hashPassword(data.password);
    await vehicel_model.update(
      {
        id: data.id,
        real_name: data.real_name,
        vehicle_type_id: data.vehicle_type_id,
        brand: data.brand,
        date_of_production: data.date_of_production,
        purchase_date: data.purchase_date,
        date_of_issue: data.date_of_issue,
        identification_code: data.identification_code,
        color: data.color,
        license_plate_number: data.license_plate_number,
        phone: data.phone,
        vehicle_city: data.vehicle_city,
        vehicle_province: data.vehicle_province,
        model: data.model,
        driving_license: data.driving_license,
        nick_name: data.nick_name,
        password: data.password,
        agent_id: data.agent_id,
        start: data.start,
        end: data.end,
        avatar: data.avatar,
        updated_at: data.updated_at,
      }
    );
    await camera_model.update({
      id: data.camera_index,
      camera_type: data.camera_type,
      install_date: data.install_date,
      installation_site: data.installation_site,
      sim_card_number: data.sim_card_number,
      left_position: data.left_position,
      right_position: data.right_position,
      gpu_id: data.gpu_id,
      status: data.status,
      end:data.camera_end,
    });
    return res.json({ message: 'Successfully updated!' });
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let delEndusers = async (req, res) => {
  try {
    const { id } = req.body;
    const exist = await query.get('vehicles', '*', `WHERE id=${id}`);
    if (exist.length == 0) return res.status(401).json({ message: 'This account not exist.' });
    const del = await query.del('vehicles', `WHERE id=${id}`);
    if (del.affectedRows == 0) return res.status(401).json({ message: 'Successfully not deleted. Please try again.' });
    const { phone, role } = req.user;
    return res.json({ message: 'Successfully operated!' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
let resetPasswordEndusers = async (req, res) => {
  try {
    const { id } = req.body;
    const exist = await query.get('vehicles', '*', `WHERE id=${id}`);
    if (exist.length == 0) return res.status(401).json({ message: 'This account not exist.' });
    const password = await hashPassword('12345678');
    const update = await query.update('vehicles', { password: password }, `WHERE id=${id}`);
    if (update.affectedRows == 0) return res.status(401).json({ message: 'Failed. Please try again.' });
    return res.json({ message: 'Password successfully reseted to 12345678' });
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
module.exports = {
  getAdmins,
  createAdmins,
  editAdmins,
  delAdmins,
  resetPasswordAdmin,
  getAgents,
  getAgentUserList,
  createAgents,
  editAgents,
  delAgents,
  resetPasswordAgents,
  getEndusers,
  gpsInfo,
  createEndusers,
  editEndusers,
  delEndusers,
  resetPasswordEndusers,
}
