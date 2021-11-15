import { Component, OnInit, Input,Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../function/commonFunction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
//table and modal
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ExcelService } from '../../../function/excel.service';
declare var $:any
@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {
  loading;
  item = [];
  param = {
    expiration:0,
    active:3
 };
  tbHeader = ['Agent ID', 'Agent Name', 'Contact', 'Contact Number', 'Expire Date','users'];
  tbCol = ['agent_id','agent_name','contacts','contact_number','term','users'];
  displayedColumns: string[] = ['No','agent_id','agent_name','contacts','contact_number','term','users','Action'];
  specialCol = ['permission'];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  formGroup: FormGroup;
  CityList = ['city one'];
  ProviceList = ['city two'];
  business_src;
  avatar_src;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectedItems = new EventEmitter();
  @ViewChild('createModal') public createModal: ModalDirective;
  @ViewChild('userListModal') public userListModal: ModalDirective;
  selectedAgent;
  userList = [];

  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('resetModal') public resetModal: ModalDirective;

  @ViewChild('preview_business') public business_tag:ElementRef;
  @ViewChild('preview_avatar') public avatar_tag:ElementRef;
  willdelete;
  constructor(
    public cf: CommonFunctionService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private excel: ExcelService
  ) { 
  }
  async ngOnInit() {
    this.formSet()
    await this.search()
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      $('#distpicker1').distpicker({
        autoSelect: false
      });
    },300)
  }
  async search() {
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/account/agent/getAgents').toPromise()
      this.item = res['result'];
      this.setTableList();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  setFile(event,tag){
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = () => { // called once readAsDataURL is completed
        if(tag=='business'){
          this.business_tag.nativeElement.src = reader.result;
          this.formGroup.patchValue(
            {
              business_license_upload:reader.result,
              business_file:event.target.files[0]
            }
          );
        }
        else if(tag=='avatar'){
          this.avatar_tag.nativeElement.src = reader.result
          this.formGroup.patchValue(
            {
              avatar:reader.result,
              avatar_file:event.target.files[0]
            }
          );
        }
      }
    }
  }
  showCreateModal(){
    this.formSet();
    this.createModal.show();
  }
  showEditModal(item){
    this.formSet(item);
    this.createModal.show();
  }
  showResetTermModal(item){
    this.selectedAgent = item;
    this.resetModal.show()
  }
  async showUserListModal(item){
    this.selectedAgent = JSON.parse(JSON.stringify(item))
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/account/agent/getAgentUserList',item).toPromise()
      this.userList = res['result'];
    
      this.userListModal.show();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  checkForm(){
    if(!this.formGroup.valid){
      this.userService.errorMessage('Please input items correctly');
      return false
    }else return true;
  }
  formSet(item=null) {
    if(item==null){
      this.business_src = '';
      this.avatar_src = '';
      this.formGroup = this._formBuilder.group({
        id: [''],
        agent_id: [this.cf.getSerialNumber(),Validators.required],
        agent_name: ['',Validators.required],
        business_license_number: ['',Validators.required],
        valid_period_of_business_license:[this.cf.getDateStringYYYYMMDD(new Date()),Validators.required],
        name_of_legal_person:['',Validators.required],
        id_number_of_legal_person:['',Validators.required],
        business_license_upload:['',Validators.required],
        agency_city:['',Validators.required],
        agency_province:['',Validators.required],
        contacts:['',Validators.required],
        contact_number:['',Validators.required],
        mail_address:['',[Validators.required,Validators.email]],
        bank_name:['',Validators.required],
        bank_account_name:['',Validators.required],
        bank_account:['',Validators.required],
        alipay_name:[''],
        alipay_account:[''],
        wechat_name:[''],
        wechat_account:[''],
        nick_name:['',Validators.required],
        password:['',Validators.required],
        start:[this.cf.getDateStringYYYYMMDD(new Date()),Validators.required],
        term:[this.cf.getDateStringYYYYMMDD(new Date().setMonth(new Date().getMonth()+1)),Validators.required],
        avatar:['',Validators.required],
        avatar_file:[],
        created_at:[this.cf.getDateStringYYYYMMDDHHMMSS(Date.now())],
        business_file:[]
      });
    }else{
      this.business_src = null;
      this.avatar_src = null;
      this.formGroup = this._formBuilder.group({
        id: [item.id],
        agent_id: [item.agent_id,Validators.required],
        agent_name: [item.agent_name,Validators.required],
        business_license_number: [item.business_license_number,Validators.required],
        valid_period_of_business_license:[item.valid_period_of_business_license,Validators.required],
        name_of_legal_person:[item.name_of_legal_person,Validators.required],
        id_number_of_legal_person:[item.id_number_of_legal_person,Validators.required],
        business_license_upload:[item.business_license_upload,Validators.required],
        agency_city:[item.agency_city,Validators.required],
        agency_province:[item.agency_province,Validators.required],
        contacts:[item.contacts,Validators.required],
        contact_number:[item.contact_number,Validators.required],
        mail_address:[item.mail_address,[Validators.required,Validators.email]],
        bank_name:[item.bank_name,Validators.required],
        bank_account_name:[item.bank_account_name,Validators.required],
        bank_account:[item.bank_account,Validators.required],
        alipay_name:[item.alipay_name],
        alipay_account:[item.alipay_account],
        wechat_name:[item.wechat_name],
        wechat_account:[item.wechat_account],
        nick_name:[item.nick_name,Validators.required],
        password:[item.password,Validators.required],
        start:[item.start,Validators.required],
        term:[item.term,Validators.required],
        avatar:[item.avatar,Validators.required],
        avatar_file:[],
        business_file:[],
        updated_at:[this.cf.getDateStringYYYYMMDDHHMMSS(Date.now())],
      });
    }
  }
  async create(){
    if(!this.formGroup.valid) {
      this.userService.errorMessage('Please input fields correctly.')
      return
    }
    const datetimestamp = Date.now();
    let formData = new FormData();
    const data = JSON.parse(JSON.stringify(this.formGroup.value))
    if(this.formGroup.value['business_file']){
      const nn = 'business'+'-'+datetimestamp+'.' + this.formGroup.value['business_file'].name.split('.')[this.formGroup.value['business_file'].name.split('.').length -1];
      data['business_license_upload'] = '_public/image/account/'+nn;
      formData.append("files", this.formGroup.value['business_file'], nn);
    }
    if(this.formGroup.value['avatar_file']){
      const nn = 'avatar'+'-'+datetimestamp+'.' + this.formGroup.value['avatar_file'].name.split('.')[this.formGroup.value['avatar_file'].name.split('.').length -1];
      data['avatar'] = '_public/image/account/'+nn;
      formData.append("files", this.formGroup.value['avatar_file'], nn);
    } 
    const Obkey = Object.keys(data);
    Obkey.forEach(t=>{
      if(t=='business_file'||t=='avatar_file'){
      }else{
        formData.append(t, data[t]);
      }
    });
    this.loading = true;
    try {
      
      const res = await this.userService.postRequest('_api/account/agent/createAgents',formData).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search();
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async edit(){
    if(!this.formGroup.valid) {
      this.userService.errorMessage('Please input fields correctly.')
      return
    }
    const datetimestamp = Date.now();
    let formData = new FormData();
    const data = JSON.parse(JSON.stringify(this.formGroup.value))
    if(this.formGroup.value['business_file']){
      const nn = 'business'+'-'+datetimestamp+'.' + this.formGroup.value['business_file'].name.split('.')[this.formGroup.value['business_file'].name.split('.').length -1];
      data['business_license_upload'] = '_public/image/account/'+nn;
      formData.append("files", this.formGroup.value['business_file'], nn);
    }
    if(this.formGroup.value['avatar_file']){
      const nn = 'avatar'+'-'+datetimestamp+'.' + this.formGroup.value['avatar_file'].name.split('.')[this.formGroup.value['avatar_file'].name.split('.').length -1];
      data['avatar'] = '_public/image/account/'+nn;
      formData.append("files", this.formGroup.value['avatar_file'], nn);
    } 
    const Obkey = Object.keys(data);
    Obkey.forEach(t=>{
      if(t=='business_file'||t=='avatar_file'){
      }else{
        formData.append(t, data[t]);
      }
    });
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/account/agent/editAgents',formData).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async del(){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/account/agent/delAgents',this.willdelete).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async status(item){
    if(item.state==0){
      const { term } = item;
      const endTime = new Date(term).getTime()
      const delta = endTime - new Date().getTime();
      if (delta < 0) {
        this.showResetTermModal(item);
        return;
      }
    }
    item.state = item.state==1?0:1;
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/account/agent/editAgents',item).toPromise()
      this.userService.handleSuccess(res['message']);
    } catch (err) {
      item.state = item.state==1?0:1;
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async resetPassword(item){
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/account/agent/resetPasswordAgents',item).toPromise()
      this.userService.handleSuccess(res['message']);
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async resetTerm(){
    this.loading = true;
    try {
      this.selectedAgent.state = 1;
      const res = await this.userService.postRequest('_api/account/agent/editAgents',this.selectedAgent).toPromise()
      this.userService.handleSuccess(res['message']);
    } catch (err) {
      this.selectedAgent.state = 0;
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  exportToExcel(){
    const tbData = [];
    for(let i = 0; i < this.tableList.data.length; i++){//set table body
        const it_r = [];
        for(let k = 0; k < this.tbCol.length; k++) it_r.push(this.tableList.data[i][this.tbCol[k]])
        tbData.push(it_r);
    }
    this.excel.exportAsExcelFile('Device'+'_'+new Date().getTime(),this.tbHeader,tbData);
  }
  //table
  setTableList() {
    let src = JSON.parse(JSON.stringify(this.item));
    //filter by expiration
    const exp = this.param.expiration;
    const today = new Date().getTime();
    if (exp == 1) {
      const i_a = []
      const expSoonDate = 3;
      for (let i = 0; i < src.length; i++) {
        const { term } = src[i];
        const endTime = new Date(term).getTime()
        const delta = endTime - today;
        if (delta < 3600 * 24 * 1000 * expSoonDate && delta > 0) i_a.push(src[i])
      }
      src = i_a
    }
    else if (exp == 2) {
      const i_a = []
      for (let i = 0; i < src.length; i++) {
        const { term } = src[i];
        const endTime = new Date(term).getTime()
        const delta = endTime - today;
        if (delta < 0) i_a.push(src[i])
      }
      src = i_a
    }
    //filter by active
    const active = this.param.active
    if (active != 3) {
      const i_a = [];
      for (let i = 0; i < src.length; i++) {
        const { state } = src[i];
        if (state == active) i_a.push(src[i])
      }
      src = i_a
    }
    this.tableList = new MatTableDataSource(src)
    this.tableList.paginator = this.paginator;
    this.tableList.sort = this.sort;
  }
  //mat-table
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


