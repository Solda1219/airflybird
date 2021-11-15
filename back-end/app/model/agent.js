const query = require('../utils/sqlQuery');
const setting = require('../../config/setting')
let getList = async (phone,role) => {
    try {
        if(role=='agent'){
            const item = await query.get('agents','*',`WHERE contact_number=${phone}`);
            return item;
        }
        else if(role=='super'||role=='admin'){
            const item = await query.get('agents','*');
            return item;
        }
        else return []
    }
    catch (err) {
        return []
    }
}
let update = async (item) => {
    try {
        const {id}=item;
        delete item.id;
       const update = await query.update('agents',item,`WHERE id=${id}`);
       return true
    }
    catch (err) {
        return false;
    }
}
let getUserInfo = async (id,role) => {
   try {
       if(role=='super'||role=='admin'){
        const item = await query.get('tb_gpu_user','*',`WHERE id=${id}`);
        if(item.length > 0) return {name:item[0].name,email:item[0].email,phone:item[0].phone_number}
        else return {name:'',email:'',phone:''}
       }
       else if(role=='agent'){
        const item = await query.get('agents','*',`WHERE id=${id}`);
        if(item.length > 0) return {name:item[0].agent_name,email:item[0].mail_address,phone:item[0].contact_number}
        else return {name:'',email:'',phone:''}
       }else{
        const item = await query.get('vehicles','*',`WHERE id=${id}`);
        if(item.length > 0) return {name:item[0].nick_name,email:item[0].email,phone:item[0].phone}
        else return {name:'',email:'',phone:''}    
       }
   }catch{
       console.log(err)
       return {name:'',email:'',phone:''};
   }
}
module.exports = {
    update,
    getList,
    getUserInfo,
}