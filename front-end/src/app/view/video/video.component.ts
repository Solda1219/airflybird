import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../function/commonFunction.service';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  _opened = true;
  curRoute = '';
  item;
  role;
  interval;
  re_time = 10;
  request;
  constructor(
    public cf:CommonFunctionService,
    public route:Router,
    private userService: UserService,
  ) {
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

  ngOnInit() {
    this.curRoute=this.route.routerState.snapshot.url;
    this.role = this.userService.getToken()['role'];
    this.getItem()
    this.startInterval();
  }
  ngOnDestroy(): void {
    if(this.interval) clearInterval(this.interval);
    if(this.request) this.request.unsubscribe();
  }
  getItem(){
    if(this.request) this.request.unsubscribe();
   this.request = this.userService.postRequest('_api/video/getindex').subscribe(
     res=>{
        this.item = res['result']
     }
   )
  }
  startInterval(){
    clearInterval(this.interval);
    this.interval = setInterval(()=>{
      this.getItem();
    },this.re_time*1000)
  }
}
