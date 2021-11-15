const query = require('../utils/sqlQuery');
const table = 'alarm_message';
//---table structure
//msg_type 0-> Device offlinem 1-> Device expiring soon 2->expired
//status 0->unread 1->read
let getter = async () => {
    try {
        const item = await query.get(table,'*',`Order by created_at DESC`);
        return item
     }
     catch (err) {
         console.log(err)
         return [];
     }
}
let getList = async (from) => {
    try {
        const item = await query.get(table,'*',`WHERE created_at > "${from}"`);
        return item
     }
     catch (err) {
         console.log(err)
         return [];
     }
}
let create = async (data) => {
    try {
       const {imei,msg_type} = data;
       const create = await query.create(table,data);
       return create
    }
    catch (err) {
        console.log(err)
        return false;
    }
}
let exist = async (imei,type) => {
    try {
        const item = await query.get(table,'*',`WHERE imei='${imei}' AND msg_type='${type}'`);
        if(item.length==0) return false;
        else return item[0];
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
module.exports = {
    getter,
    create,
    update,
    del,
    exist,
    getList,
}