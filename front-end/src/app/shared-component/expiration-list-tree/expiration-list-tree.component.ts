import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, OnChanges, SimpleChange } from '@angular/core';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { ExpirationTreeService } from './expirationTree.service';
import { UserService } from '../../service/user.service';
declare var $:any
@Component({
  selector: 'app-expiration-list-tree',
  templateUrl: './expiration-list-tree.component.html',
  styleUrls: ['./expiration-list-tree.component.scss'],
  providers: [ExpirationTreeService]
})
export class ExpirationListTreeComponent implements OnInit, AfterViewInit{
  dropdownEnabled = true;
  items: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
  });
  loading = false;
  buttonClasses = [
    'btn-outline-primary',
    'btn-outline-secondary',
    'btn-outline-success',
    'btn-outline-danger',
    'btn-outline-warning',
    'btn-outline-info',
    'btn-outline-light',
    'btn-outline-dark'
  ];
  buttonClass = this.buttonClasses[0];
  exp = 0; //1 = expiring soon, 0 = expired
  days = 0; //0 = 7 days, 1 = 30 days, 2 = 60 days, 3 = 7~30 days, 4 = 30 ~ 60 days, 5 = 60 days.
  @Output() selectedItems = new EventEmitter();
  constructor(
    private service: ExpirationTreeService,
    private userService: UserService,
  ) { }

  async ngOnInit() {
    this.loading = true;
    const csItems = await this.getCustomerList()
    this.items = this.service.getTrees(csItems,this.exp,this.days);
    this.loading = false;
  }
  async getCustomerList(){
    try{
      const item = await this.userService.postRequest('_api/user/getCustomerList').toPromise();
      return item['result']
    }catch(err){
      return false;
    }
  }
  ngAfterViewInit() {
    $('.treeViewOne .treeview-header input').attr('placeholder','Customer Name/Account')
  }
  onFilterChange(value: string): void {
    // console.log(this.values)
    // console.log('filter:', value);
  }
  onSelectChange(event){
   this.values = event;
   this.selectedItems.emit(this.values)
  }
  async onParameterChange(){
    const csItems = await this.getCustomerList()
    this.items = this.service.getTrees(csItems,this.exp,this.days);  }
}
