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
  selector: 'app-eq-gpu-cameralist-table',
  templateUrl: './eq-gpu-cameralist-table.component.html',
  styleUrls: ['./eq-gpu-cameralist-table.component.scss']
})
export class EqGpuCameralistTableComponent implements OnInit {
  @Input('item') item = [];
  //for mat-table
  tbHeader =  ['Camera ID', 'Camera Model', 'IMEI', 'Vehicle Number', 'Install Date','Expire Date'];
  tbCol = ['camera_id','camera_type','device_imei','car_number','install_date','storage_date'];
  displayedColumns: string[] = ['No','camera_id','camera_type','device_imei','car_number','install_date','storage_date'];
  specialCol = []
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectedItems = new EventEmitter();
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
  ngOnChanges(changes: { [key: string]: SimpleChange }): any {
    if (changes["item"]) {
      this.setTableList()
      this.selection.clear()
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