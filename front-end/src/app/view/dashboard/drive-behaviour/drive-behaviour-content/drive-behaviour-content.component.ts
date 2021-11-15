import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
//table
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'; 
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonFunctionService } from '../../../../function/commonFunction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../service/user.service';
@Component({
  selector: 'app-drive-behaviour-content',
  templateUrl: './drive-behaviour-content.component.html',
  styleUrls: ['./drive-behaviour-content.component.scss']
})
export class DriveBehaviourContentComponent implements OnInit {
  @Input('item') item = [];
  //for mat-table
  tbHeader = ['Device Name', 'IMEI', 'Account', 'Alert Type', 'Alert Time', 'Address'];
  tbCol = ['device_name', 'imei', 'account', 'alertTypeName', 'postTime', 'alertAddress'];
  displayedColumns: string[] = ['select','device_name', 'imei', 'account', 'alertTypeName', 'postTime','alertAddress','Action'];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() deleteItems = new EventEmitter();
  @Output() selectedItems = new EventEmitter();
  //edit modal
  formGroup:FormGroup;
  @ViewChild('modal') public modal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  willDelete;
  @ViewChild('video') video: ElementRef;
  modal_src;
  @ViewChild('editModal') editModal: ModalDirective;
  @Output('havetoRefresh') havetoRefresh = new EventEmitter;
  editsrc;
  constructor(
    public cf: CommonFunctionService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.formset();
  }
  async itemasRead(row,val){
    try{
      const res = await this.userService.postRequest('_api/alarm/read',{data:[row],read:val}).toPromise();
      this.userService.handleSuccess(res['message']);
      this.havetoRefresh.emit();
    }catch(err){
      this.userService.handleError(err)
    }
  }
  //edit modal
  async remark(){
    if(this.formGroup.invalid){
      this.userService.errorMessage('Please input all fields correctly')
      return;
    }
    try{
      const res = await this.userService.postRequest('_api/alarm/remark',{src:this.editsrc,data:this.formGroup.value}).toPromise();
      this.userService.handleSuccess(res['message']);
      this.havetoRefresh.emit();
    }catch(err){
      this.userService.handleError(err);
    }
  }
  formset(){
    this.formGroup = this._formBuilder.group({
      operator:['',Validators.required],
      content:['',Validators.required]
    });
  }
  showEditModal(item){
    this.editsrc = item;
    this.formset();
    this.editModal.show();
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