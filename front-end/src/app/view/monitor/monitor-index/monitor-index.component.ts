import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-monitor-index',
  templateUrl: './monitor-index.component.html',
  styleUrls: ['./monitor-index.component.scss']
})
export class MonitorIndexComponent implements OnInit {
  request:any;
  _openedCustomer = true;
  _openedSearch = true;
  loading = false;
  map_status = false;
  info_status = false;
  info_imei;
  info_number;
  info_item;
  gpsdata = [];
  selected_vehicle = [];
  treeItem = [];
  tab='All';
  param = {imei:''};
  interval;
  re_time = 10;
  constructor(
    public cf: CommonFunctionService,
    private route: ActivatedRoute,
    private userService: UserService,
  ) { 
  }
  ngOnInit() {
  }
  ngOnDestroy(): void {
    if(this.interval) clearInterval(this.interval);
    if(this.request) this.request.unsubscribe();
  }
  customerViewChange(value){
    this.treeItem = value?value:[];
  }
  tabChange(value){
    this.tab =value 
  }
  async searchChange(value){
    this.selected_vehicle = value?value:[];
    await this.startInterval();
  }
  startInterval(){
    clearInterval(this.interval)
    if(this.treeItem && this.treeItem.length>0){
      this.getInfo();
    }
    this.interval = setInterval(()=>{
      if(this.treeItem && this.treeItem.length>0){
        this.getInfo();
      }
    },(this.re_time)*1000)
  }
  getInfo(){
    if(this.request) this.request.unsubscribe();
    this.request = this.userService.postRequest('_api/monitor/realtime/getInfo',{vehicles:this.selected_vehicle}).subscribe(
      res=>{
        this.gpsdata = res['gpsdata'];
        if(this.info_imei && this.gpsdata.length>0) this.setInfoItem(this.info_imei,this.gpsdata);
      },
      err=>{
      }
    );
  }
  async addressinfo(lat,lng){
    try{
      const res = await this.userService.postRequest('_api/map/addressinfo',{lat:lat,lng:lng}).toPromise();
      return res['result']
    }catch(err){
      return ''
    }
  }
  async showItemStatus(item){
    let gpsdata = [];
    if(this.gpsdata.length==0){
      this.loading = true;
      try{
        const res = await this.userService.postRequest('_api/monitor/realtime/getInfo',{vehicles:[item]}).toPromise();
        gpsdata = res['gpsdata'];
      }catch(err){
      }
      this.loading = false;
    }else{
      gpsdata = this.gpsdata;
    }
    this.info_status = true;
    this.info_number = item.license_plate_number;
    this.info_imei = item.device_imei;
    this.setInfoItem(this.info_imei,gpsdata);
  }
  async setInfoItem(imei,item:any){
    for(let i = 0; i < item.length; i++){
      if(imei==item[i].imei){
        this.info_item = item[i];
        this.info_item.address = await this.addressinfo(this.info_item.lat,this.info_item.lng);
        return
      }
    }
    this.info_item = undefined;
    this.info_status = false;
  }
}
