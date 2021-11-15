import { Component, OnInit, ViewChild } from '@angular/core';
import { navItems } from './_nav';
import { UserService } from '../../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonFunctionService } from '../../function/commonFunction.service';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
@Component({
  selector: 'app-horizon-layout',
  templateUrl: './horizon-layout.component.html',
  styleUrls: ['./horizon-layout.component.css']
})
export class HorizonLayoutComponent implements OnInit {
  curRoute:string='';
  sidebarMinimized = false;
  navItem = navItems;
  user;
  nickname;
  role;
  avatar;
  formGroup: FormGroup;
  defaultImage="assets/img/error/unknown.jpg";
  VDMSAVATARURL='http://vdms.aidetecting.com/assets/img/avatars/';
  currentLanguage="en";
  languageName="English";
  LanguageImage={
    en:"assets/img/country/us-flag.png",
    ch:"assets/img/country/china-flag.png",
  };
  @ViewChild('resetModal') public resetModal: ModalDirective;
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    public translate: TranslateService,
    private route: Router,
    public cf: CommonFunctionService,
  ){
    this.route.events.subscribe((event: Event) => {
      this.curRoute = event['url']
      switch (true) {
        case event instanceof NavigationStart: {
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  ngOnInit(){
    this.formSet();
    this.curRoute=this.route.routerState.snapshot.url;
    this.user = this.userService.getToken()['userInfo']
    this.role = this.userService.getToken()['role']
    if(this.role == 'admin' || this.role == 'super') {
      this.nickname = this.user.name;
      this.avatar=this.user.photo?this.user.photo:this.defaultImage;
    }
    else{
      this.nickname = this.user.nick_name;
      this.avatar=this.user.avatar?this.user.avatar:this.defaultImage;
    } 
    if(localStorage.getItem('language')) this.changeLang(localStorage.getItem('language'))
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  ngOnDestroy(){
    localStorage.removeItem('language');
  }
  formSet() {
    this.formGroup = this._formBuilder.group({
      old_password: ['',Validators.required],
      new_password: ['',Validators.required],
      confirm: ['',[Validators.required]],
    });
  }
  //reset password
  showResetModal(){
    this.formSet();
    this.resetModal.show();
  }
  async resetPassword(){
    if(this.formGroup.invalid){
      this.userService.errorMessage('Please input all fields correctly.');
      return;
    }else if(this.formGroup.value['new_password']!=this.formGroup.value['confirm']){
      this.userService.errorMessage('Password confirm don\'t match each other');
      return;
    }
    try{
      const res = await this.userService.postRequest('_api/user/resetPassword',this.formGroup.value).toPromise();
      this.userService.handleSuccess(res['message']);
    }catch(err){
      this.userService.handleError(err);
    }
  }
  //LanguageChagePart
  changeLang(language: string) {
    this.currentLanguage=language;
    if(language=='en') this.languageName="English";
    else if(language=='ch') this.languageName="Chinese";
    localStorage.setItem('language',language)
    this.translate.use(language);
  }
  //userdropdown part
  logOut(){
    this.userService.logOut()
  }
}
