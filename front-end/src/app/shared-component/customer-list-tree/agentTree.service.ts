import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';

export class AgentTreeService {
  getTrees(csItem): TreeviewItem[] {
    if(csItem === false) return [];
    const {agents, item} = csItem;
    let treeRoot = [];
    if(agents.length>0){
      for(let i = 0; i < agents.length; i++){
        const childItem = item.filter(x=>x.agent_id == agents[i].id)
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
}