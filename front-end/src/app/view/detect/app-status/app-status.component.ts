import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-app-status',
  templateUrl: './app-status.component.html',
  styleUrls: ['./app-status.component.scss']
})
export class AppStatusComponent implements OnInit {
  info = [];
  gpuInfo = [];
  interval;
  re_time = 3;
  constructor(
    public cf: CommonFunctionService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
  ) { 

  }

  ngOnInit(): void {
    this.startInterval()
  }
  ngOnDestroy(): void {
    if(this.interval) clearInterval(this.interval)
  }
  async getInfo(){
    try{
      const res = await this.userService.postRequest('_api/detect/app/appstatus').toPromise();
      this.info = res['result'];
      this.gpuInfo = res['gpu'];
    }catch(err){
      console.log(err)
    }
  }
  async startInterval(){
    if(this.interval) clearInterval(this.interval)
    await this.getInfo();
    this.interval = setInterval(async ()=>{
      await this.getInfo();
    },this.re_time*1000)
  }
}
