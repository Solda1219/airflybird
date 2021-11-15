const query = require('../utils/sqlQuery');
const table = 'heart_beat';
const table_last = 'heart_beat_last';
let getter = async () => {
    try {
        const item = await query.get(table,'*');
        return item
     }
     catch (err) {
         console.log(err)
         return [];
     }
}
let getRange = async (from,to) => {
    try {
        const item = await query.get(table,'*',`WHERE time > '${from}' AND time < '${to}' GROUP BY time ORDER BY time ASC`);
        return item
     }
     catch (err) {
         console.log(err)
         return [];
     }
}
let create = async (data) => {
    try {
       const create = await query.create(table,data);
       return create
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let update = async (id,data) => {
    try {
       delete data.id;
       const update = await query.update(table,data,`WHERE id=${id}`);
       return update
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let del = async (id) => {
    try {
       const update = await query.del(table,`WHERE id=${id}`);
       return true
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
    getRange,
    create,
    update,
    del,
    insertLast,
    getLastData,
}