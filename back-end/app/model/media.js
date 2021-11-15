const query = require('../utils/sqlQuery');
let update = async (item) => {
    try {
       const {id}=item;
       delete item.id;
       const update = await query.update('media_servers',item,`WHERE id=${id}`);
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
       media_servers.*
       FROM media_servers
       `);  
       return item
    }
    catch (err) {
        return [];
    }
}
let del = async (id) => {
    try {
       const item = await query.del('media_servers',`WHERE id = ${id}`);  
       return true
    }
    catch (err) {
        return false
    }
}
let exist = async (server_id) => {
    try {
       const item = await query.get('media_servers','*',`WHERE server_id = '${server_id}'`);  
       return item.length
    }
    catch (err) {
        return 0;
    }
}
let existNotme = async (server_id,id) => {
    try {
       const item = await query.get('media_servers','*',`WHERE server_id = '${server_id}' AND NOT id=${id}`);  
       return item.length
    }
    catch (err) {
        return 0;
    }
}
let create = async (data) => {
    try {
       const item = await query.create('media_servers',data);  
       return true
    }
    catch (err) {
       return false
    }
}
module.exports = {
    getter,
    del,
    exist,
    existNotme,
    update,
    create,
}