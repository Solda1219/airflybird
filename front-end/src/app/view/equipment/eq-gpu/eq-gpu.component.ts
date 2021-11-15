import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ExcelService } from '../../../function/excel.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-eq-gpu',
  templateUrl: './eq-gpu.component.html',
  styleUrls: ['./eq-gpu.component.scss']
})
export class EqGpuComponent implements OnInit {
  loading;
  item = [];
  tableList = [];
  param = {
    expire: 0,
    install: 0
  };
  //form
  formGroup:FormGroup;
  event_type = {
    one:true,
    two:false
  }
  //modal
  protocol = [{id:0, name:'FTP-File Transfer Protocol'},{id:1, name:'SFTP-SSH File Transfer Protocol'},{id:2, name:'Tardigrade-Decentralized Cloud Storage'}];
  encryption = [{id:0, name:'Only use plain FTP(insecure)'},{id:1, name:'Require explicit FTP over TLS'},{id:2, name:'Require implicit FTP over TLS'},{id:3, name:'Only use plain FTP(insecure)'}];
  loginType = [{id:0, name:'Anonymous'},{id:1, name:'Normal'},{id:2, name:'Ask for password'},{id:3,name:'Interactive'}];

  @ViewChild('createModal') createModal: ModalDirective;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private excel: ExcelService
  ) { }

  async ngOnInit() {
    this.formSet()
    this.search()
  }
  async search() {
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/equipment/gpu/getGPU').toPromise()
      this.item = res['result'];
      this.setTableList();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async edit(){
    if(!this.formGroup.valid) {
      this.userService.errorMessage('Please input fields correctly.')
      return
    }
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/equipment/gpu/editGPU',this.formGroup.value).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;  
  }
  async editList(item){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/equipment/gpu/editGPU',item).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;  
  }
  async create(){
    if(!this.formGroup.valid) {
      this.userService.errorMessage('Please input fields correctly.')
      return
    }
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/equipment/gpu/createGPU',this.formGroup.value).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;  
  }
  async del(item){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/equipment/gpu/delGPU',item).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;  
  }
  //modal
  showCreateModal(){
    this.formSet();
    this.createModal.show();
  }
  showEditModal(item){
    this.formSet(item);
    this.createModal.show();
  }
  //table
  setTableList() {
    let src = JSON.parse(JSON.stringify(this.item));
    this.tableList = src
  }
  //excel
  exportToExcel() {
    const tbData = [];
    const tbCol = [];
    const tbHeader = [];
    for (let i = 0; i < this.item.length; i++) {//set table body
      const it_r = [];
      for (let k = 0; k < tbCol.length; k++) it_r.push(this.item[i][tbCol[k]])
      tbData.push(it_r);
    }
    this.excel.exportAsExcelFile('Device' + '_' + new Date().getTime(), tbHeader, tbData);
  }
  //form(edit and create)
  formSet(item=null) {
    if(item==null){
      this.event_type = {one:true,two:false}
      this.formGroup = this._formBuilder.group({
        id: [''],
        code: ['',Validators.required],
        gpu_address: ['',Validators.required],
        gpu_location: ['',Validators.required],
        description: [''],
        video_url: ['',Validators.required],
        image_url: ['',Validators.required],
        media_type: ['1',Validators.required],
        event_type: ['1',Validators.required],
        frame_frequency: ['',Validators.required],
        frame_width: ['',Validators.required],
        frame_height: ['',Validators.required],
        max_record_frame: ['',Validators.required],
      });
    }else{
      this.event_type.one = String(item.event_type).indexOf('1')!=-1?true:false;
      this.event_type.two = String(item.event_type).indexOf('2')!=-1?true:false
      this.formGroup = this._formBuilder.group({
        id: [item.id],
        code: [item.code,Validators.required],
        gpu_address: [item.gpu_address,Validators.required],
        gpu_location: [item.gpu_location,Validators.required],
        description: [item.description],
        video_url: [item.video_url,Validators.required],
        image_url: [item.image_url,Validators.required],
        media_type: [item.media_type,Validators.required],
        event_type: [item.event_type,Validators.required],
        frame_frequency: [item.frame_frequency,Validators.required],
        status: [item.status],
        frame_width: [item.frame_width,Validators.required],
        frame_height: [item.frame_height,Validators.required],
        max_record_frame: [item.max_record_frame,Validators.required],
      });
    }
  }
  checkedIf(value,key){
    if(String(value).indexOf(key)!=-1) return true;
    else return false
  }
  changeEventCheck(){
    let str = '';
    if(this.event_type.one) {
      str+= '1';
      if(this.event_type.two)
      str+=',2';
    }
    else{
      if(this.event_type.two)
      str+='2';
    }
    this.formGroup.patchValue({
      event_type:str
    })
  }
}

