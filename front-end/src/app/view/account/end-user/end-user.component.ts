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
  selector: 'app-end-user',
  templateUrl: './end-user.component.html',
  styleUrls: ['./end-user.component.scss']
})
export class EndUserComponent implements OnInit {
  loading;
  item = [];
  param = {
    expiration:0,
    active:3
 };
  tbHeader = ['car Number', 'Real Name', 'Vehicle Type', 'Phone', 'Agent','CameraID','ExpireDate','RegisterDate'];
  tbCol = ['license_plate_number','real_name','type_name','phone','agent_name','camera_id','end','created_at'];
  displayedColumns: string[] = ['No','license_plate_number','real_name','type_name','phone','agent_name','camera_id','end','created_at','Action'];
  specialCol = ['permission','created_at'];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  formGroup: FormGroup;
  agentList=[];
  cameraList=[];
  gpuList=[];
  typeList=[];
  driving_src;
  avatar_src;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectedItems = new EventEmitter();
  @ViewChild('createModal') public createModal: ModalDirective;
  @ViewChild('userListModal') public userListModal: ModalDirective;
  selectedUser;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('resetModal') public resetModal: ModalDirective;
  @ViewChild('GPSmodal') public GPSmodal: ModalDirective;
  gpsInfo;
  heartbeat;
  @ViewChild('preview_driving') public driving_tag:ElementRef;
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
      const res = await this.userService.postRequest('_api/account/enduser/getEndusers').toPromise()
      this.item = res['result'];
      this.agentList = res['agentList'];
      this.cameraList = res['cameraList'];
      this.gpuList = res['gpuList'];
      this.typeList = res['typeList'];
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
        if(tag=='driving'){
          this.driving_tag.nativeElement.src = reader.result;
          this.formGroup.patchValue(
            {
              driving_license:reader.result,
              driving_file:event.target.files[0]
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
    this.selectedUser = undefined;
    this.formSet();
    this.createModal.show();
  }
  showEditModal(item){
    this.selectedUser = item;
    this.formSet(item);
    this.createModal.show();
  }
  showResetTermModal(item){
    this.selectedUser = item;
    this.resetModal.show()
  }
  async showGpsModal(camera_index) {
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/account/enduser/getGPSInfo', {camera_index:camera_index}).toPromise()
      this.heartbeat = res['heartbeat'];
      this.gpsInfo = res['gpsdata'];
    } catch (err) {
      this.userService.handleError(err)
    }
    this.GPSmodal.show()
    this.loading = false;
  }
  camera_setting(){
    const {camera_index} = this.formGroup.value;
    let item;
    for(let i =0 ; i < this.cameraList.length; i ++){
      if(this.cameraList[i].id==camera_index){
        item = this.cameraList[i];
        this.formGroup.patchValue({
          camera_index:item.id,
          camera_type:item.camera_type,
          camera_end:item.end?this.cf.getDateStringYYYYMMDD(new Date(item.end)):this.cf.getDateStringYYYYMMDD(Date.now()),
          install_date:item.install_date?item.install_date:this.cf.getDateStringYYYYMMDD(Date.now()),
          installation_site:item.installation_site,
          sim_card_number:item.sim_card_number,
          left_position:item.left_position,
          right_position:item.right_position,
          gpu_id:item.gpu_id,
          status:item.status,
        });
        break;
      }
      if(this.selectedUser.camera_index == camera_index){
        item = this.selectedUser;
        this.formGroup.patchValue({
          camera_index:item.camera_index,
          camera_type:item.camera_type,
          camera_end:item.camera_end?this.cf.getDateStringYYYYMMDD(new Date(item.camera_end)):this.cf.getDateStringYYYYMMDD(Date.now()),
          install_date:item.install_date?item.install_date:this.cf.getDateStringYYYYMMDD(Date.now()),
          installation_site:item.installation_site,
          sim_card_number:item.sim_card_number,
          left_position:item.left_position,
          right_position:item.right_position,
          gpu_id:item.gpu_id,
          status:item.status,
        });
        break
      }
    }
    
  }
  checkForm(){
    if(!this.formGroup.valid){
      this.userService.errorMessage('Please input items correctly');
      return false
    }else return true;
  }
  formSet(item=null) {
    setTimeout(()=>{
      (<HTMLInputElement>document.getElementById('driveFile')).value = "";
      (<HTMLInputElement>document.getElementById('avatarFile')).value = "";
    },300);
    if(item==null){
      this.driving_src = '';
      this.avatar_src = '';
      this.formGroup = this._formBuilder.group({
        id: [''],
        real_name: ['',Validators.required],
        vehicle_type_id: ['',Validators.required],
        brand: ['',Validators.required],
        date_of_production:[this.cf.getDateStringYYYYMMDD(new Date()),Validators.required],
        purchase_date:[this.cf.getDateStringYYYYMMDD(new Date()),Validators.required],
        date_of_issue:[this.cf.getDateStringYYYYMMDD(new Date()),Validators.required],
        identification_code:['',Validators.required],
        color:['',Validators.required],
        license_plate_number:['',Validators.required],
        phone:['',Validators.required],
        vehicle_city:['',Validators.required],
        vehicle_province:['',Validators.required],
        model:['',Validators.required],
        driving_license:['',Validators.required],
        driving_file:[],
        nick_name:['',Validators.required],
        password:['',Validators.required],
        agent_id:['',Validators.required],
        start:[this.cf.getDateStringYYYYMMDD(new Date()),Validators.required],
        end:[this.cf.getDateStringYYYYMMDD(new Date().setMonth(new Date().getMonth()+1)),Validators.required],
        avatar:['',Validators.required],
        avatar_file:[],
        created_at:[this.cf.getDateStringYYYYMMDDHHMMSS(Date.now())],
        camera_index:['',Validators.required],
        camera_type:[''],
        camera_end:[this.cf.getDateStringYYYYMMDD(Date.now())],
        install_date:[this.cf.getDateStringYYYYMMDD(Date.now()),Validators.required],
        installation_site:[''],
        sim_card_number:[''],
        left_position:[''],
        right_position:[''],
        gpu_id:['',Validators.required],
        status:[0,Validators.required],
      });
    }else{
      console.log(item.camera_end)
      this.driving_src = null;
      this.avatar_src = null;
      this.formGroup = this._formBuilder.group({
        id: [item.id],
        real_name: [item.real_name,Validators.required],
        vehicle_type_id: [item.vehicle_type_id,Validators.required],
        brand: [item.brand,Validators.required],
        date_of_production:[item.date_of_production,Validators.required],
        purchase_date:[item.purchase_date,Validators.required],
        date_of_issue:[item.date_of_issue,Validators.required],
        identification_code:[item.identification_code,Validators.required],
        color:[item.color,Validators.required],
        license_plate_number:[item.license_plate_number,Validators.required],
        phone:[item.phone,Validators.required],
        vehicle_city:[item.vehicle_city,Validators.required],
        vehicle_province:[item.vehicle_province,Validators.required],
        model:[item.model,Validators.required],
        driving_license:[item.driving_license,Validators.required],
        driving_file:[],
        nick_name:[item.nick_name,Validators.required],
        password:[item.password,Validators.required],
        agent_id:[item.agent_id,Validators.required],
        start:[item.start,Validators.required],
        end:[item.end,Validators.required],
        avatar:[item.avatar,Validators.required],
        avatar_file:[],
        updated_at:[this.cf.getDateStringYYYYMMDDHHMMSS(Date.now())],
        camera_index:[item.camera_index,Validators.required],
        camera_type:[item.camera_type],
        camera_end:[item.camera_end?this.cf.getDateStringYYYYMMDD(new Date(item.camera_end)):this.cf.getDateStringYYYYMMDD(Date.now()),Validators.required],
        install_date:[item.install_date?item.install_date:this.cf.getDateStringYYYYMMDD(Date.now()),Validators.required],
        installation_site:[item.installation_site?item.installation_site:'',Validators.required],
        sim_card_number:[item.sim_card_number,Validators.required],
        left_position:[item.left_position,Validators.required],
        right_position:[item.right_position,Validators.required],
        gpu_id:[item.gpu_id,Validators.required],
        status:[item.camera_status,Validators.required],
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
    if(this.formGroup.value['driving_file']){
      const nn = 'driving'+'-'+datetimestamp+'.' + this.formGroup.value['driving_file'].name.split('.')[this.formGroup.value['driving_file'].name.split('.').length -1];
      data['driving_license'] = '_public/image/account/'+nn;
      formData.append("files", this.formGroup.value['driving_file'], nn);
    }
    if(this.formGroup.value['avatar_file']){
      const nn = 'avatar'+'-'+datetimestamp+'.' + this.formGroup.value['avatar_file'].name.split('.')[this.formGroup.value['avatar_file'].name.split('.').length -1];
      data['avatar'] = '_public/image/account/'+nn;
      formData.append("files", this.formGroup.value['avatar_file'], nn);
    } 
    const Obkey = Object.keys(data);
    Obkey.forEach(t=>{
      if(t=='driving_file'||t=='avatar_file'){
      }else{
        formData.append(t, data[t]);
      }
    });
    this.loading = true;
    try {
      
      const res = await this.userService.postRequest('_api/account/enduser/createEndusers',formData).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
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
    if(this.formGroup.value['driving_file']){
      const nn = 'driving'+'-'+datetimestamp+'.' + this.formGroup.value['driving_file'].name.split('.')[this.formGroup.value['driving_file'].name.split('.').length -1];
      data['driving_license'] = '_public/image/account/'+nn;
      formData.append("files", this.formGroup.value['driving_file'], nn);
    }
    if(this.formGroup.value['avatar_file']){
      const nn = 'avatar'+'-'+datetimestamp+'.' + this.formGroup.value['avatar_file'].name.split('.')[this.formGroup.value['avatar_file'].name.split('.').length -1];
      data['avatar'] = '_public/image/account/'+nn;
      formData.append("files", this.formGroup.value['avatar_file'], nn);
    } 
    const Obkey = Object.keys(data);
    Obkey.forEach(t=>{
      if(t=='driving_file'||t=='avatar_file'){
      }else{
        formData.append(t, data[t]);
      }
    });
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/account/enduser/editEndusers',formData).toPromise()
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
      const res = await this.userService.postRequest('_api/account/enduser/delEndusers',this.willdelete).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async status(item){
    if(item.state==0){
      const { end } = item;
      const endTime = new Date(end).getTime()
      const delta = endTime - new Date().getTime();
      if (delta < 0) {
        this.showResetTermModal(item);
        return;
      }
    }
    item.state = item.state==1?0:1;
    this.loading = true;
    try {
      const res = await this.userService.postRequest('_api/account/enduser/editEndusers',item).toPromise()
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
      const res = await this.userService.postRequest('_api/account/enduser/resetPasswordEndusers',item).toPromise()
      this.userService.handleSuccess(res['message']);
    } catch (err) {
      this.userService.handleError(err)
    }
    this.loading = false;
  }
  async resetTerm(){
    this.loading = true;
    try {
      this.selectedUser.state = 1;
      const res = await this.userService.postRequest('_api/account/enduser/editEndusers',this.selectedUser).toPromise()
      this.userService.handleSuccess(res['message']);
      await this.search()
    } catch (err) {
      this.selectedUser.state = 0;
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


