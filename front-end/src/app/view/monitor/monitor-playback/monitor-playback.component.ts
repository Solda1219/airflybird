import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MapCalculateService } from '../../../map-component/map-calculate.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
@Component({
  selector: 'app-monitor-playback',
  templateUrl: './monitor-playback.component.html',
  styleUrls: ['./monitor-playback.component.scss'],
  providers: [MapCalculateService]
})
export class MonitorPlaybackComponent implements OnInit {
  _opened = true;
  treeItem;
  loading = false;
  date_status = false;
  formGroup: FormGroup;
  param = {imei:''};
  gpsdata = [];
  vehicleInfo;
  interval;
  re_time = 3;
  //address
  startAddr = '';
  endAddr = '';
  //video
  video = [];
  //date
  datelist = [];
  //slider
  slider = {
   max:0,
   min:0,
   step:1,
   value:0
  };
  sliderFast = {
    max:2,
    min:-2,
    step:1,
    value:0
   };
  sliderStart = false;
  sliderParam = {
    speed:'',
    totalMile:'',
    time:''
  }
  //modal
  @ViewChild('snapVideoModal') public snapVideoModal: ModalDirective;
  @ViewChild('snapPlayer') snapPlayer: ElementRef;
  snap_src;
  constructor(
    public cf: CommonFunctionService,
    private route: ActivatedRoute,
    private userService : UserService,
    private _formBuilder: FormBuilder,
    private core_map : MapCalculateService
  ) { }
  async ngOnInit() {
    this.loading = true;
    this.param.imei = this.route.snapshot.params.imei;
    this.formSet()
    await this.getVehicleInfo();
    this.loading = false;
    await this.getAvailableDate();
  }
  async getVehicleInfo(){
    try{
      const res = await this.userService.postRequest('_api/monitor/getVehicleInfo',this.formGroup.value).toPromise();
      this.vehicleInfo = res['result'];
    }catch(err){
      console.log(err)
    }
  }
  async getAvailableDate(){
    this.date_status = false;
    try{
      const res = await this.userService.postRequest('_api/monitor/playback/date',this.formGroup.value).toPromise();
      this.datelist = res['result'];
      if(this.datelist.length>0){
        this.changeAbleDate(this.datelist[this.datelist.length-1])
      }
    }catch(err){
      console.log(err)
    }
    this.date_status = true;
  }
  async getInfo(){
    if(this.formGroup.invalid) {
      this.userService.errorMessage('Please input fields correctly');
      return
    }
    this.loading = true;
    const today_check = this.checkIfToday();
    if(!today_check) return
    const data = JSON.parse(JSON.stringify(this.formGroup.value));
    try{
      const res = await this.userService.postRequest('_api/monitor/playback/getInfo',data).toPromise();
      this.gpsdata = [];
      this.gpsdata = res['gpsdata'];
      this.startAddr = res['address'].start;
      this.endAddr = res['address'].end;
      this.video = res['video'];
      if(this.gpsdata.length==0) this.userService.errorMessage('No tracks');
      this.preset();
    }catch(err){
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  changeDate(){
    const curdate = this.formGroup.value['date'];
    const date_from =this.cf.getDateStringYYYYMMDDHHMMSS(new Date(curdate).setHours(0,0,0,0));
    const date_to =this.cf.getDateStringYYYYMMDDHHMMSS(new Date(curdate).setHours(23,59,59,999));
    this.formGroup.patchValue({
      start:date_from,
      end:date_to
    });
  }
  changeAbleDate(day){
    const date_from =this.cf.getDateStringYYYYMMDDHHMMSS(new Date(day).setHours(0,0,0,0));
    const date_to =this.cf.getDateStringYYYYMMDDHHMMSS(new Date(day).setHours(23,59,59,999));
    this.formGroup.patchValue({
      date:new Date(day).toISOString(),
      start:date_from,
      end:date_to
    });
  }
  formSet(){
    const date_from =this.cf.getDateStringYYYYMMDDHHMMSS(new Date().setHours(0,0,0,0));
    const date_to =this.cf.getDateStringYYYYMMDDHHMMSS(new Date());
    this.formGroup = this._formBuilder.group({
      imei:[this.param.imei],
      date:[''],
      start:['', [Validators.required,Validators.pattern(this.cf.regex_yyyymmddhhmmss)]],
      end:['', [Validators.required,Validators.pattern(this.cf.regex_yyyymmddhhmmss)]],
      history_tag:[false]
    })
  }
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = this.cf.getDateStringMMDDYYYY(cellDate);
      for(let i = 0 ; i < this.datelist.length; i++){
        const e_date = this.cf.getDateStringMMDDYYYY(this.datelist[i]);
        if(date == e_date) return 'example-custom-date-class';
      }
      return '';
    }
    return '';
  }
  checkIfToday() {
    const picked = this.formGroup.value['date'];
    if(!picked){
      this.userService.errorMessage('Please choose date');
      return false;
    }
    const startOfDay = new Date(new Date(picked).setHours(0,0,0,0)).getTime();
    const endOfDay = new Date(new Date(picked).setHours(23,59,59,999)).getTime();
    const startTime = new Date(this.formGroup.value['start']).getTime();
    const endTime = new Date(this.formGroup.value['end']).getTime();
    if(startTime>=endTime) {
      this.userService.errorMessage('Start Time must be over than End time.');
      return false;
    }
    if(startOfDay > startTime || endTime > endOfDay) {
      this.userService.errorMessage('Please set date as one day value');
      return false;
    }
    return true;
  }
  ngOnDestroy() {
    if(this.interval) clearInterval(this.interval);
  }
  stopAndStart(){
    if(!this.sliderStart&&this.gpsdata.length>0){
      this.sliderStart = true;
      this.startInterval()
    }else{
      this.sliderStart = false;
      clearInterval(this.interval)
    }
  }
  preset(){
    this.slider = {
      min:0,
      step:1,
      max:this.gpsdata.length-1,
      value:0,
    }
    this.sliderParam.speed = '';
    this.sliderParam.totalMile = '';
    this.sliderParam.time = '';
    clearInterval(this.interval)
  }
  startInterval(){
    clearInterval(this.interval);
    this.playerStart();
    this.interval = setInterval(()=>{
        this.playerStart();
    },(this.re_time-this.sliderFast.value)*1000)
  }
  playerStart(){
    if(this.slider.value > this.slider.max) return;
    this.sliderParam.speed = this.gpsdata[this.slider.value].gpsSpeed+'km/h';
    this.sliderParam.time = this.gpsdata[this.slider.value].gpsTime;
    const totalMile = this.core_map.calcTotalMile(this.gpsdata,this.slider.value);
    this.sliderParam.totalMile = (totalMile<100?Math.floor(totalMile*1000)/1000:Math.floor(totalMile*10)/10) +'km';
    this.slider.value++;
  }
  //modal
  showSnapVideo(item){
    this.snapVideoModal.show();
    this.snap_src = item;
    this.snapPlayer.nativeElement.src = '_public/video/'+item.video_name;
    this.snapPlayer.nativeElement.load();
    this.snapPlayer.nativeElement.play();
  }
  stop(){
    setTimeout(()=>{
      this.snapPlayer.nativeElement.pause();
      this.snap_src = undefined;
    },300)
  }
}
