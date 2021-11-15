import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-video-vod',
  templateUrl: './video-vod.component.html',
  styleUrls: ['./video-vod.component.scss']
})
export class VideoVodComponent implements OnInit {
  _opened = true;
  treeItem = [];
  loading = false;
  item_src = [];
  item = [];
  formGroup: FormGroup;
  selectedItems = [];
  @ViewChild('warningModal') public warningModal: ModalDirective;
  constructor(
    public cf: CommonFunctionService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
  ) {
  }
  async ngOnInit() {
    this.reset();
    await this.search();
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
      startdate: [date_from,Validators.required],
      enddate: [date_to,Validators.required],
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
  async search(){ 
   const data = JSON.parse(JSON.stringify(this.formGroup.value));
   data['startdate']=data['startdate']+' 00:00:00';
   data['enddate']=data['enddate'] +' 23:59:59';
   if(data['dateDefine']==9) data['history_tag'] = true
   else data['history_tag'] = false
   this.loading = true;
   try{
    const item = await this.userService.postRequest('_api/video/vod/getvod',data).toPromise();
    this.item_src = item['result']
    this.item = JSON.parse(JSON.stringify(this.item_src))
   }catch(err){
    this.userService.handleError(err)
   }
   this.loading = false;
  }
  async del(item){
    const history_tag = this.formGroup.value['dateDefine']==9? true:false;
    try{
      const res = await this.userService.postRequest('_api/video/vod/deletevod',{data:item,history_tag:history_tag}).toPromise();
      this.userService.handleSuccess(res['message'])
      this.search()
     }catch(err){
      this.userService.handleError(err)
    }
  }
  delSeleted(){
    if(this.selectedItems.length==0) {
      this.userService.errorMessage('Please select items to delete.')
      return
    }
    this.warningModal.show()
  }
  deleteAll(){
    this.del(this.selectedItems)
  }
}
