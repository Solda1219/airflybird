import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../../service/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-device-index',
  templateUrl: './device-index.component.html',
  styleUrls: ['./device-index.component.scss']
})
export class DeviceIndexComponent implements OnInit {
  loading;
  _opened = true;
  tab = 'All';
  treeItem;
  @ViewChild('GPSmodal') public GPSmodal: ModalDirective;
  @ViewChild('commandmodal') public commandmodal: ModalDirective;
  cmditem;
  cmdtype=0;
  event_type=["SOS","CRASH","VIBRATE","OVERSPEED","RAPIDACC","RAPIDDEC","RAPIDTURN","DRIVE"];
  //0-DVR gateway service address
  //1-Upload address of the file storage service
  //2-RTMP live streaming service address
  //3-SMS authentication
  //4-Start/Stop streaming
  //5-Positioning packet interval time setting
  //6-Set the media volume of the device
  //7-Query the status of the device
  //8-Event video upload mode
  //9-Query event video upload mode
  //10-Set overspeed alarm
  //11-Query overspeed alarm parameters
  //12-Overtime fatigue driving
  //13-The same event trigger interval
  //14-Query event trigger interval
  //15-Remotely cut off oil and electricity
  //16-Query the status of the relay
  selectedItem;
  gpsInfo;
  heartbeat;
  raw;
  formGroup:FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) {
  }
  ngOnInit() {
    this.formSet();
  }
  formSet() {
    if(this.cmdtype==0){
      this.formGroup = this._formBuilder.group({
        pre:['Server,0'],
        ip:['',Validators.required],
        port:['',Validators.required],
      })
    }
    else if(this.cmdtype==1){
      // UPLOAD,http://117.21.178.59:23010/upload
      this.formGroup = this._formBuilder.group({
        pre:['UPLOAD,http://'],
        ip:['',Validators.required],
        port:['',Validators.required],
        end:['/upload']
      })
    }
    else if(this.cmdtype==2){
      // RSERVICE,117.21.178.59/live
      this.formGroup = this._formBuilder.group({
        pre:['RSERVICE,'],
        address:['',Validators.required],
      })
    }
    else if(this.cmdtype==3){
      // RLOGIN,nick,123456
      this.formGroup = this._formBuilder.group({
        pre:['RLOGIN,'],
        account:['',Validators.required],
        password:['',Validators.required],
      })
    }
    else if(this.cmdtype==4){
      // 1-RTMP,ON,OUT,0-RTMP,OFF,OUT
      this.formGroup = this._formBuilder.group({
        start:['RTMP,ON,OUT,'],
        stop:['RTMP,OFF,OUT'],
        val:[1],
      })
    }
    else if(this.cmdtype==5){
      // TIMER,5
      this.formGroup = this._formBuilder.group({
        pre:['TIMER,'],
        val:[5,Validators.required],
      })
    }
    else if(this.cmdtype==6){
      // VOLUME,<A> A = volume level (0 is off, 1 is low, 2 is medium, 3 is high), the default is 2;
      this.formGroup = this._formBuilder.group({
        pre:['VOLUME,'],
        val:[2,Validators.required],
      })
    }
    else if(this.cmdtype==7){
      // 6. Query the status of the device (1) Status query STATUS (2) Parameter query PARAM
      this.formGroup = this._formBuilder.group({
        val:['STATUS',Validators.required],
      })
    }
    else if(this.cmdtype==8){
      // (1) Event video upload mode
      //UPLOADSW,<A>,<B>
      //This mode represents whether the device needs to actively record the event video and upload it after the event is triggered. If it is turned off, the device will not record the event video after the event is triggered;
      //A=Event type (different types of event codes)
      // SOS=Help button
      // CRASH = driving collision
      // VIBRATE=Parking vibration
      // OVERSPEED=Overspeed
      // RAPIDACC=Rapid acceleration
      // RAPIDDEC=Rapid deceleration
      // RAPIDTURN=RAPIDTURN
      // DRIVE=Overtime fatigue driving
      // B=Whether to actively upload event video (ON=open, OFF=close)
      this.formGroup = this._formBuilder.group({
        pre:['UPLOADDSW,'],
        A:['SOS',Validators.required],
        B:['ON',Validators.required],
      })
    }
    else if(this.cmdtype==9){
      // (2) Query event video upload mode
      // UPLOADSW,<A>
      // A=Type (see the instruction above for the type)
      this.formGroup = this._formBuilder.group({
        pre:['UPLOADDSW,'],
        A:['SOS',Validators.required],
      })
    }
    else if(this.cmdtype==10){
      // (1) Set overspeed alarm
      // SPEED, <A>, [T], [M]
      // A=ON/OFF; ON: enable overspeed alarm; OFF: disable overspeed alarm
      // T=5-600s; time range; default value: 20s
      // M=1-255km/h; overspeed threshold; default value: 80km/h
      this.formGroup = this._formBuilder.group({
        pre:['SPEED,'],
        A:['ON',Validators.required],
        T:[20,[Validators.required,Validators.min(5),Validators.max(600)]],
        M:[80,[Validators.required,Validators.min(1),Validators.max(255)]],
      })
    }
    else if(this.cmdtype==11){
      this.formGroup = this._formBuilder.group({
        pre:['SPEED'],
      })
    }
    else if(this.cmdtype==12){
      // FATIGUE,<A>, time1,time2
      // <A> ：ON/OFF
      // time1 is the fatigue driving time, and time2 is the time interval for reporting the alarm when the fatigue driving time is reached
      this.formGroup = this._formBuilder.group({
        pre:['FATIGUE,'],
        A:['ON'],
        time1:[10,Validators.required],
        time2:[15,Validators.required],
      })
    }
    else if(this.cmdtype==13){
      // FILTER,<A>,<B>
      // This interval means that after the trigger event is successful, the same event will not be triggered again within this interval;
      // A=Event type (different types of codes)
      // SOS=Help button
      // CRASH = driving collision
      // VIBRATE=Parking vibration
      // OVERSPEED=Overspeed
      // RAPIDACC=Rapid acceleration
      // RAPIDDEC=Rapid deceleration
      // RAPIDTURN=RAPIDTURN
      // DRIVE=Overtime fatigue driving
      // B=Interval time (1~60, in minutes)
      this.formGroup = this._formBuilder.group({
        pre:['FILTER,'],
        A:['SOS'],
        B:[1,[Validators.required,Validators.min(1),Validators.max(60)]],
      })
    }
    else if(this.cmdtype==14){
      // FILTER,<A>
      // A=Type (see the instruction above for the type)
      this.formGroup = this._formBuilder.group({
        pre:['FILTER,'],
        A:['SOS'],
      })
    }
    else if(this.cmdtype==15){
      // RELAY,<A>
      // A=0/1; 0: connect oil and electricity; 1: disconnect oil and electricity; default value: 0
      this.formGroup = this._formBuilder.group({
        pre:['RELAY,'],
        A:[0],
      })
    }
    else if(this.cmdtype==16){
      // RELAY
      this.formGroup = this._formBuilder.group({
        pre:['RELAY,'],
      })
    }
  }
  async sendCommand(){
    if(this.formGroup.invalid){
      this.userService.errorMessage('Please input fields correctly.');
      return;
    }
    //set formdata
    let commanddata = '';
    if(this.cmdtype==0){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre + ',' + data.ip + ',' + data.port;
    }
    if(this.cmdtype==1){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre + data.ip + ':' + data.port+data.end;
    }
    if(this.cmdtype==2){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre + data.address;
    }
    if(this.cmdtype==3){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre + data.account + ',' +data.password;
    }
    if(this.cmdtype==4){
      const data = this.formGroup.value;
      commanddata = data.val==0?data.stop:data.start;
    }
    if(this.cmdtype==5){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre + data.val;
    }
    if(this.cmdtype==6){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre + data.val;
    }
    if(this.cmdtype==7){
      const data = this.formGroup.value;
      commanddata = commanddata + data.val;
    }
    if(this.cmdtype==8){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre + data.A + ',' + data.B;
    }
    if(this.cmdtype==9){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre + data.A;
    }
    if(this.cmdtype==10){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre + data.A + ',' + data.T + ',' + data.M;
    }
    if(this.cmdtype==11){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre;
    }
    if(this.cmdtype==12){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre +data.A+','+data.time1+','+data.time2;
    }
    if(this.cmdtype==13){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre +data.A+','+data.B;
    }
    if(this.cmdtype==14){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre +data.A;
    }
    if(this.cmdtype==15){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre +data.A;
    }
    if(this.cmdtype==16){
      const data = this.formGroup.value;
      commanddata = commanddata + data.pre;
    }
    try{
      const res = await this.userService.postRequest('_api/device/sendCommand',{imei:this.cmditem['device_imei'],cmd:commanddata}).toPromise();
      this.userService.handleSuccess(res['message']);
    }catch(err){
      this.userService.handleError(err)
    }
  }
  tabChange(value) {
    this.tab = value
  }
  treeViewChange(value) {
    this.treeItem = value;
  }
  async showGPS(event) {
    this.selectedItem=event;
    await this.setGPS();
    this.GPSmodal.show();
  }
  showCmdModal(item){
    this.cmditem = item;
    this.commandmodal.show();
  }
  async setGPS(){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/device/gpsInfo', this.selectedItem).toPromise()
      this.heartbeat = res['heartbeat'];
      this.gpsInfo = res['gpsdata'];
      this.raw = JSON.stringify(res['raw']);
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
}

