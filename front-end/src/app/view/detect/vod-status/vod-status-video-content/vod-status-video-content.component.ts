import { Component, OnInit, Input, OnChanges, EventEmitter, SimpleChange, ViewChild, ElementRef, Output } from '@angular/core';
import { CommonFunctionService } from '../../../../function/commonFunction.service';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { UserService } from '../../../../service/user.service';
import { ExcelService } from '../../../../function/excel.service';
//table
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-vod-status-video-content',
  templateUrl: './vod-status-video-content.component.html',
  styleUrls: ['./vod-status-video-content.component.scss']
})
export class VodStatusVideoContentComponent implements OnInit {
@Input('snap_change') snap_change;
//search bar
advanced = false;
formGroup: FormGroup;
item = [];
agents = [];
agent_val = 'all';
@Output() vod_selected = new EventEmitter();
@Output() history_tag = new EventEmitter();
vod_item;
//loading
loading = false;
//for mat-table
tbHeader = ['Vehicle', 'Video',  'DateTime', 'Review'];
tbCol = ['carNumber', 'video_name',  'video_date','reviewed'];
displayedColumns: string[] = ['select','carNumber', 'video_name',  'video_date','reviewed','Action'];
tableList: MatTableDataSource<any>;
selection = new SelectionModel<any>(true, []);

@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

selectedItems = [];
@ViewChild('modal') public modal: ModalDirective;
@ViewChild('warningModal') public warningModal: ModalDirective;
@ViewChild('video') video: ElementRef;
modal_src;
constructor(
  public cf: CommonFunctionService,
  private _formBuilder: FormBuilder,
  private userService: UserService,
  private excel: ExcelService
) {
 }

 async ngOnInit() {
  this.setTableList([]);
  this.reset();
  this.getAgent();
  this.search();
}
ngOnChanges(changes: { [key: string]: SimpleChange }): any {
  if (changes["snap_change"]&&this.snap_change) {
   this.search(false)
  }
}
reset() {
  this.formGroup = this._formBuilder.group({
    checked: [0],//0: all, 1: checked, 2: unchecked
    date: [0],//0-today,1-this week, 2-this month,9-history
  });
}
async getAgent(){
  try{
    const res = await this.userService.postRequest('_api/account/agent/getAgents').toPromise()
    this.agents = res['result'];
   }catch(err){
   }
}
async setTableByAgent(){
  if(this.agent_val=='all'){
    this.setTableList(this.item);
  }else{
    const item = this.item.filter(x=>x.agent_id==this.agent_val);
    this.setTableList(item);
  }
}
async search(withemit = true) {
  const date_range = this.cf.getDateRange(this.formGroup.value['date']);
  if(withemit) this.loading = true;
  try{
   const res = await this.userService.postRequest('_api/detect/vod/getvod', {
    checked:this.formGroup.value['checked'],
    start:this.cf.getDateStringYYYYMMDDHHMMSS(date_range.from),
    end:this.cf.getDateStringYYYYMMDDHHMMSS(date_range.to),
    history_tag: this.formGroup.value['date']==9?true:false,
  }).toPromise()
   this.item = res['result'];
   if(withemit){
    if(this.item.length==0) {
      this.vod_item = undefined;
      this.userService.errorMessage('No data exist!')
     }
    else this.vod_item = this.item[0];
    this.vod_selected.emit(this.vod_item);
    this.history_tag.emit(this.formGroup.value['date']==9?true:false);
   }
   this.setTableByAgent();
  }catch(err){

  }
  this.loading = false;
}
selectVodItem(item){
  this.vod_item = item;
  this.vod_selected.emit(this.vod_item);

}
showVideoModal(item) {
  this.modal_src = item; 
  this.modal.show()
}
stop(){
  this.video.nativeElement.pause();
}
async del(){
  const item = this.selectedItems;
  try{
    const res = await this.userService.postRequest('_api/detect/vod/deletevod',{data:item,history_tag: this.formGroup.value['date']==9?true:false,}).toPromise();
    this.userService.handleSuccess(res['message'])
    this.search()
   }catch(err){
    this.userService.handleError(err)
   }
}
delSeleted(){
  this.selectedItems = this.selection.selected;
  if(this.selectedItems.length==0) {
    this.userService.errorMessage('Please select items to delete.')
    return
  }
  this.warningModal.show()
}
//mat-table
setTableList(item) {
  let src = JSON.parse(JSON.stringify(item));
  this.tableList = new MatTableDataSource(src);
  this.tableList.paginator = this.paginator;
  this.tableList.sort = this.sort;
}
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
onSelectionChange(){
  const selected = this.tableList.data.filter(t=>this.selection.isSelected(t))
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