import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';

@Component({
  selector: 'app-violation',
  templateUrl: './violation.component.html',
  styleUrls: ['./violation.component.scss']
})
export class ViolationComponent implements OnInit {
  _opened = true;
  tab = 'All';
  treeItem;
  constructor(
    public cf: CommonFunctionService,
  ) { 
  }
  ngOnInit() {
  
  }
  tabChange(value){
    this.tab =value 
  }
  treeViewChange(value){
    this.treeItem = value;
  }
}
