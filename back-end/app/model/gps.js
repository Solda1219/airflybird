const query = require('../utils/sqlQuery');
const setting = require('../../config/setting');
const table = 'real_gps';
const table_last = 'real_gps_last';
const history_table = 'history_gps';
let getter = async (imei,from,to,history_tag=false) => {
    try {
       const datatable = history_tag?history_table:table;
       const item = await query.get(datatable,'*',`WHERE imei = '${imei}' AND (gpsTime > '${from}' AND gpsTime < '${to}') GROUP BY gpsTime ORDER BY gpsTime ASC`)
       return item
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getAll = async (from,to,history_tag=false) => {
    try {
       const datatable = history_tag?history_table:table;
       const item = await query.get(datatable,'*',`WHERE gpsTime > '${from}' AND gpsTime < '${to}' ORDER BY gpsTime ASC`)
       return item
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getDataRangeByImei = async (from,to,imei,history_tag=false) => {
    try {
       const datatable = history_tag?history_table:table;
       const item = await query.get(datatable,'*',`WHERE gpsTime > '${from}' AND gpsTime < '${to}' AND imei = '${imei}' GROUP BY gpsTime ORDER BY gpsTime ASC`);
       return item
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let getLastExistedData = async (to,imei,history_tag=false) => {
    try {
       const datatable = history_tag?history_table:table;
       const item = await query.get(datatable,'*',`WHERE gpsTime < '${to}' AND imei = '${imei}' GROUP BY gpsTime ORDER BY gpsTime DESC`)
       if(item.length==0) return false;
       return item[0];
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let getByImei = async (imei,history_tag=false) => {
    try {
       const datatable = history_tag?history_table:table;
       const item = await query.get(datatable,'*',`WHERE imei = '${imei}' GROUP BY gpsTime ORDER BY gpsTime ASC`)
       return item
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let lastdata = async (imei) => {
    try {
        const item = await query.get(table_last,'*',`WHERE imei = '${imei}' AND NOT lat ='' AND NOT lat is null AND NOT lng ='' AND NOT lng is null`);
        // console.log([item[0].lat,item[0].lng,item[0].gpsTime]);
        return item
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let pushgps = async (data) => {
    try {
       const create = await query.create(table,data);
       return create
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let insertLast = async (data) => {
    try {
       if(!data.imei) return false;
       const exist = await query.get(table_last,'*',`WHERE imei = "${data.imei}"`);
       if(exist.length>0){
        await query.update(table_last,data,`WHERE imei = "${data.imei}"`);
       }else{
        await query.create(table_last,data);
       }
       return true
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let getLastData = async (imei) => {
    try {
       const item = await query.get(table_last,'*',`WHERE imei = "${imei}"`);
       if(item.length==0) return false;
       else return item[0]
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
module.exports = {
    getter,
    pushgps,
    lastdata,
    insertLast,
    getByImei,
    getDataRangeByImei,
    getAll,
    getLastData,
    getLastExistedData,
}