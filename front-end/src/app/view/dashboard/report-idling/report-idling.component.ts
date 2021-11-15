import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataTableModule } from '../../../module/Datatable/DataTableModule';
import { ExcelService } from '../../../function/excel.service';
@Component({
  selector: 'app-report-idling',
  templateUrl: './report-idling.component.html',
  styleUrls: ['./report-idling.component.scss']
})
export class ReportIdlingComponent implements OnInit {
  loading = false;
  formGroup: FormGroup;
  agents = [];
  item = [];
  selected_items= [];
  tbHeader = ['Device Name', 'IMEI', 'Model','Status','StartTime','Endtime', 'Address', "Duration"];
  tbCol = ['device_name', 'imei', 'model','status','start_time','end_time', 'start_address', 'duration'];
  constructor(
    public cf: CommonFunctionService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private excel: ExcelService,
  ) { }

  ngOnInit(): void {
    this.formSet();
    this.getAgent();
  }
  formSet() {
    const today = new Date();
    const date_from = this.cf.getDateStringYYYYMMDD(today)
    const date_to = this.cf.getDateStringYYYYMMDD(today)
    this.formGroup = this._formBuilder.group({
      dateDefine: [0],//0-today,1-this week, 2-this month,9-history
      agent:['all'],
      mode:['overview'],
      imei:[],
      startdate: [date_from,Validators.required],
      enddate: [date_to,Validators.required],
    });
    // this.formGroup.controls['startdate'].disable()
    // this.formGroup.controls['enddate'].disable()
  }
  async search(){
    const history_tag = this.formGroup.value['dateDefine']==9? true:false;
    const data = JSON.parse(JSON.stringify(this.formGroup.value));
    const imeiline = this.formGroup.value['imei']
    if (imeiline) {
      const arr = String(imeiline).split(/\n/);
      data['imei'] = arr;
    }
    data['startdate']=data['startdate']+' 00:00:00';
    data['enddate']=data['enddate'] +' 23:59:59';
    data['history_tag'] = history_tag;
    this.loading = true;
    try{
      const res = await this.userService.postRequest('_api/report/idling/get',data).toPromise()
      this.item = res['result'];
      if(this.item.length==0) this.userService.errorMessage('No data exist.')
     }catch(err){
      this.userService.handleError(err);
    }
    this.loading = false; 
  }
  async getAgent(){
    try{
      const res = await this.userService.postRequest('_api/account/agent/getAgents').toPromise()
      this.agents = res['result'];
     }catch(err){
     }
  }
  exportToExcel(){
    if(this.selected_items.length==0) {
      this.toastr.error('Please select items to export.');
      return
    }
    const tbData = [];
    for(let i = 0; i < this.selected_items.length; i++){
        const it_r = [];
        for(let k = 0; k < this.tbCol.length; k++) it_r.push(this.selected_items[i][this.tbCol[k]])
        tbData.push(it_r);
    }
    const title = 'Report of idling';
    const subtitle = ['date',''+this.formGroup.value['startdate']+'/'+this.formGroup.value['enddate']];
    this.excel.exportAsExcelFile('ReportIdling'+'_'+new Date().getTime(),this.tbHeader,tbData,title,subtitle);
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
}