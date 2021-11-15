import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
//table
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../service/user.service';
@Component({
  selector: 'app-dashboard-message',
  templateUrl: './dashboard-message.component.html',
  styleUrls: ['./dashboard-message.component.scss']
})
export class DashboardMessageComponent implements OnInit {
  loading = false;
  item = [];
  //form
  formGroup:FormGroup;
  //for mat-table
  selectedItems;
  tbHeader = ['Status', 'Send Time','imei', 'Content', 'Message Type', 'Sender'];
  tbCol = ['status_name', 'created_at', 'imei', 'msgContent', 'msgTypeName', 'sender'];
  displayedColumns: string[] = ['select', 'status_name', 'created_at', 'imei', 'msgContent', 'msgTypeName', 'sender'];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //modal
  @ViewChild('modal') public modal: ModalDirective;
  modal_src;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
   this.setTableList();
   this.formSet();
   this.search();
  }
  async search(){
    this.loading = true;
    try{
      const res = await this.userService.postRequest('_api/message/get',this.formGroup.value).toPromise();
      this.item = res['result'];
      this.setTableList();
    }catch(err){
      console.log(err);
    }
    this.loading = false;
  }
  async read(){
    this.loading = true;
    try{
      const res = await this.userService.postRequest('_api/message/read',this.selectedItems).toPromise();
      this.userService.handleSuccess(res['message']);
      this.search();
    }catch(err){
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  markasRead(){
   if(this.selection.selected.length==0){
     this.userService.errorMessage("Please select items.");
     return;
   }
   this.selectedItems = JSON.parse(JSON.stringify(this.selection.selected))
   this.read();
  }
  markallasRead(){
    this.selectedItems = JSON.parse(JSON.stringify(this.tableList.data))
    this.read();
  }
  formSet(){
    this.formGroup = this._formBuilder.group({
     imei:[''],
     vehicle_number:[''],
     type:[-1],
     status:[-1]
    });
  }
  setTableList() {
    this.tableList = new MatTableDataSource(this.item)
    this.tableList.paginator = this.paginator;
    this.tableList.sort = this.sort;
  }
  showModal(item) {
    this.modal_src = item; 
    this.modal.show()
  }
  ngOnChanges(changes: { [key: string]: SimpleChange }): any {
    // if (changes["item"]) {
    //   this.setTableList()
    //   this.selection.clear()
    // }
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