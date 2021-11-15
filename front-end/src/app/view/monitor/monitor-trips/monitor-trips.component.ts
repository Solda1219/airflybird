import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MapCalculateService } from '../../../map-component/map-calculate.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-monitor-trips',
  templateUrl: './monitor-trips.component.html',
  styleUrls: ['./monitor-trips.component.scss'],
  providers: [MapCalculateService]
})
export class MonitorTripsComponent implements OnInit, OnDestroy {
  request:any;
  _opened = true;
  treeItem;
  loading = false;
  formGroup: FormGroup;
  param = {imei:''};
  gpsdata;
  gpsdataList = [];
  vehicleInfo;
  liveInfo;
  interval;
  re_time = 3;
  host_url = 'http://117.21.178.59:18000';
  //param
  status_info = {
    start:'',
    cur:'',
    speed:'',
    totalMile:'',
    time:''
  }
  //modal
  @ViewChild('snapVideoModal') public snapVideoModal: ModalDirective;
  @ViewChild('snapPlayer') snapPlayer: ElementRef;
  @ViewChild('streamPlayer') streamPlayer: ElementRef;
  snap_src;
  constructor(
    public cf: CommonFunctionService,
    private route: ActivatedRoute,
    private userService : UserService,
    private _formBuilder: FormBuilder,
    private core_map : MapCalculateService
  ) { }

  async ngOnInit() {
    this.param.imei = this.route.snapshot.params.imei;
    await this.getVehicleInfo();
    await this.setLiveVideo();
  }
  ngOnDestroy() {
    if(this.interval) clearInterval(this.interval);
    if(this.request) this.request.unsubscribe();
  }
  async getVehicleInfo(){
    try{
      const res = await this.userService.postRequest('_api/monitor/getVehicleInfo',this.param).toPromise();
      this.vehicleInfo = res['result'];
    }catch(err){
      console.log(err)
    }
  }
  async setLiveVideo(){
    try {
      const res = await this.userService.postRequest('_api/monitor/trips/getlive', {
        state: 'all',
        q: this.vehicleInfo.camera_id,
      }, true).toPromise()
     if(res['result'].length>0){
       this.liveInfo = res['result'][0];
       if(this.liveInfo.session)
       this.streamPlay(this.liveInfo,'HTTPFLV');//HTTPFLV,WSFLV,HLS,RTMP
     }
    } catch (err) {
    }
  }
  streamPlay(item,method){
    let stream_src; 
    if(method=='RTMP'){
      stream_src = item.session[method];
    }
    else {
      stream_src = this.host_url+item.session[method];
    }
    this.streamPlayer.nativeElement.setAttribute("video-url", stream_src)
  }
  getInfo(){
    if(this.request) this.request.unsubscribe();
    this.request = this.userService.postRequest('_api/monitor/trips/getInfo',this.param).subscribe(
      res=>{
        if(res['gpsdata']){
          this.gpsdata = res['gpsdata'];
          this.gpsdataList.push(this.gpsdata);
          if(!this.status_info.start && this.gpsdata.address){
            this.status_info.start = this.gpsdata.address;
          }else if(this.status_info.start && this.gpsdata.address){
            this.status_info.cur = this.gpsdata.address;
          }
          this.status_info.time = this.gpsdata.gpsTime;
          this.status_info.speed = this.gpsdata.gpsSpeed + 'km/h';
          const totalMile = this.gpsdataList.length>0?this.core_map.calcTotalMile(this.gpsdataList,this.gpsdataList.length-1):0;
          this.status_info.totalMile = (totalMile<100?Math.floor(totalMile*1000)/1000:Math.floor(totalMile*10)/10) +'km';
        }
      },
      err=>{
      }
    );
  }
  pushSwitch(item){
    const {id,name,push_switch} = item;
    this.userService.postRequest('_api/video/live/createlive',{id:id,name:name,actived:push_switch}).subscribe(
      res=>{
          this.userService.handleSuccess(res['message']);
      },
      err=>{
        this.userService.handleError(err)
        item.push_switch=!item.push_switch;
      }
    );
  }
  pushStreamAuthentication(item){
    const {id,name,push_stream} = item;
    this.userService.postRequest('_api/video/live/createlive',{id:id,name:name,authed:push_stream}).subscribe(
      res=>{
          this.userService.handleSuccess(res['message']);
      },
      err=>{
        this.userService.handleError(err)
        item.push_stream=!item.push_stream;
      }
    );
  }
  shareSwitch(item){
    const {id,name,share_switch} = item;
    this.userService.postRequest('_api/video/live/createlive',{id:id,name:name,shared:share_switch}).subscribe(
      res=>{
          this.userService.handleSuccess(res['message']);
      },
      err=>{
        this.userService.handleError(err)
        item.share_switch=!item.share_switch;
      }
    );
  }
  sendPushStream(){
    this.userService.postRequest('_api/device/pushStream',{imei:this.param.imei}).subscribe(
      res=>{
          this.userService.handleSuccess(res['message']);
      },
      err=>{
        this.userService.handleError(err)
      }
    );
  }
  startInterval(){
    clearInterval(this.interval);
    this.getInfo();
    this.interval = setInterval(()=>{
      this.getInfo();
    },this.re_time*1000)
  }
}
