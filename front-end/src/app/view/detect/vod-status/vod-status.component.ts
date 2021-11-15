import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';

@Component({
  selector: 'app-vod-status',
  templateUrl: './vod-status.component.html',
  styleUrls: ['./vod-status.component.scss']
})
export class VodStatusComponent implements OnInit {
  _opened = true;
  selected;
  history_tag;
  vod_changed;
  constructor(
    public cf:CommonFunctionService
  ) { }

  ngOnInit(): void {
  }
  snap_changed(){
     this.vod_changed = Date.now();
  }
}
