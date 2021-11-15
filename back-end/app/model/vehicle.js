const query = require('../utils/sqlQuery');

let getList = async (phone, role) => {
    try {
        if (role == 'super' || role == 'admin') {
            const item = await query.lawQuery(`
            SELECT 
            vehicles.*,
            agents.id as agent_id,
            agents.agent_name as agent_name,
            vehicle_types.name as type_name
            FROM vehicles
            LEFT JOIN agents 
            ON  vehicles.agent_id = agents.id
            LEFT JOIN vehicle_types 
            ON vehicles.vehicle_type_id = vehicle_types.id
            Where vehicles.agent_id = agents.id
            `);
            const agents = await query.get('agents', '*');
            return { item: item, agents: agents };
        }
        else if (role == 'agent') {
            const item = await query.lawQuery(`
            SELECT 
            vehicles.*,
            agents.id as agent_id,
            agents.agent_name as agent_name,
            vehicle_types.name as type_name
            FROM vehicles
            LEFT JOIN agents 
            ON vehicles.agent_id = agents.id
            LEFT JOIN vehicle_types 
            ON vehicles.vehicle_type_id = vehicle_types.id
            Where agents.contact_number = '${phone}'
            `);
            const agents = [];
            return { item: item, agents: agents };
        }
        else if (role == 'user') {
            const item = await query.lawQuery(`
            SELECT 
            vehicles.*,
            agents.id as agent_id,
            agents.agent_name as agent_name,
            vehicle_types.name as type_name
            FROM vehicles
            LEFT JOIN agents 
            ON vehicles.agent_id = agents.id
            LEFT JOIN vehicle_types 
            ON vehicles.vehicle_type_id = vehicle_types.id
            Where 
            vehicles.phone = '${phone}'
            `);
            const agents = [];
            return { item: item, agents: agents };
        }
    }
    catch (err) {
        return { item: [], agents: [] };
    }
}
let deviceAll = async (phone, role) => {//tested
    try {
        if (role == 'super'||role == 'admin') {
            const item = await query.lawQuery(`
            SELECT 
            vehicles.*,
            agents.agent_name as agent_name,
            vehicle_types.name as type_name,
            device_status.status as vehicle_status,
            tb_camera.id as camera_index,
            tb_camera.camera_id as camera_id,
            tb_camera.camera_type as camera_type,
            tb_camera.status as camera_status,
            tb_camera.device_imei as device_imei,
            tb_camera.install_date as install_date,
            tb_camera.installation_site as installation_site,
            tb_camera.sim_card_number as sim_card_number,
            tb_camera.left_position as left_position,
            tb_camera.right_position as right_position,
            tb_camera.gpu_id as gpu_id,
            tb_camera.end as camera_end,
            tb_gpu.gpu_address as gpu
            FROM vehicles
            LEFT JOIN agents 
            ON  vehicles.agent_id = agents.id
            LEFT JOIN vehicle_types 
            ON vehicles.vehicle_type_id = vehicle_types.id
            LEFT JOIN tb_camera 
            ON vehicles.id = tb_camera.vehicle_number
            LEFT JOIN device_status
            ON device_status.imei = tb_camera.device_imei
            LEFT JOIN tb_gpu 
            ON  tb_camera.gpu_id = tb_gpu.id
            GROUP BY tb_camera.camera_id
            `);
            return item;
        }
        else if (role == 'agent') {
            const item = await query.lawQuery(`
            SELECT 
            vehicles.*,
            agents.agent_name as agent_name,
            vehicle_types.name as type_name,
            device_status.status as vehicle_status,
            tb_camera.id as camera_index,
            tb_camera.camera_id as camera_id,
            tb_camera.camera_type as camera_type,
            tb_camera.status as camera_status,
            tb_camera.device_imei as device_imei,
            tb_camera.id as camera_index,
            tb_camera.camera_id as camera_id,
            tb_camera.camera_type as camera_type,
            tb_camera.status as camera_status,
            tb_camera.device_imei as device_imei,
            tb_camera.install_date as install_date,
            tb_camera.installation_site as installation_site,
            tb_camera.sim_card_number as sim_card_number,
            tb_camera.left_position as left_position,
            tb_camera.right_position as right_position,
            tb_camera.end as camera_end,
            tb_gpu.gpu_address as gpu
            FROM vehicles
            LEFT JOIN agents 
            ON  vehicles.agent_id = agents.id
            LEFT JOIN vehicle_types 
            ON vehicles.vehicle_type_id = vehicle_types.id
            LEFT JOIN tb_camera 
            ON vehicles.id = tb_camera.vehicle_number
            LEFT JOIN device_status
            ON device_status.imei = tb_camera.device_imei
            LEFT JOIN tb_gpu 
            ON  tb_gpu.id = tb_camera.gpu_id
            Where agents.contact_number = '${phone}'
            GROUP BY tb_camera.camera_id
            `);
            return item;
        }
        else if (role == 'user') {
            const item = await query.lawQuery(`
            SELECT 
            vehicles.*,
            agents.agent_name as agent_name,
            vehicle_types.name as type_name,
            device_status.status as vehicle_status,
            tb_camera.id as camera_index,
            tb_camera.camera_id as camera_id,
            tb_camera.camera_type as camera_type,
            tb_camera.status as camera_status,
            tb_camera.device_imei as device_imei,
            tb_camera.id as camera_index,
            tb_camera.camera_id as camera_id,
            tb_camera.camera_type as camera_type,
            tb_camera.status as camera_status,
            tb_camera.device_imei as device_imei,
            tb_camera.install_date as install_date,
            tb_camera.installation_site as installation_site,
            tb_camera.sim_card_number as sim_card_number,
            tb_camera.left_position as left_position,
            tb_camera.right_position as right_position,
            tb_camera.end as camera_end,
            tb_gpu.gpu_address as gpu
            FROM vehicles
            LEFT JOIN agents 
            ON  vehicles.agent_id = agents.id
            LEFT JOIN vehicle_types 
            ON vehicles.vehicle_type_id = vehicle_types.id
            LEFT JOIN tb_camera 
            ON vehicles.id = tb_camera.vehicle_number
            LEFT JOIN device_status
            ON device_status.imei = tb_camera.device_imei
            LEFT JOIN tb_gpu 
            ON  tb_gpu.id = tb_camera.gpu_id
            Where vehicles.phone = '${phone}'
            GROUP BY tb_camera.camera_id
            `);
            return item;
        }
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
let agentUserList = async (id) => {
    try {
        const item = await query.lawQuery(`
        SELECT 
        vehicles.*,
        vehicle_types.name as type_name
        FROM vehicles
        LEFT JOIN vehicle_types 
        ON vehicles.vehicle_type_id = vehicle_types.id
        Where agent_id = ${id}
        `);
        return item;
    }
    catch (err) {
        return [];
    }
}
let typeAll = async () => {
    try {
        const item = await query.get('vehicle_types', '*')
        return item
    }
    catch (err) {
        return [];
    }
}
let create = async (item) => {
    try {
        const update = await query.create('vehicles', item);
        const items = await query.get('vehicles', '*', `WHERE phone='${item.phone}'`)
        if (items.length == 0) return false;
        return items[0].id;
    }
    catch (err) {
        return false;
    }
}
let update = async (item) => {
    try {
        const { id } = item;
        delete item.id;
        const update = await query.update('vehicles', item, `WHERE id=${id}`);
        return true
    }
    catch (err) {
        return false;
    }
}
let getFromImei = async (imei) => {
    try {
        const item = await query.lawQuery(`
        SELECT
        vehicles.*,
        tb_camera.camera_id
        FROM tb_camera
        LEFT JOIN vehicles
        ON tb_camera.vehicle_number = vehicles.id
        WHERE tb_camera.device_imei = ${imei}
        `);       
        if(item.length==0) return {}
        else return item[0]
    }
    catch (err) {
        console.log(err)
        return {};
    }
}
let getAll = async () => {
    try {
        const item = await query.lawQuery(`
        SELECT
        vehicles.*,
        tb_camera.camera_id,
        tb_camera.device_imei
        FROM tb_camera
        LEFT JOIN vehicles
        ON tb_camera.vehicle_number = vehicles.id
        `);       
        return item;
    }
    catch (err) {
        console.log(err)
        return [];
    }
}
module.exports = {
    getAll,
    getList,
    deviceAll,
    typeAll,
    agentUserList,
    update,
    create,
    getFromImei,
    
}