import { Component, OnInit, Input, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../../function/commonFunction.service';
import { UserService } from '../../../../service/user.service';

import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-video-live-quater-mode',
  templateUrl: './video-live-quater-mode.component.html',
  styleUrls: ['./video-live-quater-mode.component.scss']
})
export class VideoLiveQuaterModeComponent implements OnInit {
  host_url = 'http://117.21.178.59:18000';
  @Input('item') item = [];
  @ViewChild('player', {static: false}) player: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }
  setQuaterSource(id,item,index){
    setTimeout(() => {
      if(item.session){
        let player = document.getElementById(id);
        player.setAttribute("video-url", this.host_url+item.session['DHLS']);
      }
      return ''
    },1000+index*300)
  }
  ngOnChanges(changes: { [key: string]: SimpleChange }): any {
    if (changes["item"]) {
      
    }
  }
}
