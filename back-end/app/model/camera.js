const query = require('../utils/sqlQuery');
const device_status_table = 'device_status';
let getRemain = async () => {
    try {
       const item = await query.get('tb_camera','*',`WHERE vehicle_number ='' OR vehicle_number is null`);  
       return item
    }
    catch (err) {
        return [];
    }
}
let update = async (item) => {
    try {
       const {id}=item;
       delete item.id;
       const update = await query.update('tb_camera',item,`WHERE id=${id}`);
       return true
    }
    catch (err) {
        return false;
    }
}
let getter = async () => {
    try {
       const item = await query.lawQuery(`
       SELECT 
       tb_camera.*,
       tb_gpu.gpu_address as gpu_name,
       vehicles.license_plate_number as car_number,
       vehicles.start,
       vehicles.end
       FROM tb_camera
       LEFT JOIN tb_gpu
       ON tb_gpu.id = tb_camera.gpu_id
       LEFT JOIN vehicles
       ON vehicles.id = tb_camera.vehicle_number
       `);  
       return item
    }
    catch (err) {
        return [];
    }
}
let getOffline = async () => {
    try {
       const item = await query.get(device_status_table,'*',`WHERE status = "offline"`);
       return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getOne = async (id) => {
    try {
       const item = await query.get('tb_camera','*',`WHERE id = ${id}`)
       if(item.length==0) return false       
       return item[0]
    }
    catch (err) {
        return false;
    }
}
let getGPUCamera = async (id) => {
    try {
        const item = await query.lawQuery(`
        SELECT
        tb_camera.*,
        vehicles.license_plate_number as car_number
        FROM tb_camera
        LEFT JOIN vehicles
        ON vehicles.id = tb_camera.vehicle_number
        WHERE tb_camera.gpu_id = ${id}
        `);
        return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let del = async (id) => {
    try {
       const item = await query.del('tb_camera',`WHERE id = ${id}`);  
       return true
    }
    catch (err) {
        return false
    }
}
let exist = async (camera_id) => {
    try {
       const item = await query.get('tb_camera','*',`WHERE camera_id = '${camera_id}'`);  
       return item.length
    }
    catch (err) {
        return 0;
    }
}
let existNotme = async (camera_id,id) => {
    try {
       const item = await query.get('tb_camera','*',`WHERE camera_id = '${camera_id}' AND NOT id=${id}`);  
       return item.length
    }
    catch (err) {
        return 0;
    }
}
let create = async (data) => {
    try {
       const item = await query.create('tb_camera',data);  
       return true
    }
    catch (err) {
       return false
    }
}
module.exports = {
    getter,
    getOffline,
    del,
    exist,
    getOne,
    existNotme,
    getRemain,
    update,
    create,
    getGPUCamera
}