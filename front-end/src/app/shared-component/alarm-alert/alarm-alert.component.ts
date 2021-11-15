import { Component, OnInit, Input, OnChanges, EventEmitter, SimpleChange, ViewChild, ElementRef, Output} from '@angular/core';
import { CommonFunctionService } from '../../function/commonFunction.service';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { ExcelService } from '../../function/excel.service';
//table
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-alarm-alert',
  templateUrl: './alarm-alert.component.html',
  styleUrls: ['./alarm-alert.component.scss']
})
export class AlarmAlertComponent implements OnInit {
  //role
  is_admin = false;
  //loading
  loading = false;
  _isShow = false;
  request:any;
  interval;
  interval_alert;
  bell_status = true;
  re_time = 60;
  sound = false;
  //edit modal
  formGroup:FormGroup;
  //setting modal
  basicForm:FormGroup;
  soundForm:FormGroup;
  //for mat-table
  item = [];
  read_filter = 0;
  tbHeader = ['Device Name', 'IMEI', 'Account', 'Alert Type', 'Alert Time'];
  tbCol = ['device_name', 'imei', 'account', 'alertTypeName', 'postTime'];
  displayedColumns: string[] = ['select','device_name', 'imei', 'account', 'alertTypeName', 'postTime','Action'];
  specialCol = []
  tableList: MatTableDataSource<any>;
  selectedAlerts = [];
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectedItems = new EventEmitter();
  @ViewChild('audioOption') audioPlayerRef: ElementRef;
  @ViewChild('editModal') editModal: ModalDirective;
  editsrc;
  @ViewChild('settingModal') settingModal: ModalDirective;
  constructor(
    public cf: CommonFunctionService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    const role = this.userService.getToken()['role'];
    if(role=='super'||role=='admin') this.is_admin = true;
    else this.is_admin = false;
    this.formset();
    this.basicFormSet();
    this.setTableList();
    this.startInterval();
  }
  show(){
    this._isShow = true;
    setTimeout(()=>{this.startInterval()},300) ;
  }
  startInterval(){
    clearInterval(this.interval);
    this.getInfo();
    this.interval = setInterval(()=>{
      this.getInfo();
    },this.re_time*1000)
  }
  getInfo(){
    if(this.request) this.request.unsubscribe();
    this.request = this.userService.postRequest('_api/alarm/get').subscribe(
      res=>{
       this.item = res['result'];
       if(this._isShow) this.setTableList();
       this.turnSound();
      },
      err=>{
      }
    );
  }
  async read(val){
    this.loading = true;
    try{
      const res = await this.userService.postRequest('_api/alarm/read',{data:this.selectedAlerts,read:val}).toPromise();
      this.userService.handleSuccess(res['message']);
      this.startInterval();
    }catch(err){
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  itemasRead(row,val){
   this.selectedAlerts = [row];
   this.read(val);
  }
  markasRead(){
    if(this.selection.selected.length==0){
      this.userService.errorMessage("Please select items.");
      return;
    }
    this.selectedAlerts = JSON.parse(JSON.stringify(this.selection.selected))
    this.read(1);
  }
  turnSound(){
    const unread = this.item.filter(x=>x.is_read==0);
    if(this.sound && unread.length>0){
      this.audioPlayerRef.nativeElement.play();
    }
    if(unread.length>0){
      clearInterval(this.interval_alert);
      this.interval_alert = setInterval(()=>{
        this.bell_status = !this.bell_status;
      },400);
    }else{
      clearInterval(this.interval_alert);
      this.bell_status = true;
    }
  }
  ngOnDestroy() {
    if(this.interval) clearInterval(this.interval);
    if(this.interval_alert) clearInterval(this.interval_alert);
    if(this.request) this.request.unsubscribe();
  }
  setTableList() {
    let data = [];
    data = this.item.filter(x=>x.is_read==this.read_filter);
    this.tableList = new MatTableDataSource(data);
    this.tableList.paginator = this.paginator;
    this.tableList.sort = this.sort;
  }
  //edit modal
  async remark(){
    if(this.formGroup.invalid){
      this.userService.errorMessage('Please input all fields correctly')
      return;
    }
    try{
      const res = await this.userService.postRequest('_api/alarm/remark',{src:this.editsrc,data:this.formGroup.value}).toPromise();
      this.userService.handleSuccess(res['message']);
    }catch(err){
      this.userService.handleError(err);
    }
  }
  formset(){
    this.formGroup = this._formBuilder.group({
      operator:['',Validators.required],
      content:['',Validators.required]
    });
  }
  showEditModal(item){
    this.editsrc = item;
    this.formset();
    this.editModal.show();
  }
  //setting modal
  showSettingModal(){
    this.getBasicInfo();
    this.settingModal.show();
  }
  async getBasicInfo(){
    try{
       const res = await this.userService.postRequest('_api/alarm/getBasicSetting').toPromise();
       this.basicFormSet(res['result']);
    }catch(err){
       this.userService.handleError(err);
    }
  }
  async saveBasicInfo(){
    try{
       const res = await this.userService.postRequest('_api/alarm/editBasicSetting',this.basicForm.value).toPromise();
       this.userService.handleSuccess(res['message']);
    }catch(err){
       this.userService.handleError(err);
    }
  }
  basicFormSet(item:any=false){
    if(item==false){
      this.basicForm = this._formBuilder.group({
        offline_range:[0],
        parking_range:[0],
        idling_range:[0],
        idling_val:[0],
      });
    }else{
      this.basicForm = this._formBuilder.group({
        offline_range:[item.offline_range,[Validators.required,Validators.min(10)]],
        parking_range:[item.parking_range,Validators.required],
        idling_range:[item.idling_range,Validators.required],
        idling_val:[item.idling_val,Validators.required],
      });
    }
  }
   //mat-table
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableList.filter = filterValue.trim().toLowerCase();

    if (this.tableList.paginator) {
      this.tableList.paginator.firstPage();
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  onSelectionChange(){
    const selected = this.tableList.data.filter(t=>this.selection.isSelected(t))
    // this.selectedItems.emit(selected)
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableList.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableList.data.forEach(row => this.selection.select(row));
  }
  
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
