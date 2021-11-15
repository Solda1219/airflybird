import { Component, OnInit, Input, OnChanges, SimpleChange, ViewChild, Output,EventEmitter } from '@angular/core';
import { CommonFunctionService } from '../../../../function/commonFunction.service';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { UserService } from '../../../../service/user.service';
import { ExcelService } from '../../../../function/excel.service';
//table
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
  //loading
  loading = false;
  user;
  nickname="";
  role="";
  phone="";
  qrcode="www.aidetecting.com";
  info = {
    total_camera:0,
    total_car:0,
    online_camera:0,
    offline_camera:0,
    exp_car:0,
    exps_car:0,
    total_video:0,
    vio_video:0,
    total_reviewed:0,
    total_grouped:0,
  };
  constructor(
    public cf: CommonFunctionService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private excel: ExcelService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getToken()['userInfo']
    this.role = this.userService.getToken()['role']
    if(this.role == 'admin' || this.role == 'super') {
      this.nickname = this.user.name;
      this.phone = this.user.phone_number;
    }
    else if(this.role == 'agent') {
      this.nickname = this.user.nick_name;
      this.phone = this.user.contact_number;
    }
    else{
      this.nickname = this.user.nick_name;
      this.phone = this.user.phone;
    }

    this.getInfo();
  }
  async getInfo(){
    this.loading = true;
    try{
     const res = await this.userService.postRequest('_api/dashboard/overview').toPromise();
     this.info = res['result'];
    }catch(err){
     this.userService.handleError(err)
    }
    this.loading = false;
  }
}
