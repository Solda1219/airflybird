const query = require('../utils/sqlQuery');
const setting = require('../../config/setting')
let getFromCamera = (gpuList,camera_id) => {
    for(let i = 0; i < gpuList.length; i++){
      const item  = gpuList[i].camera_setting!=null? String(gpuList[i].camera_setting).split(','):[];
      if(item.indexOf(String(camera_id))!=-1) return gpuList[i]
    }
    return false;
}
let update = async (item) => {
    try {
       const {id}=item;
       delete item.id;
       const update = await query.update('tb_gpu',item,`WHERE id=${id}`);
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
       tb_gpu.*,
       tb_gpu_user.name as owner
       FROM tb_gpu
       LEFT JOIN tb_gpu_user
       ON tb_gpu_user.id = tb_gpu.user_id
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
       const item = await query.del('tb_gpu',`WHERE id = ${id}`);  
       return true
    }
    catch (err) {
        return false
    }
}
let exist = async (code,gpu_address) => {
    try {
       const item = await query.get('tb_gpu','*',`WHERE gpu_address = '${gpu_address}' OR code = '${code}'`);  
       return item.length
    }
    catch (err) {
        return 0;
    }
}
let existNotme = async (code,gpu_address,id) => {
    try {
       const item = await query.get('tb_gpu','*',`WHERE gpu_address = '${gpu_address}' OR code = '${code}' AND NOT id=${id}`);
       return item.length
    }
    catch (err) {
        return 0;
    }
}
let create = async (data) => {
    try {
       const item = await query.create('tb_gpu',data);  
       return true
    }
    catch (err) {
       return false
    }
}
module.exports = {
    getFromCamera,
    getter,
    del,
    exist,
    existNotme,
    update,
    create,
}