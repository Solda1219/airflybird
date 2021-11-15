import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-video-live',
  templateUrl: './video-live.component.html',
  styleUrls: ['./video-live.component.scss']
})
export class VideoLiveComponent implements OnInit {
  curRoute;
  loading;
  item = [];
  params = {
    live:'all',
    q:''
  };
  mode = 'list';
  interval;
  re_time = 10;
  request;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private toastr: ToastrService,
  ) { 
  }
  async ngOnInit() {
    this.loading = true;
    await this.search();
    this.loading = false;
    this.startInterval();
  }
  ngOnDestroy(): void {
    if(this.interval) clearInterval(this.interval);
    if(this.request) this.request.unsubscribe();
  }
  async search() {
    try {
      const res = await this.userService.postRequest('_api/video/live/getlive', {
        state: this.params.live,
        q: this.params.q,
      }, true).toPromise()
      this.item = res['result'];
    } catch (err) {
      this.handleError(err)
    }
  }
  search_in() {
    if(this.request) this.request.unsubscribe();
    this.request = this.userService.postRequest('_api/video/live/getlive', {
      state: this.params.live,
      q: this.params.q,
    }, true).subscribe(
      res=>{
        this.item = res['result'];
      }
    )
  }
  startInterval(){
    clearInterval(this.interval);
    this.interval = setInterval(()=>{
      this.search_in();
    },this.re_time*1000)
  }
  //handle error
  handleError(err) {
    if (err.status == 504) this.toastr.error("Server is not responsing.")
    else err.error.message ? this.toastr.error(err.error.message) : this.toastr.error('something went wrong')
  }
}
