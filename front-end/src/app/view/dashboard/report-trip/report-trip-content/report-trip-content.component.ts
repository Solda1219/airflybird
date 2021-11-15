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
  selector: 'app-report-trip-content',
  templateUrl: './report-trip-content.component.html',
  styleUrls: ['./report-trip-content.component.scss']
})
export class ReportTripContentComponent implements OnInit {
  @Input('item') item = [];
  //for mat-table
  tbHeader = ['Vehicle', 'IMEI', 'Model','From','To','TotalMile(km)', 'TravelTime', 'AverageSpeed(km/h)','MaxSpeed(km/h)'];
  tbCol = ['license_plate_number', 'device_imei', 'model','start_point','end_point','total_mile', 'travel_time', 'avg_speed','max_speed'];
  displayedColumns: string[] = ['select','license_plate_number', 'device_imei', 'model','start_point','end_point', 'total_mile', 'travel_time', 'avg_speed','max_speed'];
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