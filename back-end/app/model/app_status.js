const query = require('../utils/sqlQuery');
const core_func = require('../utils/core_func');
const setting = require('../../config/setting')
let getter = async () => {
    try {
       const item = await query.get('app_status','*');
       return item
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let download_status = async (gpu_id) => {
    try {
       const item = await query.get('tb_downloadapp_status','*',`WHERE gpu_id = ${gpu_id} ORDER BY datetime ASC`);
       if(item.length==0) return false;
       else return item[item.length-1];
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let detect_status = async (gpu_id) => {
    try {
       const item = await query.get('tb_detectapp_status','*',`WHERE gpu_id = ${gpu_id} ORDER BY datetime ASC`);
       if(item.length==0) return false;
       else return item[item.length-1];
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let upload_status = async (gpu_id) => {
    try {
       const item = await query.get('tb_uploadapp_status','*',`WHERE gpu_id = ${gpu_id} ORDER BY datetime ASC`);
       if(item.length==0) return false;
       else return item[item.length-1];
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let start_gpsapp = async () => {
    try {
        console.log('gps app record started')
        const date_now = core_func.strftime(new Date(),'YYYY-mm-dd hh:mm:ss');
        const data = {
            name:'Gps recording app',
            started_at:date_now,
            status:1
        }
        const exist = await query.get('app_status','*',`WHERE name = 'Gps recording app'`);
        if(exist.length>0) {
            const item = await query.update('app_status',data,`WHERE name = 'Gps recording app'`);
        }else{
            const item = await query.create('app_status',data);
        }
    }
    catch (err) {
        console.log(err)
    }
}
module.exports = {
    getter,
    start_gpsapp,
    upload_status,
    detect_status,
    download_status,
}