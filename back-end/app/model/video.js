const query = require('../utils/sqlQuery');
const setting = require('../../config/setting');
const camera = require('./camera');
const table_name = 'test_video';
const table_name_history = 'history_video';
const detect_table = "tb_detect_result";
const wrong_detect_table = "tb_wrong_detect_result";
const detect_table_history = "history_detect_result";
const wrong_detect_table_history = "history_wrong_detect_result";
const wrong_detect_record_table = "report_wrong_detect_download_record";

let getList = async (camera_id,history_tag=false) => {
    try {
        const data_table = history_tag?table_name_history:table_name;
        const video = await query.get(data_table, '*', `Where camera_id = "${camera_id}"`);
        return video
    }
    catch (err) {
        return []
    }
}
let getTotalLength = async () => {
    try {
        const video = await query.get(table_name, '*');
        const video_h = await query.get(table_name_history, '*');
        return video.length+video_h.length;
    }
    catch (err) {
        return 0
    }
} 
let getAll = async (history_tag=false) => {
    try {
        const data_table = history_tag?table_name_history:table_name;
        const video = await query.get(data_table, '*');
        return video
    }
    catch (err) {
        return []
    }
} 
let getOne = async (id,history_tag=false) => {
    try {
        const data_table = history_tag?table_name_history:table_name;
        const video = await query.get(data_table, '*', `Where id = "${id}"`);
        if(video.length==0) return false
        return video[0]
    }
    catch (err) {
        return false
    }
}
let updateOne = async (id,data,history_tag) => {
    try {
        const data_table = history_tag?table_name_history:table_name;
        const update_r = await query.update(data_table, data, `Where id=${id}`);
        return true;
    }
    catch (err) {
        return false;
    }
}
let deleteOne = async (id,history_tag) => {
    try {
        const data_table = history_tag?table_name_history:table_name;
        await query.del(data_table, `Where id = "${id}"`);
        return true;
    }
    catch (err) {
        return false
    }
}
let getDateRange = async (imei,start,end,history_tag) => {
    try {
        const data_table = history_tag?table_name_history:table_name;
        const video = await query.get(data_table, '*', `Where imei = "${imei}" AND start_at > "${start}" AND end_at < "${end}"`);
        return video
    }
    catch (err) {
        console.log(err)
        return []
    }
}
let getTodayVideo = async (today) => {
    try {
        const video = await query.get(table_name, '*', `Where start_at > "${today}"`);
        return video
    }
    catch (err) {
        console.log(err)
        return []
    }
}
let getWrongDetectResult = async(id,sort='datetime',history_tag=false)=>{
    try {
        const data_table = history_tag?wrong_detect_table_history:wrong_detect_table;
        const item = await query.get(data_table,"*",`Where video_id=${id} AND snap_status =1 ORDER BY ${sort} DESC`);
        return item
    }
    catch (err) {
        console.log(err)
        return []
    }
}
let getWrongDetectResultWithDateRangeForReport = async(start,end,history_tag=false)=>{
    try {
        const data_table = history_tag?wrong_detect_table_history:wrong_detect_table;
        const item = await query.get(data_table,"*",`Where (group_time>"${start}" AND group_time<"${end}") AND NOT group_name = '' AND NOT group_name is null`);
        return item
    }
    catch (err) {
        console.log(err)
        return []
    }
}
let LockOrNot = async(id,history_tag=false)=>{
    try {
        const data_table = history_tag?wrong_detect_table_history:wrong_detect_table;
        const item = await query.get(data_table,"*",`Where id=${id} AND is_lock =1`);
        if(item.length==0) return false
        else return true
    }
    catch (err) {
        console.log(err)
        return false
    }
}
let lock = async(id,history_tag=false)=>{
    try {
        const data_table = history_tag?wrong_detect_table_history:wrong_detect_table;
        const item = await query.update(data_table,{is_lock:1},`Where id=${id}`);
        return true;
    }
    catch (err) {
        console.log(err)
        return false
    }
}
let unlock = async(id,history_tag=false)=>{
    try {
        const data_table = history_tag?wrong_detect_table_history:wrong_detect_table;
        const item = await query.update(data_table,{is_lock:0},`Where id=${id}`);
        return true;
    }
    catch (err) {
        console.log(err)
        return false
    }
}
let moveToGroup = async(id,data,history_tag=false)=>{
    try {
        const data_table = history_tag?wrong_detect_table_history:wrong_detect_table;
        const item = await query.update(data_table,data,`Where id=${id}`);
        return true;
    }
    catch (err) {
        console.log(err)
        return false
    }
}
let deleteGroup = async(id,history_tag=false)=>{
    try {
        const data_table = history_tag?wrong_detect_table_history:wrong_detect_table;
        const item = await query.update(data_table,{group_name:''},`Where id=${id}`);
        return true;
    }
    catch (err) {
        console.log(err)
        return false
    }
}
let getChecked = async (id,history_tag) => {
    try {
        const data_table = history_tag?wrong_detect_table_history:wrong_detect_table;
        const checked = await query.get(data_table,'*',`Where video_id = ${id} AND is_check = 1`);
        const reported = await query.get(data_table,'*',`Where video_id = ${id} AND is_report = 1`);
        const total = await query.get(data_table,'*',`Where video_id = ${id} AND snap_status = 1`);
        return {checked:checked.length, reported:reported.length, total:total.length}
    }
    catch (err) {
        return false
    }
}
let getViolationType = async () => {
    try {
        const item = await query.get('tb_wrong_driving_type', '*');
        return item
    }
    catch (err) {
        return []
    }
}
let updateViolationInfo = async (data,history_tag) => {
    try {
        const data_table = history_tag?wrong_detect_table_history:wrong_detect_table;
        const id = data.id;
        delete data.id;
        if(!data.datetime) delete data.datetime;
        const update_r = await query.update(data_table, data, `Where id=${id}`);
        return true;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let deleteViolationInfo = async (id,history_tag) => {
    try {
        const data_table = history_tag?wrong_detect_table_history:wrong_detect_table;
        await query.del(data_table,`Where id=${id}`);
        return true
    }
    catch (err) {
        return false
    }
}
let getvod = async (startdate,enddate,history_tag=false) => {
    try {
        const data_table = history_tag?table_name_history:table_name;
        const video = await query.get(data_table, '*', `Where start_at > "${startdate}" AND end_at < "${enddate}"`);
        return video
    }
    catch (err) {
        return []
    }
}
let getstatus = async (startdate,enddate,history_tag=false) => {
    try {
        const data_table = history_tag?table_name_history:table_name;
        const video = await query.get(data_table, '*', `Where start_at > "${startdate}" AND end_at < "${enddate}"`);
        return video
    }
    catch (err) {
        return []
    }
}
let getdetectedvideo = async (startdate,enddate,history_tag=false) => {
    try {
        const data_table = history_tag?table_name_history:table_name;
        const video = await query.get(data_table, '*', `Where start_at > "${startdate}" AND end_at < "${enddate}" AND detect_status = 2`);
        return video
    }
    catch (err) {
        console.log(err)
        return []
    }
}
let getTotalViolatonVideo = async () => {
    try {
        const video = await query.get(table_name, '*', `Where wrong_detected_count>0`);
        const video_h = await query.get(table_name_history, '*', `Where wrong_detected_count>0`);
        return video.length + video_h.length
    }
    catch (err) {
        console.log(err)
        return 0
    }
}
let getTotalReviewed = async () => {
    try {
        const video = await query.get(wrong_detect_table, '*', `Where is_check=1`);
        const video_h = await query.get(wrong_detect_table_history, '*', `Where is_check=1`);
        return video.length + video_h.length
    }
    catch (err) {
        console.log(err)
        return 0
    }
}
let getTotalGrouped = async () => {
    try {
        const video = await query.get(wrong_detect_table, '*', `Where NOT group_name is null AND NOT group_name = '' group by group_name`);
        const video_h = await query.get(wrong_detect_table_history, '*', `Where NOT group_name is null AND NOT group_name = '' group by group_name`);
        return video.length + video_h.length
    }
    catch (err) {
        console.log(err)
        return 0
    }
}
let deleteVod = async (id,history_tag=false) => {
    try {
        if(!history_tag){
            await query.del(table_name, `Where id = "${id}"`);
            query.del(detect_table, `Where video_id = "${id}"`);
            query.del(wrong_detect_table, `Where video_id = "${id}"`);
        }
        else{
            await query.del(table_name_history, `Where id = "${id}"`);
            query.del(detect_table_history, `Where video_id = "${id}"`);
            query.del(wrong_detect_table_history, `Where video_id = "${id}"`);
        }
        return true;
    }
    catch (err) {
        return false
    }
}
let record_wrongdetect_download = async (data,history_tag=false) => {
    try {
       await query.create(wrong_detect_record_table,data);
       const {user_id,user_role,group_name,op_id} = data;
    //    const item = await query.get(wrong_detect_record_table,'*',`Where user_id='${user_id}' AND user_role='${user_role}' AND group_name='${group_name}' AND op_id=${op_id}`);
    //    if(item.length==0){
    //        await query.create(wrong_detect_record_table,data);
    //    }else{
    //        data.downloaded = !item[0].downloaded?1:item[0].downloaded+1;
    //        await query.update(wrong_detect_record_table,data,`WHERE id=${item[0].id}`);
    //    }
       const data_table = history_tag?wrong_detect_table_history:wrong_detect_table;
       const wrongitem = await query.get(data_table,'*',`Where group_name = '${group_name}'`);
       if(wrongitem.length>0){
          let count = !wrongitem[0].downloaded?1:wrongitem[0].downloaded+1;
          await query.update(data_table,{downloaded:count},`WHERE id='${wrongitem[0].id}'`)
       }
       return true;
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let getDownloadedRecordOfViolation = async(user_id,user_role,group_name)=>{
   try{
       if(user_role=='super'||user_role=='admin'){
        const item = await query.get(wrong_detect_record_table,'*',`WHERE group_name = '${group_name}'`);
        return item
       }else{
        const item = await query.get(wrong_detect_record_table,'*',`WHERE group_name = '${group_name}' AND user_id='${user_id}' AND user_role='${user_role}'`);
        return item
       }

   }catch(err){
       console.log(err)
       return []
   }
}
module.exports = {
    getList,
    getOne,
    updateOne,
    deleteOne,
    getChecked,
    getViolationType,
    updateViolationInfo,
    deleteViolationInfo,
    getvod,
    getstatus,//histroy inserted
    getWrongDetectResult,
    getWrongDetectResultWithDateRangeForReport,
    getDateRange,
    getTodayVideo,
    getdetectedvideo,
    deleteVod,
    lock,
    unlock,
    LockOrNot,
    moveToGroup,
    deleteGroup,
    getAll,
    record_wrongdetect_download,
    getDownloadedRecordOfViolation,
    getTotalLength,
    getTotalViolatonVideo,
    getTotalReviewed,
    getTotalGrouped,
}