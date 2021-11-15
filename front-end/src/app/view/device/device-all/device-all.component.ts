import { Component, OnInit, Input, OnChanges, SimpleChange, ViewChild, Output,EventEmitter } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { ExcelService } from '../../../function/excel.service';
//table
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';

/** Constants used to fill up our data base. */
@Component({
  selector: 'app-device-all',
  templateUrl: './device-all.component.html',
  styleUrls: ['./device-all.component.scss']
})
export class DeviceAllComponent implements OnInit, OnChanges {
  //search bar
  advanced = false;
  formGroup: FormGroup;
  item = [];
  //loading
  loading = false;
  //link with tree
  @Input('treeItem') treeItem;
  //for mat-table
  tbHeader = ['Account', 'CameraID', 'IMEI', 'Model', 'Car Type', 'car Number', 'Agent', 'Activated Date', 'Expired Date', 'Status'];
  tbCol = ['phone', 'camera_id', 'device_imei', 'model', 'type_name', 'license_plate_number', 'agent_name', 'start', 'end', 'vehicle_status','operation'];
  displayedColumns: string[] = ['select','phone', 'camera_id', 'device_imei', 'model', 'type_name', 'license_plate_number', 'agent_name', 'start', 'end', 'vehicle_status','Action'];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  interval;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() showGpsModal = new EventEmitter();
  @Output() showCmdModal = new EventEmitter();
  constructor(
    public cf: CommonFunctionService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private excel: ExcelService
  ) {
   }

   async ngOnInit() {
    this.reset();
    this.loading = true;
    await this.search();
    this.filterWithTree();
    this.loading = false;
    this.startInterval();
  }
  ngOnDestroy(): void {
    if(this.interval) clearInterval(this.interval);
  }
  reset() {
    this.formGroup = this._formBuilder.group({
      imei: [],
      carNumber: [],
      expiration: [0],
      activate: [3],
      startdate: [],
      enddate: [],
    });
    this.setTableList(this.item)
  }

  async search() {
    try{
     const res = await this.userService.postRequest('_api/device/deviceAll').toPromise()
     this.item = res['result'];
     this.setTableList(this.item);
    }catch(err){
 
    }
  }
  async startInterval() {
    this.interval = setInterval(async ()=>{
      await this.search();
      this.filterWithTree();
    },5000)
  }
  showCommandModal(item){
    this.showCmdModal.emit(item);
  }
  monitor(item) {
   this.showGpsModal.emit(item)
  }
  setTableList(item) {
    let src = JSON.parse(JSON.stringify(item));
    //filter by imei
    const imeiline = this.formGroup.value['imei']
    if (imeiline) {
      const arr = String(imeiline).split(/\n/);
      const i_a = []
      for (let i = 0; i < src.length; i++)
        for (let k = 0; k < arr.length; k++)
          if (arr[k] == src[i]['device_imei']) {
            i_a.push(src[i]);
            break;
          }
      src = i_a
    }
    //filter by carNumber
    const carline = this.formGroup.value['carNumber']
    if (carline) {
      const arr = String(carline).split(/\n/);
      const i_a = []
      for (let i = 0; i < src.length; i++)
        for (let k = 0; k < arr.length; k++)
          if (arr[k] == src[i]['license_plate_number']) {
            i_a.push(src[i]);
            break;
          }
      src = i_a
    }
    //filter by expiration
    const exp = this.formGroup.value['expiration']
    const today = new Date().getTime();
    if (exp == 1) {
      const i_a = []
      const expSoonDate = 3;
      for (let i = 0; i < src.length; i++) {
        const { end } = src[i];
        const endTime = new Date(end).getTime()
        const delta = endTime - today;
        if (delta < 3600 * 24 * 1000 * expSoonDate && delta > 0) i_a.push(src[i])
      }
      src = i_a
    }
    else if (exp == 2) {
      const i_a = []
      for (let i = 0; i < src.length; i++) {
        const { end } = src[i];
        const endTime = new Date(end).getTime()
        const delta = endTime - today;
        if (delta < 0) i_a.push(src[i])
      }
      src = i_a
    }
    //filter by active
    const active = this.formGroup.value['activate']
    if (active != 3) {
      const i_a = [];
      for (let i = 0; i < src.length; i++) {
        const { state } = src[i];
        if (state == active) i_a.push(src[i])
      }
      src = i_a
    }
    //filter by start and enddate
    const startdate = this.formGroup.value['startdate'];
    if (startdate) {
      const i_a = [];
      for (let i = 0; i < src.length; i++) {
        const { start, end } = src[i];
        if (start >= startdate) i_a.push(src[i])
      }
      src = i_a
    }
    const enddate = this.formGroup.value['enddate'];
    if (enddate) {
      const i_a = [];
      for (let i = 0; i < src.length; i++) {
        const { start, end } = src[i];
        if (end <= enddate) i_a.push(src[i])
      }
      src = i_a
    }
    this.tableList = new MatTableDataSource(src);
    this.tableList.paginator = this.paginator;
    this.tableList.sort = this.sort;
  }
  filterWithTree(){
   if (this.treeItem) {
     const tree_i = []
     this.setTableList(this.item)
     for (let i = 0; i < this.treeItem.length; i++) {
       const f = this.tableList.data.filter(x => x.id == this.treeItem[i])
       if (f.length != 0) tree_i.push(f[0])
     }
     this.tableList = new MatTableDataSource(tree_i);
     this.tableList.paginator = this.paginator;
     this.tableList.sort = this.sort;
   }
  }
  ngOnChanges(changes: { [key: string]: SimpleChange }): any {
    if (changes["treeItem"]) {
      if(!this.formGroup) return
      this.filterWithTree()
    }
  }
  exportToExcel(){
    if(this.selection.selected.length==0) {
      this.toastr.error('Please select device.');
      return
    }
    const tbData = [];
    for(let i = 0; i < this.tableList.data.length; i++){//set table body
      if(this.selection.isSelected(this.tableList.data[i])){
        const it_r = [];
        for(let k = 0; k < this.tbCol.length; k++) it_r.push(this.tableList.data[i][this.tbCol[k]])
        tbData.push(it_r);
      }
    }
    this.excel.exportAsExcelFile('Device'+'_'+new Date().getTime(),this.tbHeader,tbData);
  }
  //mat-table
  ngAfterViewInit() {
    this.tableList.paginator = this.paginator;
    this.tableList.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableList.filter = filterValue.trim().toLowerCase();
 
    if (this.tableList.paginator) {
      this.tableList.paginator.firstPage();
    }
  }
   /** Whether the number of selected elements matches the total number of rows. */
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