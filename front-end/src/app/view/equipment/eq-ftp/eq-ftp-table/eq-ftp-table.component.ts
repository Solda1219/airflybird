import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
//table
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonFunctionService } from '../../../../function/commonFunction.service';

@Component({
  selector: 'app-eq-ftp-table',
  templateUrl: './eq-ftp-table.component.html',
  styleUrls: ['./eq-ftp-table.component.scss']
})
export class EqFtpTableComponent implements OnInit {
  @Input('item') item = [];
  //for mat-table
  tbHeader = ['Server ID', 'Server Name', 'IP Address', 'User Name', 'Creator', 'Created Time'];
  tbCol = ['server_id', 'server_name', 'ip_address', 'user_name', 'creator', 'created_at'];
  displayedColumns: string[] = ['No', 'server_id', 'server_name', 'ip_address', 'user_name', 'creator', 'created_at', 'Action'];
  specialCol = [];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() openEditModal = new EventEmitter();
  @Output() editItems = new EventEmitter();
  @Output() deleteItems = new EventEmitter();
  @Output() selectedItems = new EventEmitter();
  modalItem;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;
  @ViewChild('resetModal') public resetModal: ModalDirective;
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
  showEditModal(row){
    this.openEditModal.emit(row)
  }
  showResetTermModal(row){
    this.modalItem = JSON.parse(JSON.stringify(row))
    this.resetModal.show()
  }
  showDeleteModal(row){
    this.modalItem = JSON.parse(JSON.stringify(row))
    this.deleteModal.show()
  }
  resetTerm(){
     this.editItems.emit(this.modalItem);
  }
  delList(){
    this.deleteItems.emit(this.modalItem);
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