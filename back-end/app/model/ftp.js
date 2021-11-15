const query = require('../utils/sqlQuery');
let update = async (item) => {
    try {
       const {id}=item;
       delete item.id;
       const update = await query.update('ftp_servers',item,`WHERE id=${id}`);
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
       ftp_servers.*,
       tb_gpu_user.name as creator
       FROM ftp_servers
       LEFT JOIN tb_gpu_user
       ON tb_gpu_user.id = ftp_servers.user_id
       `);  
       return item
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let del = async (id) => {
    try {
       const item = await query.del('ftp_servers',`WHERE id = ${id}`);  
       return true
    }
    catch (err) {
        return false
    }
}
let exist = async (server_id,ip) => {
    try {
       const item = await query.get('ftp_servers','*',`WHERE ip_address = '${ip}' OR server_id = '${server_id}'`);  
       return item.length
    }
    catch (err) {
        return 0;
    }
}
let existNotme = async (server_id,ip,id) => {
    try {
       const item = await query.get('ftp_servers','*',`WHERE ip_address = '${ip}' OR server_id = '${server_id}' AND NOT id=${id}`);  
       return item.length
    }
    catch (err) {
        return 0;
    }
}
let create = async (data) => {
    try {
       const item = await query.create('ftp_servers',data);  
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