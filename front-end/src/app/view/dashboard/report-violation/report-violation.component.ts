import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataTableModule } from '../../../module/Datatable/DataTableModule';
import { ExcelService } from '../../../function/excel.service';
import { ZipFromUrlService } from '../../../module/zipFromUrl.service';

@Component({
  selector: 'app-report-violation',
  templateUrl: './report-violation.component.html',
  styleUrls: ['./report-violation.component.scss']
})
export class ReportViolationComponent implements OnInit {
  loading = false;
  formGroup: FormGroup;
  agents = [];
  item = [];
  type = [];
  selected_items= [];
  tbHeader = ['ByCamera','Group name', 'Vehicle', 'Type','Datetime', 'Image number', 'Address'];
  tbCol = ['camera_id','group_name', 'vehicle_number', 'type_name','datetime','image_number','address'];
  @ViewChild('downloadmodal') public downloadmodal: ModalDirective;
  downloadinfo={
    url:'',
    size:0,
  };
  constructor(
    public cf: CommonFunctionService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private excel: ExcelService,
    private zipDownLoad: ZipFromUrlService,
  ) { }

  ngOnInit(): void {
    this.getType();
    this.formSet();
    // this.getAgent();
  }
  async getType(){
    try{
      const res = await this.userService.postRequest('_api/report/violation/type').toPromise();
      this.type = res['result'];
    }catch{

    }
  }
  formSet() {
    const today = new Date();
    const date_from = this.cf.getDateStringYYYYMMDD(today)
    const date_to = this.cf.getDateStringYYYYMMDD(today)
    this.formGroup = this._formBuilder.group({
      dateDefine: [0],//0-today,1-this week, 2-this month,9-history
      type:['all'],
      vehicle:[],
      camera:[],
      startdate: [date_from,Validators.required],
      enddate: [date_to,Validators.required],
      download:[0],
    });
    // this.formGroup.controls['startdate'].disable()
    // this.formGroup.controls['enddate'].disable()
  }
  async search(){
    const history_tag = this.formGroup.value['dateDefine']==9? true:false;
    const data = JSON.parse(JSON.stringify(this.formGroup.value));
    const vehicleline = this.formGroup.value['vehicle']
    if (vehicleline) {
      const arr = String(vehicleline).split(/\n/);
      data['vehicle'] = arr;
    }
    const cameraline = this.formGroup.value['camera']
    if (cameraline) {
      const arr = String(cameraline).split(/\n/);
      data['camera'] = arr;
    }
    data['startdate']=data['startdate']+' 00:00:00';
    data['enddate']=data['enddate'] +' 23:59:59';
    data['history_tag'] = history_tag;
    this.loading = true;
    try{
      const res = await this.userService.postRequest('_api/report/violation/get',data).toPromise()
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
  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
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
    const title = 'Report of violation';
    const subtitle = ['date',''+this.formGroup.value['startdate']+'/'+this.formGroup.value['enddate']];
    this.excel.exportAsExcelFile('TripOverview'+'_'+new Date().getTime(),this.tbHeader,tbData,title,subtitle);
    this.downloadrecord(this.selected_items,0,'Export to excel');
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
  async downLoad() {
    if(this.selected_items.length==0) {
      this.toastr.error('Please select items to download.');
      return
    }
    this.zipDownLoad.createSnapImageZip(this.selected_items,'violation_trip_'+new Date().getTime());
    this.downloadrecord(this.selected_items,1,'Download files');
  }
  async copyLoadURL() {
    if(this.selected_items.length==0) {
      this.toastr.error('Please select items to download.');
      return
    }
    try{
      const res = await this.userService.postRequest('_api/report/violation/copydownloadurl',this.selected_items).toPromise()
      this.downloadinfo.url = res['name'];
      this.downloadmodal.show();
      this.downloadrecord(this.selected_items,2,'Copy download url');
    }catch(err){
      this.userService.handleError(err)
    }
  }
  async downloadrecord(items,op_id=0,op_name=''){//op_id-- -0-export to excel 1-download files 2-copy download url
    const history_tag = this.formGroup.value['dateDefine']==9? true:false;
    try{
      const res = await this.userService.postRequest('_api/report/violation/recorddownload',{data:items,op_id:op_id,op_name:op_name,history_tag:history_tag}).toPromise();
    }catch(err){
      this.userService.handleError(err)
    }
  }
}
