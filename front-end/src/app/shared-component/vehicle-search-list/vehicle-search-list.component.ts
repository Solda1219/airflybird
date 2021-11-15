import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, OnChanges, SimpleChange } from '@angular/core';
import { UserService } from '../../service/user.service';
import { CommonFunctionService } from '../../function/commonFunction.service';
@Component({
  selector: 'app-vehicle-search-list',
  templateUrl: './vehicle-search-list.component.html',
  styleUrls: ['./vehicle-search-list.component.scss']
})
export class VehicleSearchListComponent implements OnInit, OnChanges{
  loading = false;
  item = [];
  param={
    search:'',
    status:'All'
  }
  button={
    active:'btn btn-primary rigid-btn smallbutton',
    inactive:"btn btn-outline-dark rigid-btn rigid-default smallbutton"
  }
  checkAll: boolean = false;
  list = [];
  value= [];
  interval;
  re_time = 10;
  @Input('customer') customer=[]; 
  @Output() selectedItems = new EventEmitter();
  @Output() showItem = new EventEmitter();
  @Input('imei') imei='';
  constructor(
    private userService: UserService,
    public cf: CommonFunctionService
  ) { }

  async ngOnInit() {
    this.param.search = this.imei;
    const csItems = await this.startInterval()
  }
  ngOnDestroy(): void {
    clearTimeout(this.interval);
  }
  ngOnChanges(changes: { [key: string]: SimpleChange }): any {
    if (changes["customer"] && this.customer) {
      this.setList()
    }
  }
  ngAfterViewInit() {
  }
  async startInterval(){
    clearTimeout(this.interval)
    await this.getCustomerList();
    this.interval = setTimeout(()=>{
      this.startInterval();
    },(this.re_time)*1000)
  }
  async getCustomerList(){
    // this.loading = true;
    try{
     const res = await this.userService.postRequest('_api/device/deviceAll').toPromise();
     const old = JSON.parse(JSON.stringify(this.item));
     this.item = res['result'];
     this.item.forEach(t => t._checked = this.getCheckValue(t.id,old));
     this.setList()
    }catch(err){
    
    }
    // this.loading = false;
  }
  showItemStatus(item){
   this.showItem.emit(item);
  }
  getCheckValue(id,item){
   for(let i = 0 ; i < item.length; i ++){
     if(item[i].id == id) return item[i]._checked
   }
   return false;
  }
  setList(){
      this.list = this.item.filter(
        t=>(!this.param.search||t.license_plate_number==this.param.search||t.device_imei==this.param.search)
        &&this.customer.indexOf(t.id)!=-1
        &&(this.param.status == 'All'||(this.param.status == 'Online'?t.vehicle_status!='offline':t.vehicle_status == 'offline'))
        )
      this.onCheckChange()  
  }
  setAll(checked: boolean) {
    this.checkAll = checked;
    if (this.list.length == 0) {
      return;
    }
    this.list.forEach(t => t._checked = checked);
    this.value = this.list.filter(t=>t._checked)
    this.selectedItems.emit(this.value)
  }
  someChecked(): boolean {
    if (this.list.length == 0) {
      return false;
    }
    return this.list.filter(t => t._checked).length > 0 && !this.checkAll;
  }

  onCheckChange(){
    this.checkAll = this.list.length != 0 && this.list.every(t => t._checked);
    this.value = this.list.filter(t=>t._checked)
    this.selectedItems.emit(this.value)
  }
  onStatusChange(val){
    this.param.search = '';
    this.param.status = val;
    this.setList()
  }
  onSearchKeyPress(){
    if(!this.param.search) this.setList()
  }
  onFilterChange(value: string): void {
    // console.log(this.values)
    // console.log('filter:', value);
  }
}
