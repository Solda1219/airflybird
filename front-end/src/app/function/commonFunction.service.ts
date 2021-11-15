import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {
  checkAll = false;
  checkbox = [];
  regex_yyyymmddhhmmss = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
  regex_d = /^\d{4}[\-\/\s]?((((0[13578])|(1[02]))[\-\/\s]?(([0-2][0-9])|(3[01])))|(((0[469])|(11))[\-\/\s]?(([0-2][0-9])|(30)))|(02[\-\/\s]?[0-2][0-9]))$/;
  regex_hhmmss =/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
  constructor(
    private lang: TranslateService
  ) { }
  //new
  getDateRange(key){//0-today 1-this week 2- this month 3-this year,5- 15days,6- 15~30days
    let today = new Date();
    if(key==0) return {from:new Date().setHours(0,0,0,0),to:new Date().setHours(23,59,59,999)}
    else if(key==1) {
      var startofweek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
      return {from:new Date(today.setDate(startofweek)).setHours(0,0,0,0),to:new Date().setHours(23,59,59,999)}
    }
    else if(key==2) {
      return {from:new Date(today.getFullYear(), today.getMonth(), 1).setHours(0,0,0,0),to:new Date().setHours(23,59,59,999)}
    }
    else if(key==3) {
      return {from:new Date(today.getFullYear(), 0, 1).setHours(0,0,0,0),to:new Date().setHours(23,59,59,999)}
    }
    else if(key==5) {
      var from = today.getDate() - 15;
      return {from:new Date(today.setDate(from)).setHours(0,0,0,0),to:new Date().setHours(23,59,59,999)}
    }
    else if(key==6) {
      var from = new Date().getDate() - 30;
      var to = new Date().getDate() - 15;
      return {from:new Date(new Date().setDate(from)).setHours(0,0,0,0),to:new Date(new Date().setDate(to)).setHours(23,59,59,999)}
    }
    else if(key==9) {//last month
      return {from:new Date(today.getFullYear(), today.getMonth()-1, 1).setHours(0,0,0,0),to:new Date(today.getFullYear(), today.getMonth(), 0).setHours(23,59,59,999)}
    }
    else{
      return {from:new Date().setHours(0,0,0,0),to:new Date().setHours(23,59,59,999)}
    }
  }
  getChineseTime(time){
    if(!time) return ''
    return this.getDateStringYYYYMMDDHHMMSS(new Date(time).toLocaleString())
  }
  isDate(_date){
    return !isNaN(new Date(_date).getDate());
  }
  DateFromVideoName(video_name) {//ex-C00000320210410201553.mp4
    if(!video_name) return this.getDateStringYYYYMMDD(new Date());
    const name_len = String(video_name).length;
    const date_string = String(video_name).substr((name_len-18),14);
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    const d = new Date(this.convertTOYYYYMMDDHHMMSS(date_string));
    const yymmdd ='' + d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate());
    const hhmmss = ''+getFormat(d.getHours()) + ':' + '00' + ':' + '00';
    return {d:yymmdd,h:hhmmss};
  }
  //old
  getDateStringMMDDYYYY(ss) {
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    if(!this.isDate(ss)) return '';
    const d = new Date(ss);
    return (getFormat(d.getMonth() + 1)) + '/' + getFormat(d.getDate()) + '/' + d.getFullYear();
  }
  findMatchedColumn(serachKey, columnIndexs, srcForSearch) {
    for (let j = 0; j < columnIndexs.length; j++) {
      const column = String(srcForSearch[columnIndexs[j]]);
      if (column.indexOf(serachKey) != -1)
        return srcForSearch
    }
    return false;
  }
  getSerialNumber(){
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    const d = new Date();
    const dateFormat = d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate()) + '-' + getFormat(d.getHours()) + '' + getFormat(d.getMinutes()) + '' + getFormat(d.getSeconds());
    return dateFormat;
  }
  getDateStringYYYYMMDDHHMMSS(ss) {
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    if(!this.isDate(ss)) return '';
    const d = new Date(ss);
    const dateFormat = d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate()) + ' ' + getFormat(d.getHours()) + ':' + getFormat(d.getMinutes()) + ':' + getFormat(d.getSeconds());
    return dateFormat;
  }
  getDateStringYYYYMMDD(ss) {
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    if(!this.isDate(ss)) return '';
    const d = new Date(ss);
    const dateFormat = d.getFullYear() + '-' + getFormat(d.getMonth() + 1) + '-' + getFormat(d.getDate());
    return dateFormat;
  }
  getHHMMSSS(ss) {
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    const d = new Date(ss);
    const dateFormat = '' + getFormat(d.getHours()) + ':' + getFormat(d.getMinutes()) + ':' + getFormat(d.getSeconds());
    return dateFormat;
  }
  getDateStringYYYYMMDDROW(ss) {
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    if(!this.isDate(ss)) return '';
    const d = new Date(ss);
    const dateFormat = d.getFullYear() + getFormat(d.getMonth() + 1) + getFormat(d.getDate());
    return dateFormat;
  }
  getDateStringYYYYMMDDHHMMSSROW(ss) {
    const getFormat = (text) => {
      if (text < 10) return '0' + text
      else return text;
    }
    if(!this.isDate(ss)) return '';
    const d = new Date(ss);
    const dateFormat = d.getFullYear() + getFormat(d.getMonth() + 1) + getFormat(d.getDate()) + getFormat(d.getHours()) + getFormat(d.getMinutes()) + getFormat(d.getSeconds());
    return dateFormat;
  }
  convertTOYYYYMMDDHHMMSS(ss) {
    const str = String(ss).split('');
    return str[0] + str[1] + str[2] + str[3] + '-' + str[4] + str[5] + '-' + str[6] + str[7] + ' ' + str[8] + str[9] + ':' + str[10] + str[11] + ':' + str[12] + str[13];
  }
  convertTOYYYYMMDD(ss) {
    const str = String(ss).split('');
    return str[0] + str[1] + str[2] + str[3] + '-' + str[4] + str[5] + '-' + str[6] + str[7];
  }
  convertTOHHMMSS(ss) {
    const str = String(ss).split('');
    return str[0] + str[1] + ':' + str[2] + str[3] + ':' + str[4] + str[5];
  }
  translate(word) {
    try{
      if (localStorage.getItem('language')) this.lang.use(localStorage.getItem('language'))
      else this.lang.use('en');
      return this.lang.instant(word);
    }catch{
      return word;
    }

  }
}
