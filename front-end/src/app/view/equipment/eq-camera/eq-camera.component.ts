import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ExcelService } from '../../../function/excel.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var $: any
@Component({
  selector: 'app-eq-camera',
  templateUrl: './eq-camera.component.html',
  styleUrls: ['./eq-camera.component.scss']
})
export class EqCameraComponent implements OnInit {
  loading;
  item = [];
  tableList = [];
  param = {
    expire: 0,
    install: 0
  };
  //form
  formGroup:FormGroup;
  //modal
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
      const res = await this.userService.postRequest('_api/equipment/camera/getCameras').toPromise()
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
      const res = await this.userService.postRequest('_api/equipment/camera/editCameras',this.formGroup.value).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;  
  }
  async resetTerm(item){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/equipment/camera/resetTermOfCameras',item).toPromise()
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
      const res = await this.userService.postRequest('_api/equipment/camera/createCameras',this.formGroup.value).toPromise()
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
      const res = await this.userService.postRequest('_api/equipment/camera/delCameras',item).toPromise()
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
    //filter by expiration
    const exp = this.param.expire;
    const today = new Date().getTime();
    if (exp == 2) {
      const i_a = []
      const expSoonDate = 3;
      for (let i = 0; i < src.length; i++) {
        const { end } = src[i];
        const endTime = new Date(end).getTime()
        const delta = endTime - today;
        if (delta < 3600 * 24 * 1000 * expSoonDate && delta > 0) i_a.push(src[i])
      }
      src = i_a
    }
    else if (exp == 1) {
      const i_a = []
      for (let i = 0; i < src.length; i++) {
        const { end } = src[i];
        const endTime = new Date(end).getTime()
        const delta = endTime - today;
        if (delta < 0) i_a.push(src[i])
      }
      src = i_a
    }
    else if (exp == 3) {
      const i_a = []
      for (let i = 0; i < src.length; i++) {
        const { end } = src[i];
        const endTime = new Date(end).getTime()
        const delta = endTime - today;
        if (delta > 0) i_a.push(src[i])
      }
      src = i_a
    }
    //filter by installation
    const active = this.param.install
    if (active == 1) {
      const i_a = [];
      for (let i = 0; i < src.length; i++) {
        const { install_date } = src[i];
        if ( install_date ) i_a.push(src[i])
      }
      src = i_a
    }
    else if(active == 2){
      const i_a = [];
      for (let i = 0; i < src.length; i++) {
        const { install_date } = src[i];
        if ( !install_date ) i_a.push(src[i])
      }
      src = i_a
    }
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
      this.formGroup = this._formBuilder.group({
        id: [''],
        camera_id: ['',Validators.required],
        camera_type: ['',Validators.required],
        device_imei: ['',Validators.required],
        manufacturer: [''],
        production_date: [this.cf.getDateStringYYYYMMDD(Date.now()),Validators.required],
        storage_date: [this.cf.getDateStringYYYYMMDD(Date.now()),Validators.required],
        parameter: [''],
      });
    }else{
      this.formGroup = this._formBuilder.group({
        id: [item.id],
        camera_id: [item.camera_id,Validators.required],
        camera_type: [item.camera_type,Validators.required],
        device_imei: [item.device_imei,Validators.required],
        manufacturer: [item.manufacturer],
        production_date: [item.production_date,Validators.required],
        storage_date: [item.storage_date,Validators.required],
        parameter: [item.parameter],
      });
    }
  }
}
