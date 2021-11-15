import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
//table
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonFunctionService } from '../../../../function/commonFunction.service';
import { UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-report-violation-content',
  templateUrl: './report-violation-content.component.html',
  styleUrls: ['./report-violation-content.component.scss']
})
export class ReportViolationContentComponent implements OnInit {
  @Input('item') item = [];
  //for mat-table
  tbHeader = ['ByCamera','Group name', 'Type','Time', 'Image number',"GroupBy","Downloaded"];
  tbCol = ['camera_id','group_name', 'type_name','datetime','image_number','group_by','downloaded'];
  displayedColumns: string[] = ['select','camera_id','group_name', 'type_name','datetime','image_number','group_by','downloaded',"Action"];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  @Input('type') type = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() deleteItems = new EventEmitter();
  @Output() selectedItems = new EventEmitter();

  @ViewChild('snapmodal') public snapmodal: ModalDirective;
  snap_src;
  @ViewChild('recordmodal') public recordmodal: ModalDirective;
  record_selected;
  record_item = [];
  @ViewChild('warningModal') public warningModal: ModalDirective;
  willDelete;
  @ViewChild('video') video: ElementRef;
  constructor(
    public cf: CommonFunctionService,
    public userService: UserService,
  ) { }

  ngOnInit(): void {

  }
  setTableList() {
    this.tableList = new MatTableDataSource(this.item)
    this.tableList.paginator = this.paginator;
    this.tableList.sort = this.sort;
  }
  showSnapModal(item) {
    this.snap_src = item;
    this.snapmodal.show()
  }
  async showRecordModal(item){
    this.record_selected = item;
    try{
      const res = await this.userService.postRequest('_api/report/violation/getrecorddownload',{data:item,history_tag:false}).toPromise();
      this.record_item = res['result'];
      console.log(this.record_item)
      this.recordmodal.show()
    }catch(err){
      this.userService.handleError(err)
    }
  }
  stop(){
    this.video.nativeElement.pause();
  }
  ngOnChanges(changes: { [key: string]: SimpleChange }): any {
    if (changes["item"]) {
      this.setTableList()
      this.selection.clear()
    }
  }
  delList(){
    this.deleteItems.emit([this.willDelete]);
  }
  getType(id){
    for(let i =0 ; i < this.type.length; i++){
      if(this.type[i].id == id) return this.type[i].type;
    }
    return '';
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
  onSelectionChange(){
    const selected = this.tableList.data.filter(t=>this.selection.isSelected(t))
    this.selectedItems.emit(selected)
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
  onImgError(event){
    event.target.src = 'assets/img/error/noImage.png';
   //Do other stuff with the event.target
   }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
