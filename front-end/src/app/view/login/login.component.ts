import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../service/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  formGroup: FormGroup;
  formGroupP: FormGroup;
  message = '';
  currentLanguage = "en";
  LanguageImage = {
    en: "assets/img/country/us-flag.png",
    ch: "assets/img/country/china-flag.png",
  };
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['agent', Validators.required],
    });
    this.formGroupP = this._formBuilder.group({
      phone: ['', Validators.required],
      role: ['']
    });
    this.translate.use(this.currentLanguage);
    if(localStorage.getItem('language')) this.changeLang(localStorage.getItem('language'))
  }
  //LanguageChagePart
  changeLang(language: string) {
    this.currentLanguage = language;
    localStorage.setItem('language', language)
    this.translate.use(language);
  }
  passwordReset() {
    this.formGroupP.value.role = this.formGroup.value.role;
    this.userService.postRequest("_api/resetPassword", this.formGroupP.value, false).subscribe(
      res => {
      },
      err => {
      }
    )
  }
  login() {
    if(!this.formGroup.valid) {
      this.message = "Username and Password must be valid."
      return
    }
    this.message = '';
    const loginData = this.formGroup.value;
    const role = this.formGroup.value.role;
    if (role == "admin") this.loginAdmin(loginData)
    else if (role == "agent") this.loginAgent(loginData)
    else if (role == "user") this.loginUser(loginData)
  }
  loginAdmin(data) {
    this.loading = true;
    this.userService.postRequest('_api/user/loginAsAdmin', data, false).subscribe(
      res => {
        this.loading = false;
        this.userService.setToken(
          {
            token: res['token'],
            userInfo: res['userInfo'],
            role: res['role'],
            expiresAt: res['expiresAt']
          }
        );
        this.userService.gotoFirstPage()
      },
      err => {
        this.loading = false;
        this.userService.handleError(err)
      }
    )
  }
  loginAgent(data) {
    this.userService.postRequest('_api/user/loginAsAgent', data, false).subscribe(
      res => {
        this.loading = false;
        this.userService.setToken(
          {
            token: res['token'],
            userInfo: res['userInfo'],
            role: res['role'],
            expiresAt: res['expiresAt']
          }
        );
        this.userService.gotoFirstPage()
      },
      err => {
        this.loading = false;
        this.userService.handleError(err)
      }
    )
  }
  loginUser(data) {
    this.userService.postRequest('_api/user/loginAsUser', data, false).subscribe(
      res => {
        this.loading = false;
        this.userService.setToken(
          {
            token: res['token'],
            userInfo: res['userInfo'],
            role: res['role'],
            expiresAt: res['expiresAt']
          }
        );
        this.userService.gotoFirstPage()
      },
      err => {
        this.loading = false;
        this.userService.handleError(err)
      }
    )
  }
}
