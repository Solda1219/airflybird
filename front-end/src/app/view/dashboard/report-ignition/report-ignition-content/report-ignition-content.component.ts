import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
//table
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonFunctionService } from '../../../../function/commonFunction.service';

@Component({
  selector: 'app-report-ignition-content',
  templateUrl: './report-ignition-content.component.html',
  styleUrls: ['./report-ignition-content.component.scss']
})
export class ReportIgnitionContentComponent implements OnInit {
  @Input('item') item = [];
  //for mat-table
  tbHeader = ['Device Name', 'IMEI', 'Model','Status','StartTime','Endtime', 'Address',"TotalTime"];
  tbCol = ['device_name', 'imei', 'model','status','start_time','end_time', 'start_address',"duration"];
  displayedColumns: string[] = ['select','device_name', 'imei', 'model','status','start_time','end_time', 'start_address',"duration"];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() deleteItems = new EventEmitter();
  @Output() selectedItems = new EventEmitter();

  @ViewChild('modal') public modal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  willDelete;
  @ViewChild('video') video: ElementRef;
  modal_src;
  constructor(
    public cf: CommonFunctionService,
  ) { }

  ngOnInit(): void {

  }
  setTableList() {
    this.tableList = new MatTableDataSource(this.item)
    this.tableList.paginator = this.paginator;
    this.tableList.sort = this.sort;
  }
  setModal(item) {
    this.modal_src = item; 
    this.modal.show()
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
  
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}