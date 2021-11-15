import { Component, OnInit, Input, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../../function/commonFunction.service';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { UserService } from '../../../../service/user.service';
import { ExcelService } from '../../../../function/excel.service';
//table
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-violation-index',
  templateUrl: './violation-index.component.html',
  styleUrls: ['./violation-index.component.scss']
})
export class ViolationIndexComponent implements OnInit {
 //search bar
 advanced = false;
 formGroup: FormGroup;
 item = [];
 //loading
 loading = false;
 //link with tree
 @Input('treeItem') treeItem;
 //for mat-table
 tbHeader = ['Agent', 'car Number',  'Video Name', 'Video Date', 'Recording Time', 'Violation Count'];
 tbCol = ['agent_name', 'license_plate_number',  'video_name', 'video_date','recording_time', 'violation_count'];
 displayedColumns: string[] = ['select','agent_name', 'license_plate_number', 'video_name', 'video_date','recording_time', 'violation_count','checked_status','Action'];
 tableList: MatTableDataSource<any>;
 selection = new SelectionModel<any>(true, []);

 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
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
   this.search();
   this.filterWithTree();
 }
 reset() {
   this.formGroup = this._formBuilder.group({
     imei: [],
     carNumber: [],
     checked: [0],
     group: [3],
     startdate: [],
     enddate: [],
   });
   this.setTableList(this.item)
 }
 async search() {
   this.loading = true;
   try{
    const res = await this.userService.postRequest('_api/video/vod/getvod', this.formGroup.value, true).toPromise()
    this.item = res['result'];
    this.setTableList(this.item);
   }catch(err){

   }
   this.loading = false;
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
         if (arr[k] == src[i]['imei']) {
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
   //filter by start and enddate
   const startdate = this.formGroup.value['startdate'];
   if (startdate) {
     const i_a = [];
     for (let i = 0; i < src.length; i++) {
       const { start_at, end_at } = src[i];
       if (new Date(start_at).getTime() >= new Date(startdate).getTime()) i_a.push(src[i])
     }
     src = i_a
   }
   const enddate = this.formGroup.value['enddate'];
   if (enddate) {
     const i_a = [];
     for (let i = 0; i < src.length; i++) {
      const { start_at, end_at } = src[i];
      if (new Date(end_at).getTime() <= new Date(enddate).getTime()) i_a.push(src[i])
    }
     src = i_a
   }
   this.tableList = new MatTableDataSource(src);
   this.tableList.paginator = this.paginator;
   this.tableList.sort = this.sort;
 }
 gotoDetail(item){
  item.group = this.formGroup.value['group']>=3?this.formGroup.value['group']:3;
  localStorage.setItem(item.video_name,JSON.stringify(item));
 }
 filterWithTree(){
  if (this.treeItem) {
    const tree_i = []
    this.setTableList(this.item)
    for (let i = 0; i < this.treeItem.length; i++) {
      const f = this.tableList.data.filter(x => x.vehicle_id == this.treeItem[i])
      if (f.length != 0) tree_i.push(f[0])
    }
    this.tableList = new MatTableDataSource(tree_i);
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