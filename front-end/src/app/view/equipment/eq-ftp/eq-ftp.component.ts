import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ExcelService } from '../../../function/excel.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-eq-ftp',
  templateUrl: './eq-ftp.component.html',
  styleUrls: ['./eq-ftp.component.scss']
})
export class EqFtpComponent implements OnInit {
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
      const res = await this.userService.postRequest('_api/equipment/ftp/getFTP').toPromise()
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
      const res = await this.userService.postRequest('_api/equipment/ftp/editFTP',this.formGroup.value).toPromise()
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
      const res = await this.userService.postRequest('_api/equipment/ftp/editFTP',item).toPromise()
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
      const res = await this.userService.postRequest('_api/equipment/ftp/createFTP',this.formGroup.value).toPromise()
      this.userService.handleSuccess(res['message']);
      this.formGroup.patchValue({
        server_id: String(new Date().getTime())
      });
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;  
  }
  async del(item){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/equipment/ftp/delFTP',item).toPromise()
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
      this.formGroup = this._formBuilder.group({
        id: [''],
        server_id: [String(new Date().getTime()),Validators.required],
        server_name: ['',Validators.required],
        protocol: ['',Validators.required],
        ip_address: ['',Validators.required],
        port: ['',Validators.required],
        encryption: ['',Validators.required],
        login_type: ['',Validators.required],
        user_name: ['',Validators.required],
        password: ['',Validators.required],
        description: [''],
      });
    }else{
      this.formGroup = this._formBuilder.group({
        id: [item.id],
        server_id: [item.server_id,Validators.required],
        server_name: [item.server_name,Validators.required],
        protocol: [item.protocol,Validators.required],
        ip_address: [item.ip_address,Validators.required],
        port: [item.port,Validators.required],
        encryption: [item.encryption,Validators.required],
        login_type: [item.login_type,Validators.required],
        user_name: [item.user_name,Validators.required],
        password: [item.password,Validators.required],
        description: [item.description],
      });
    }
  }
}

