import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-detect-status',
  templateUrl: './detect-status.component.html',
  styleUrls: ['./detect-status.component.scss']
})
export class DetectStatusComponent implements OnInit {
  _opened = true;
  treeItem = [];
  loading = false;
  item_src = [];
  item = [];
  gpu = [];
  info;
  rotate = false;
  formGroup: FormGroup;
  selectedItems = [];
  cycle_index;
  interval;
  constructor(
    public cf: CommonFunctionService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
  ) {
  }
  async ngOnInit() {
    this.reset();
    await this.getGpu();
    await this.refresh();
  }
  ngOnDestroy() {
    if(this.interval) clearInterval(this.interval);
  }
  treeViewChange(value) {
    this.treeItem = value;
    this.item = this.item_src.filter(x=>this.treeItem.indexOf(x.vehicle_id)!=-1)
  }
  reset() {
    const today = new Date();
    const date_from = this.cf.getDateStringYYYYMMDD(today)
    const date_to = this.cf.getDateStringYYYYMMDD(today)
    this.formGroup = this._formBuilder.group({
      dateDefine: [0],//0-today,1-this week, 2-this month,9-history
      re_time: [5],
      filter: [0],//0-All,1-Downloaded,2-Undownloaded,3-Detecting,4-Detected
      imei:[],
      startdate: [date_from,Validators.required],
      enddate: [date_to,Validators.required],
      gpu:[0]
    });
    // this.formGroup.controls['startdate'].disable()
    // this.formGroup.controls['enddate'].disable()
  }
  dateDefine(){
    const define = this.formGroup.value['dateDefine'];
    if(define==10){
      // this.formGroup.controls['startdate'].enable()
      // this.formGroup.controls['enddate'].enable()
    }else{
      const range = this.cf.getDateRange(define)
      this.formGroup.patchValue(
        {
          startdate:this.cf.getDateStringYYYYMMDD(range.from),
          enddate:this.cf.getDateStringYYYYMMDD(range.to),
        }
      );
      // this.formGroup.controls['startdate'].disable()
      // this.formGroup.controls['enddate'].disable()
    }
  }
  async refresh(){
    this.cycle_index = undefined;
    this.loading = true;
    if(this.formGroup.value['re_time']<3) this.formGroup.patchValue({re_time:3})
    await this.search(true);
    this.startInterval();
    this.loading = false;
  }
  async getGpu(){
    try{
     const item = await this.userService.postRequest('_api/equipment/gpu/getGPU').toPromise();
     this.gpu = item['result']
    }catch(err){
    //  this.userService.handleError(err)
   }
   }
  async search(message_show = false){
    const data = JSON.parse(JSON.stringify(this.formGroup.value));
    data['startdate']=data['startdate']+' 00:00:00';
    data['enddate']=data['enddate'] +' 23:59:59';
    if(data['dateDefine']==9) data['history_tag'] = true
    else data['history_tag'] = false
    try{
      const item = await this.userService.postRequest('_api/detect/status/getstatus',data).toPromise();
      this.item_src = item['result'];
      if(this.item_src.length==0 && message_show) this.userService.errorMessage('No video exist.')
      if(this.item_src.length>0) {
        this.rotate = true;
      }
      this.item = JSON.parse(JSON.stringify(this.item_src))
      this.info = item['info']
    }catch(err){
      if(message_show) this.userService.handleError(err)
    }
  }
  startAndStop(){
    if(this.item.length==0) {
      this.rotate = false;
    }else{
      if(this.rotate==false){
        this.startInterval();
        this.rotate = true;
      }else{
        if(this.interval) clearInterval(this.interval);
        this.rotate = false;
      }
    }
  }
  startInterval(){
    if(this.interval) clearInterval(this.interval);
    this.interval = setInterval(async ()=>{
     await this.search();
     this.cycle_index = Date.now();
    },this.formGroup.value['re_time']*1000)
  }
  async del(item){
    try{
      const res = await this.userService.postRequest('_api/video/vod/deletevod',{data:item}).toPromise();
      this.toastr.success(res['message'])
      this.search()
     }catch(err){
      this.userService.handleError(err)
     }
  }
  //handle error
  handleError(err) {
    if (err.status == 504) this.toastr.error("Server is not responsing.")
    else err.error.message ? this.toastr.error(err.error.message) : this.toastr.error('something went wrong')
  }
}
