const fs = require('fs');
const fsPromise = require("fs").promises;
const EARTH_RADIUS = 6378.137;
function timeDeltaToDate(delta) {
    let str = '';
    const day = Math.floor(delta / 24 / 60 / 60 / 1000);
    const hour = Math.floor((delta % (24 * 60 * 60 * 1000)) / 60 / 60 / 1000);
    const minute = Math.floor((delta % (60 * 60 * 1000)) / 60 / 1000);
    const seconds = Math.floor(delta % (60 * 1000)/1000);
    if (day > 0) str += day + 'days ';
    if (hour > 0) str += hour + 'h ';
    if (minute > 0) str += minute + 'min ';
    if (seconds > 0) str += seconds + 's ';
    return str;
  }
function strftime(ss,format) {
    const getFormat = (text) => {
        if (text < 10) return '0' + text
        else return text;
    }
    const d = new Date(ss);
    if(format=='YYYY-mm-dd hh:mm:ss'){
        const dateFormat = d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate()) + ' ' + getFormat(d.getHours()) + ':' + getFormat(d.getMinutes()) + ':' + getFormat(d.getSeconds());
        return dateFormat;
    }
    else if(format=='hh:mm:ss'){
        const hour = Math.floor(ss / 3600) < 10 ? '0' + Math.floor(ss / 3600) : Math.floor(ss / 3600);
        const minute = Math.floor((ss % 3600) / 60) < 10 ? '0' + Math.floor((ss % 3600) / 60) : Math.floor((ss % 3600) / 60);
        const second = ss % 60 < 10 ? '0' + ss % 60 : ss % 60;
        return '' + hour + ':' + minute + ':' + second;
    }
    else{
        const dateFormat = d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate()) + ' ' + getFormat(d.getHours()) + ':' + getFormat(d.getMinutes()) + ':' + getFormat(d.getSeconds());
        return dateFormat;
    }
  
}  
function gethhmmss(ss) {
  const getFormat = (text) => {
    if (text < 10) return '0' + text
    else return text;
  }
  const d = new Date(ss);
  const dateFormat = '' + getFormat(d.getHours()) + ':' + getFormat(d.getMinutes()) + ':' + getFormat(d.getSeconds());
  return dateFormat;
}
function utcToChina(time) {
    if(!time) return ''
    const date = new Date(time)
    return strftime(date.setHours(date.getHours()+8),"YYYY-mm-dd hh:mm:ss")
}
function formatBytes(x) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;

    while(n >= 1024 && ++l){
        n = n/1024;
    }
    //include a decimal point and a tenths-place digit if presenting 
    //less than ten of KB or greater units
    return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}
let filter_array = (arr,index,key)=>{
    try{
      const item = []
      for(let i = 0 ;  i < arr.length; i++){
        if(arr[i][index]==key) item.push(arr[i])
      }
      return item;
    }catch(err){
      return []
    }
}
let splite_days = (startDate, endDate)=>{
    try{
        var dates = [],
        currentDate = startDate,
        addDays = function(days) {
          var date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };
        while (currentDate <= endDate) {
        const date_from =strftime(new Date(currentDate).setHours(0,0,0,0),'YYYY-mm-dd hh:mm:ss');
        const date_to =strftime(new Date(currentDate).setHours(23,59,59,999),'YYYY-mm-dd hh:mm:ss');
        dates.push({from:date_from,to:date_to});
        currentDate = addDays.call(currentDate, 1);
        }
        return dates;
    }catch(err){
      return []
    }
}
//file
const existFile = (path) => {
   return fs.existsSync(path)  
}
//map function
const calcTotalMile = (opt) => {
    if(opt.length<2) return 0;
    let total = 0
    for(let i = 1; i < opt.length; i++){
      const longitude1 = Number(opt[i-1].lng);
      const longitude2 = Number(opt[i].lng);
      const latitude1 = Number(opt[i-1].lat);
      const latitude2 = Number(opt[i].lat);
      total = total+ getDistance(longitude1, latitude1, longitude2, latitude2);
    }
    return total
}
const getDistance = (longitude1, latitude1, longitude2, latitude2) => {
    // 纬度
    const lat1 = latitude1*Math.PI/180;//将一个角度测量的角度转换成以弧度表示的近似角度
    const lat2 = latitude2*Math.PI/180;//将一个角度测量的角度转换成以弧度表示的近似角度
    // 经度
    const lng1 = longitude1*Math.PI/180;//将一个角度测量的角度转换成以弧度表示的近似角度
    const lng2 = longitude2*Math.PI/180;//将一个角度测量的角度转换成以弧度表示的近似角度
    // 纬度之差
    const a = lat1 - lat2;
    // 经度之差
    const b = lng1 - lng2;
    // 计算两点距离的公式
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(b / 2), 2)));
    // 弧长乘地球半径, 返回单位: 千米
    s =  s * EARTH_RADIUS;
    return s;
}
const calcTravelTime = (opt) => {
    if(opt.length < 2) return 0
    let total = 0
    for(let i = 1; i < opt.length; i++){
      const speed = opt[i].gpsSpeed;
      const prevTime = opt[i-1].gpsTime;
      const curTime = opt[i].gpsTime;
      if(speed&&speed>0&&prevTime&&curTime)
      total = total+ Number(new Date(curTime).getTime() - new Date(prevTime).getTime());
    }
    return total
}
const calcAvgSpeed = (opt) => {
    let total = 0;
    let total_speed = 0;
    for(let i = 0; i < opt.length; i++){
      const speed = Number(opt[i].gpsSpeed);
      if(speed&&speed>0){
          total++;
          total_speed = total_speed + Number(speed);
      }
    }
    return !total||total==0?0:total_speed/total;
}
const maxSpeed = (opt) => {
    let total = 0;
    for(let i = 0; i < opt.length; i++){
      const speed = Number(opt[i].gpsSpeed);
      if(speed>total) total = speed;
    }
    return total
}
module.exports = {
    formatBytes,
    timeDeltaToDate,
    strftime,
    gethhmmss,
    existFile,
    utcToChina,
    filter_array,
    splite_days,
    calcTotalMile,
    getDistance,
    calcTravelTime,
    calcAvgSpeed,
    maxSpeed,
};
  