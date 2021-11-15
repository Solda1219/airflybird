import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { AgentTreeService } from './agentTree.service';
import { UserService } from '../../service/user.service';
declare var $:any
@Component({
  selector: 'app-customer-list-tree',
  templateUrl: './customer-list-tree.component.html',
  styleUrls: ['./customer-list-tree.component.scss'],
  providers: [AgentTreeService]
})
export class CustomerListTreeComponent implements OnInit, AfterViewInit {
  dropdownEnabled = true;
  items: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
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
  @Output() selectedItems = new EventEmitter();
  constructor(
    private service: AgentTreeService,
    private userService: UserService,
  ) { }

  async ngOnInit() {
    this.loading = true;
    const csItems = await this.getCustomerList()
    this.items = this.service.getTrees(csItems);
    this.loading = false;
    this.selectedItems.emit(this.values)
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
}
