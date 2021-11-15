const query = require('../utils/sqlQuery');
const table_type = 'report_type';
let getReportType = async () => {
    try {
        const item = await query.get(table_type,'*');
        return item
     }
     catch (err) {
         console.log(err)
         return [];
     }
}
let getReportTypeOne = async (name) => {
    try {
        const item = await query.get(table_type,'*',`WHERE name='${name}'`);
        if(item.length==0) return false;
        return item[0]
     }
     catch (err) {
         console.log(err)
         return false;
     }
}
let editReportType = async (name,data) => {
    try {
        const item = await query.update(table_type,data,`WHERE name='${name}'`);
        return true
     }
     catch (err) {
         console.log(err)
         return false;
     }
}
module.exports = {
    getReportType,
    getReportTypeOne,
    editReportType,
}