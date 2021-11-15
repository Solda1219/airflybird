const query = require('../utils/sqlQuery');
const table = 'alarm_alert';
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
let getList = async (from) => {
    try {
        const item = await query.get(table,'*',`WHERE postTime > "${from}"`);
        return item
     }
     catch (err) {
         console.log(err)
         return [];
     }
}
let getListByDate = async (from,to) => {
    try {
        const item = await query.get(table,'*',`WHERE postTime > "${from}" AND postTime < "${to}"`);
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
module.exports = {
    getter,
    create,
    update,
    del,
    getList,
    getListByDate,
}