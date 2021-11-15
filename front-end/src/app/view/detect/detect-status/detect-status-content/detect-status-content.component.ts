import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
//table and modal
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonFunctionService } from '../../../../function/commonFunction.service';

@Component({
  selector: 'app-detect-status-content',
  templateUrl: './detect-status-content.component.html',
  styleUrls: ['./detect-status-content.component.scss']
})
export class DetectStatusContentComponent implements OnInit {
  @Input('item') item = [];
  @Input('Cycle') cycle;
  //for mat-table
  tbHeader = ['CameraID', 'Video Name', 'File size', 'Start DateTime', 'Video Duration', 'New Video Size','New Video Duration','GPU','Download Status','Download date','Detect Status','Wrong Detect Result','Detect Duration'];
  tbCol = ['camera_id','video_name','video_size','start_date_time','video_duration','new_video_size','new_video_duration','gpu','status','downloaded_time','detect_status','wrong_detect_result_info','detect_duration'];
  displayedColumns: string[] = ['camera_id','video_name','video_size','start_date_time','video_duration','gpu','status','downloaded_time','detect_status','wrong_detect_result_info','detect_duration'];
  specialCol = ['status','detect_status','wrong_detect_result_info']
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectedItems = new EventEmitter();
  constructor(
    public cf: CommonFunctionService,
  ) { }

  ngOnInit(): void {
    this.setTableList();
  }
  setTableList() {
    this.tableList = new MatTableDataSource(this.item)
    this.tableList.paginator = this.paginator;
    this.tableList.sort = this.sort;
  }
  ngOnChanges(changes: { [key: string]: SimpleChange }): any {
    if (changes["item"]) {
      this.setTableList()
      this.selection.clear()
    }
    if (changes['cycle']){
      this.setPage();
    }
  }
  //progress bar
  getType(value) {
    let type: string;
    if (value < 25) {
      return 'success';
    } else if (value < 50) {
      return 'info';
    } else if (value < 75) {
      return 'warning';
    } else {
      return 'danger';
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
  setPage(){
    if(!this.tableList||!this.tableList.paginator) return;
    if(this.tableList.paginator.hasNextPage()) this.tableList.paginator.nextPage()
    else this.tableList.paginator.firstPage()
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
  
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}