const core_func = require('../utils/core_func');
const vehicle_model = require('../model/vehicle');
const gps_model = require('../model/gps');
const hb_model = require('../model/heartbeat');
const deviceStatus_model = require('../model/device_status');
const report_model = require('../model/report');
const alert_model = require('../model/alert');
const message_model = require("../model/message");
//in here , we check offline, parking, idling status
let checkStatus = async ()=>{
    try{
       const criteria_time = core_func.strftime(system_time);
       const offlineOB = await report_model.getReportTypeOne('offline');
       const parkingOB = await report_model.getReportTypeOne('parking');
       const idlingOB = await report_model.getReportTypeOne('idling');
       const v_arr = await vehicle_model.getAll();
       const nowDateString = core_func.strftime(new Date());
       const nowTime = new Date().getTime();
       const deltaWithCriteria = (nowTime-new Date(criteria_time).getTime()+1000*11*60)/60000;
       for(let i=0 ; i < v_arr.length; i++){
         const {device_imei,id,license_plate_number,real_name} = v_arr[i];
         //expired
         await treatExpire(v_arr[i]);
         //offline
         const offS = await ifOffline(device_imei,offlineOB,deltaWithCriteria,nowTime);//1000,offline
         const parkingS = await ifParking(device_imei,parkingOB,deltaWithCriteria,nowTime);//1001,parking
         const idlingS = await ifIdling(device_imei,idlingOB,deltaWithCriteria,nowTime);//1002,idling
         if(offS){//in case of offline
        //    console.log('device '+device_imei+'is in offline stats');
           const is_new = await isAlreadyReported(device_imei,'offline',offlineOB,nowTime);
           if(is_new){
            // console.log('device '+device_imei+'saved in offline stats');
            await deviceStatus_model.insert({imei:device_imei,status:'offline',created_at:nowDateString});
            await alert_model.create({imei:device_imei,type:'DEVICE',account:real_name,alertType:1000,vehicle_id:id,device_name:license_plate_number,postTime:nowDateString,created_at:nowDateString})
            await message_model.create({imei:device_imei,msg_type:1,sender:"system",status:0,created_at:nowDateString});
           }
         }
         else if(idlingS){//in case of idling
            // console.log('device '+device_imei+'is in idling stats');
            const is_new = await isAlreadyReported(device_imei,'idling',idlingOB,nowTime);
            if(is_new){
            //  console.log('device '+device_imei+'saved in idling stats');
             await deviceStatus_model.insert({imei:device_imei,status:'idling',created_at:nowDateString});
             await alert_model.create({imei:device_imei,type:'DEVICE',alertType:1002,account:real_name,vehicle_id:id,device_name:license_plate_number,postTime:nowDateString,created_at:nowDateString})
             await message_model.create({imei:device_imei,msg_type:0,sender:"system",status:0,created_at:nowDateString});
            }
         }
         else if(parkingS){//in case of parking
            // console.log('device '+device_imei+'is in parking stats');
            const is_new = await isAlreadyReported(device_imei,'parking',idlingOB,nowTime);
            if(is_new){
            //  console.log('device '+device_imei+'saved in parking stats');
             await deviceStatus_model.insert({imei:device_imei,status:'parking',created_at:nowDateString});
             await alert_model.create({imei:device_imei,type:'DEVICE',account:real_name,alertType:1001,vehicle_id:id,device_name:license_plate_number,postTime:nowDateString,created_at:nowDateString})
            }
         }else{//ok status
            // console.log('device '+device_imei+'saved in ok stats');
            await deviceStatus_model.insert({imei:device_imei,status:'ok',created_at:nowDateString});
         }
       }
    }catch{
        console.log('checkstatus error')
        console.log(err)
    }
}
let ifOffline = async (imei,criteria,systemOverFlowed,timeCriteria)=>{
    try{
        const hb_last = await hb_model.getLastData(imei);
        if(hb_last===false&&systemOverFlowed>criteria.range) return true;
        const delta = (timeCriteria-new Date(hb_last.time).getTime())/60000;
        if(hb_last!==false&&delta>criteria.range) return true;
        return false;
    }catch(err){
        console.log(err);
        return false;
    }
}
let ifIdling = async (imei,criteria,systemOverFlowed,timeCriteria)=>{
    try{
        const gps_last = await gps_model.getLastData(imei);
        if(gps_last===false) return false;
        const delta = (timeCriteria-new Date(gps_last.created_at).getTime())/60000;
        if(gps_last.gpsSpeed<criteria.value&&gps_last.acc==1&&delta>criteria.range) return true;
        return false;
    }catch(err){
        console.log(err);
        return false;
    }
}
let ifParking = async (imei,criteria,systemOverFlowed,timeCriteria)=>{
    try{
        const gps_last = await gps_model.getLastData(imei);
        if(gps_last===false) return false;
        const delta = (timeCriteria-new Date(gps_last.created_at).getTime())/60000;
        if(gps_last.gpsSpeed==0&&gps_last.acc==0&&delta>criteria.range) return true;
        return false;
    }catch(err){
        console.log(err);
        return false;
    }
}
let isAlreadyReported = async (imei,status,criteria,timeCriteria)=>{
    try{
         const LastData = await deviceStatus_model.getStatusData(imei,status);
         if(LastData!==false){
            const delta = (timeCriteria-new Date(LastData.created_at).getTime())/60000;
            if(delta>criteria.range) return true;
         }else{
             return true;
         }
         return false;
    }catch(err){
        console.log(err);
        return false;
    }
}
let treatExpire = async (vehicleInfo)=>{
    try{
        const {end,device_imei} = vehicleInfo;
        if(!device_imei) return;
        const today = new Date().getTime();
        const endTime = new Date(end).getTime();
        const expSoonDate = 7;
        const delta = endTime - today;
        if (delta < 3600 * 24 * 1000 * expSoonDate && delta > 0){//expiring soon
         const dataitem = {
             imei:device_imei,
             msg_type:1,
             sender:'system',
             status:0,
             created_at:core_func.strftime(Date.now()),
         };
         const e = await message_model.exist(device_imei,1);
         if(e==false) await message_model.create(dataitem);
         else{
           if(e['status']==1) await message_model.update(e.id,{created_at:core_func.strftime(Date.now()),status:0});
         }
        }
        if (delta < 0 ){//expired
          const dataitem = {
            imei:device_imei,
            msg_type:2,
            sender:'system',
            status:0,
            created_at:core_func.strftime(Date.now()),
          };
          const e = await message_model.exist(device_imei,2);
          if(e==false) await message_model.create(dataitem);
          else{
            if(e['status']==1) await message_model.update(e.id,{created_at:core_func.strftime(Date.now()),status:0});
          }
        }
    }catch(err){
        console.log(err);
        return false;
    }
}
module.exports = {
    checkStatus
}