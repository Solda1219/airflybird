const query = require('../utils/sqlQuery');
const table = 'device_status';
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
let insert = async (data) => {
    try {
       if(!data.imei) return false;
       const exist = await query.get(table,'*',`WHERE imei = "${data.imei}"`);
       if(exist.length>0){
        await query.update(table,data,`WHERE imei = "${data.imei}"`);
       }else{
        await query.create(table,data);
       }
       return true
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let getOne = async (imei) => {
    try {
       const item = await query.get(table,'*',`WHERE imei = "${imei}"`);
       if(item.length==0) return false;
       else return item[0]
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let getStatusData = async (imei,status) => {
    try {
       const item = await query.get(table,'*',`WHERE imei = "${imei}" AND status='${status}'`);
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
    create,
    update,
    del,
    insert,
    getOne,
    getStatusData,
}