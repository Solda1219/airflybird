import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';

export class ExpirationTreeService {
  getTrees(csItem,exp,days): TreeviewItem[] {
    if(csItem === false) return [];
    const {agents, item} = csItem;
    let treeRoot = [];
    if(agents.length>0){
      for(let i = 0; i < agents.length; i++){
        const childItem = item.filter(x=>x.agent_id == agents[i].id && this.checkExpiration(x.end,exp,days))
        const c_item = [];
        for(let k=0; k < childItem.length; k++) c_item.push({text: childItem[k].license_plate_number, value: childItem[k].id})
        treeRoot.push(new TreeviewItem({text: agents[i].agent_name,value: agents[i].id, collapsed: c_item.length==0?false:true, checked:c_item.length==0?false:true, disabled:c_item.length==0?true:false, children:c_item}))
      }
    }else{
      for(let i = 0; i < item.length; i++){
        treeRoot.push(new TreeviewItem({text: item[i].license_plate_number,value: item[i].id}))
      }
    }
    return treeRoot;
  }
  checkExpiration(date,exp,days){
   const exp_time = new Date(date).getTime();
   const oneday = 1000*3600*24;
   const criticaltime = new Date().getTime();
   let expTT;
   if(exp==0) expTT = -1
   else expTT = 1
   if(days==0){
     const delta = expTT*(exp_time - criticaltime);
     return delta > 0 && delta/oneday <= 7
   }
   else if(days==1){
    const delta = expTT*(exp_time - criticaltime);
    return delta > 0 && delta/oneday <= 30
   }
   else if(days==2){
    const delta = expTT*(exp_time - criticaltime);
    return delta > 0 && delta/oneday <= 60
   }
   else if(days==3){
    const delta = expTT*(exp_time - criticaltime);
    return delta/oneday > 7 && delta/oneday <= 30
   }
   else if(days==4){
    const delta = expTT*(exp_time - criticaltime);
    return delta/oneday > 30 && delta/oneday <= 60
   }
   else {
    const delta = expTT*(exp_time - criticaltime);
    return delta/oneday > 60
   }
  }
}