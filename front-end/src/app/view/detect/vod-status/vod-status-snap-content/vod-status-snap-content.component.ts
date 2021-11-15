import { Component, OnInit, Input, OnChanges, EventEmitter, SimpleChange, ViewChild, ElementRef, Output} from '@angular/core';
import { CommonFunctionService } from '../../../../function/commonFunction.service';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { UserService } from '../../../../service/user.service';
import { ExcelService } from '../../../../function/excel.service';
//table
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ImageTransform, ImageCroppedEvent, Dimensions } from '../../../../module/image-cropper/interfaces';
import { ZipFromUrlService } from '../../../../module/zipFromUrl.service';

@Component({
  selector: 'app-vod-status-snap-content',
  templateUrl: './vod-status-snap-content.component.html',
  styleUrls: ['./vod-status-snap-content.component.scss']
})
export class VodStatusSnapContentComponent implements OnInit {
@Input('vod_selected') vod_selected;
@Output('vod_changed') vod_changed = new EventEmitter();
@Input('history_tag') history_tag = false;
//loading
loading = false;
//filter_list
formGroup: FormGroup;
//snap_item
snap_method = 0;
item_all = [];
snap_item = [];
group_item = [];
info;
type = [];
selection = new SelectionModel<any>(true, []);
selection_group = new SelectionModel<any>(true, []);
//search bar
formGroupUpdate: FormGroup;
//modal
selectedItems = [];
@ViewChild('warningModal') public warningModal: ModalDirective;
@ViewChild('modal') public modal: ModalDirective;
@ViewChild('videomodal') public videomodal: ModalDirective;
@ViewChild('video') video: ElementRef;

modal_src;
modal_index;
//for image cropping
imageChangedEvent: any = '';
croppedImage: any = '';
canvasRotation = 0;
rotation = 0;
scale = 1;
showCropper = false;
containWithinAspectRatio = false;
transform: ImageTransform = {};
//for range slider
slider_value: number = 0;
constructor(
  public cf: CommonFunctionService,
  private _formBuilder: FormBuilder,
  private userService: UserService,
  private toastr: ToastrService,
  private excel: ExcelService,
  private route: ActivatedRoute,
  private zipDownLoad: ZipFromUrlService
) {
 }

ngOnInit() {
   this.formset();
   this.updateFormSet(false);
//  await this.init();
}
ngOnChanges(changes: { [key: string]: SimpleChange }): any {
  if (changes["vod_selected"]) {
   if(this.vod_selected) this.search()
  }
}
updateFormSet(item:any = false) {
  if(item){
    const default_date = this.cf.DateFromVideoName(this.vod_selected.video_name);
    const {datetime} = item;
    const d = datetime?this.cf.getDateStringYYYYMMDD(datetime):default_date['d'];
    const h = datetime?this.cf.getHHMMSSS(datetime):default_date['h'];
    this.formGroupUpdate = this._formBuilder.group({
      vehicle_number: [item.vehicle_number,Validators.required],
      d: [d,[Validators.required,Validators.pattern(this.cf.regex_d)]],
      h: [h,[Validators.required,Validators.pattern(this.cf.regex_hhmmss)]],
      lng: [item.lng,Validators.required],
      lat: [item.lat,Validators.required],
      address: [item.address,Validators.required],
      type: [item.type,Validators.required],
    });
  }else{
    this.formGroupUpdate = this._formBuilder.group({
      vehicle_number: ['',Validators.required],
      d: ['',[Validators.required,Validators.pattern(this.cf.regex_d)]],
      h: ['',[Validators.required,Validators.pattern(this.cf.regex_hhmmss)]],
      lng: ['',Validators.required],
      lat: ['',Validators.required],
      address: ['',Validators.required],
      type: ['',Validators.required],
    });
  }
}
changeDate(){
  const default_date = this.cf.DateFromVideoName(this.vod_selected.video_name);
  if(this.cf.isDate(this.formGroupUpdate.value['d'])) this.formGroupUpdate.patchValue({d:this.cf.getDateStringYYYYMMDD(this.formGroupUpdate.value['d'])})
  else if(!this.cf.isDate(this.formGroupUpdate.value['d'])&&String(this.formGroupUpdate.value['d']).length==8){
    const dd = this.cf.convertTOYYYYMMDD(this.formGroupUpdate.value['d']);
    if(this.cf.isDate(dd)) this.formGroupUpdate.patchValue({d:this.cf.getDateStringYYYYMMDD(dd)})
    else this.formGroupUpdate.patchValue({d:default_date['d']})
  }
  else this.formGroupUpdate.patchValue({d:default_date['d']})
  const d_v = this.formGroupUpdate.value['d'];
  const d_h = this.formGroupUpdate.value['h'];
  if(this.cf.isDate(d_v+' '+d_h)) this.formGroupUpdate.patchValue({h:this.cf.getHHMMSSS(d_v+' '+d_h)})
  else if(!this.cf.isDate(d_v+' '+d_h)&&String(d_h).length==6){
    const hh = this.cf.convertTOHHMMSS(d_h);
    if(this.cf.isDate(d_v+' '+hh)) this.formGroupUpdate.patchValue({h:this.cf.getHHMMSSS(d_v+' '+hh)})
    else this.formGroupUpdate.patchValue({h:default_date['h']})
  }  
  else this.formGroupUpdate.patchValue({h:default_date['h']})
}
//search
async search(){
  this.selection.clear();
  this.selection_group.clear();
  this.loading = true;
  try {
    const res = await this.userService.postRequest('_api/detect/vod/getsnapInfo',
     {sort:this.formGroup.value['sort'],filter:this.formGroup.value['filter'],video_id:this.vod_selected.id,history_tag:this.history_tag}).toPromise();
    this.item_all = res['all'];
    this.snap_item = res['result'].filter(x=>x.group_name==''||x.group_name==null||x.group_name==undefined);
    // if(this.snap_item.length==0) this.userService.errorMessage('No data exist')
    this.type = res['type'];
    this.info = res['info'];
    this.group_item = this.makeGroup(this.item_all);
  } catch (err) {
    this.userService.handleError(err);
  }
  this.loading = false;
}
getType(id){
  for(let i =0 ; i < this.type.length; i++){
    if(this.type[i].id == id) return this.type[i].type;
  }
  return '';
}
//delete
showWarningModal(){
  if(this.selectedItems.length==0) {
    this.userService.errorMessage('Please select items to delete.')
    return
  }
  this.warningModal.show()
}
deleteAll(){
  const selected = this.snap_method==0?this.selection.selected:this.selection_group.selected;
  if(!selected||selected.length==0){
    this.userService.errorMessage('Please select items to delete.')
    return
  }
  this.selectedItems = selected;
  this.warningModal.show()
}
delete(){
  if(this.snap_method==0) this.deleteSnap()
  if(this.snap_method==1) this.deleteGroup()
}
async deleteSnap() {
  this.loading = true;
  try {
    const res = await this.userService.postRequest('_api/detect/vod/deletesnapInfo', { data: this.selectedItems,history_tag:this.history_tag}).toPromise();
    this.toastr.success(res['message']);
    this.modal.hide()
    this.vod_changed.emit()
    this.search();
  } catch (err) {
    this.userService.handleError(err);
  }
  this.loading = false;
}
//grouping
makeGroup(item) {
  const result = [];
  const list = item.filter(x=>x.group_name);
  if(list.length==0) return [];
  const namelist = this.groupName(list);
  for(let i = 0 ; i < namelist.length; i++){
    const child = this.groupChild(namelist[i],list);
    result.push({name:namelist[i],item:child});
  }
  return result;
}
groupName(arr){
  const item = [];
  for(let i = 0; i < arr.length; i++){
    if(item.indexOf(arr[i].group_name)==-1) item.push(arr[i].group_name)
  }
  return item;
}
groupChild(name, arr){
  const item = [];
  for(let i = 0; i < arr.length; i++){
    if(arr[i].group_name==name) item.push(arr[i])
  }
  return item;
}
async moveTogroup(){
  const selected = JSON.parse(JSON.stringify(this.selection.selected));
  if(!selected||selected.length==0){
    this.userService.errorMessage('Please select items to group.')
    return
  }
  const groupname = ''+this.vod_selected.video_name+'_'+this.cf.getDateStringYYYYMMDDROW(selected[0].datetime)+'_'+selected[0].vehicle_number+'_'+this.getType(selected[0].type);
  const exist = this.groupChild(groupname,this.item_all);
  //check
  if((exist.length+selected.length)<3){
    this.userService.errorMessage('At least 3 items required')
    this.selection.clear()
    return
  }
  if(this.checkEditing(selected)==false){
    this.userService.errorMessage('Editing items can\'t be groupped.')
    this.selection.clear()
    return
  }
  if(this.checkReviewed(selected)==false){
    this.userService.errorMessage('Please select reviewed items.')
    this.selection.clear()
    return
  }
  if(this.checkRule(selected)==false){
    this.userService.errorMessage('Vehicle, date and type must be same.')
    this.selection.clear()
    return
  }
  this.loading = true;
  try {
    const res = await this.userService.postRequest('_api/detect/vod/moveToGroup', { data: selected,group_name:groupname,history_tag:this.history_tag}).toPromise();
    this.toastr.success(res['message']);
    // this.modal.hide()
    // this.vod_changed.emit()
    this.search();
  } catch (err) {
    this.userService.handleError(err);
  }
  this.loading = false;
}
async deleteGroup() {
  this.loading = true;
  try {
    const res = await this.userService.postRequest('_api/detect/vod/deleteGroup', { data: this.selectedItems,history_tag:this.history_tag}).toPromise();
    this.toastr.success(res['message']);
    this.modal.hide()
    // this.vod_changed.emit()
    this.search();
  } catch (err) {
    this.userService.handleError(err);
  }
  this.loading = false;
}
checkEditing(item){
  for(let i = 0; i < item.length; i++){
    if(item[i].is_lock==1) return false;
  }
  return true;
}
checkReviewed(item){
  for(let i = 0; i < item.length; i++){
    if(item[i].is_check==0) return false;
  }
  return true;
}
checkRule(item){
  const firstdate = this.cf.getDateStringYYYYMMDD(item[0].datetime);
  const first_v = item[0].vehicle_number;
  const first_type = item[0].type;
  for(let i = 1; i < item.length; i++){
    const {vehicle_number,type} = item[i];
    const date = this.cf.getDateStringYYYYMMDD(item[i].datetime);
    if(date!=firstdate||first_v!=vehicle_number||type!=first_type) return false;
  }
  return true;
}
async deleteFromgroup(){
  const selected = this.selection_group.selected;
  if(!selected||selected.length==0){
    this.userService.errorMessage('Please select items to group.')
    return
  }
  this.loading = true;
  try {
    const res = await this.userService.postRequest('_api/detect/vod/moveToGroup', { data:selected,history_tag:this.history_tag}).toPromise();
    // this.toastr.success(res['message']);
    // this.modal.hide()
    // this.vod_changed.emit()
    this.search();
  } catch (err) {
    this.userService.handleError(err);
  }
  this.loading = false;
}
//confirm
async confirm(item,validation=false){
  if(validation&&this.formGroupUpdate.invalid){
    this.userService.errorMessage('Please input all fields correctly.');
    return;
  }
  if(validation){
    item.vehicle_number = this.formGroupUpdate.value['vehicle_number'];
    item.datetime = this.formGroupUpdate.value['d']+' '+this.formGroupUpdate.value['h'];
    item.lng = this.formGroupUpdate.value['lng'];
    item.lat = this.formGroupUpdate.value['lat'];
    item.address = this.formGroupUpdate.value['address'];
    item.type = this.formGroupUpdate.value['type'];
  }
  item.is_check = item.is_check?0:1;
  if(item.is_check == 0){
    item.is_report = 0;
  }
  const data = item;
  await this.update(data,false);
}
async report(item,validation=false){
  if(validation&&this.formGroupUpdate.invalid){
    this.userService.errorMessage('Please input all fields correctly.');
    return;
  }
  if(validation){
    item.vehicle_number = this.formGroupUpdate.value['vehicle_number'];
    item.datetime = this.formGroupUpdate.value['d']+' '+this.formGroupUpdate.value['h'];
    item.lng = this.formGroupUpdate.value['lng'];
    item.lat = this.formGroupUpdate.value['lat'];
    item.address = this.formGroupUpdate.value['address'];
    item.type = this.formGroupUpdate.value['type'];
  }
  item.is_report = item.is_report?0:1;
  item.is_check = 1;
  const data = item;
  await this.update(data,false);
}
async update(item,is_message = true){
  this.loading = true;
  try {
    const res = await this.userService.postRequest('_api/detect/vod/updatesnapinfo', { data: item,history_tag:this.history_tag }).toPromise();
    if(is_message) this.toastr.success(res['message']);
    this.search();
    this.loading = false;
  } catch (err) {
    this.userService.handleError(err);
    this.loading = false;
  }
  this.vod_changed.emit()
}
async editForm(){
  if(this.formGroupUpdate.invalid){
    this.userService.errorMessage('Please input all fields correctly.');
    return;
  }
  let item = this.modal_src;
  item.id = this.modal_src.id;
  item.vehicle_number = this.formGroupUpdate.value['vehicle_number'];
  item.datetime = this.formGroupUpdate.value['d']+' '+this.formGroupUpdate.value['h'];
  item.lng = this.formGroupUpdate.value['lng'];
  item.lat = this.formGroupUpdate.value['lat'];
  item.address = this.formGroupUpdate.value['address'];
  item.type = this.formGroupUpdate.value['type'];
  await this.update(item);
}
//edit
async showModal(item,index){
  try {
    await this.userService.postRequest('_api/detect/vod/locksnapinfo', { data: item,history_tag:this.history_tag}).toPromise();
  } catch (err) {
    this.userService.handleError(err);
    return;
  }
  this.modal_index = index;
  this.modal_src = JSON.parse(JSON.stringify(item));
  this.modal_src.datetime = this.modal_src.datetime?this.cf.getDateStringYYYYMMDDHHMMSS(this.modal_src.datetime):undefined;
  this.updateFormSet(this.modal_src);
  this.modal.show()
}
async hideModal(){
  for(let i = 0; i < this.snap_item.length; i++){
    const {id}= this.modal_src;
    if(this.snap_item[i].id==id) {
      this.snap_item[i].is_lock = 0;
      break;
    }
  }
  this.modal.hide();
  try {
    await this.userService.postRequest('_api/detect/vod/unlocksnapinfo', { data: this.modal_src,history_tag:this.history_tag}).toPromise();
  } catch (err) {
    return;
  }
}
showVideoModal() {
  this.videomodal.show()
}
stop(){
  this.video.nativeElement.pause();
}
next(){
  if(this.modal_index < (this.snap_item.length-1)) this.modal_index++
  else this.modal_index = 0
  this.modal_src = JSON.parse(JSON.stringify(this.snap_item[this.modal_index]));
  this.modal_src.datetime = this.modal_src.datetime?this.cf.getDateStringYYYYMMDDHHMMSS(this.modal_src.datetime):undefined;
  this.updateFormSet(this.modal_src);
}
prev(){
  if(this.modal_index > 0) this.modal_index--
  else this.modal_index = this.snap_item.length-1
  this.modal_src = JSON.parse(JSON.stringify(this.snap_item[this.modal_index]));
  this.modal_src.datetime = this.modal_src.datetime?this.cf.getDateStringYYYYMMDDHHMMSS(this.modal_src.datetime):undefined;
  this.updateFormSet(this.modal_src);
}
async detect() {
  this.loading = true;
  const request_data = {
    lat:this.formGroupUpdate.value['lat'],
    lng:this.formGroupUpdate.value['lng'],
    image: this.croppedImage,
    multi_detect: false
  };
  try{
    const detect = await this.userService.postRequest('_api/detect/vod/detect', request_data, true).toPromise();
    this.formGroupUpdate.patchValue(
      {
        address:detect['location'],
        vehicle_number:detect['number'],
      }
    )
  }
  catch(err){
  }
  this.loading = false;
}
//selection
/** Whether the number of selected elements matches the total number of rows. */
/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
    this.selection.clear() :
    this.snap_item.forEach(row => this.selection.select(row));
}
checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
}
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.snap_item.length;
  return numSelected === numRows;
}

masterToggle_group(group_name?:any) {
  if(group_name){
    this.isAllSelected_group(group_name) ?
    this.group_item.forEach(row => {
      row.name==group_name&&row.item.forEach(li=>this.selection_group.deselect(li))
    })
    :
    this.group_item.forEach(row => {
      row.name==group_name&&row.item.forEach(li=>this.selection_group.select(li))
    });
  }else{
    this.isAllSelected_group() ?
    this.selection_group.clear() :
    this.group_item.forEach(row => {
      row.item.forEach(li=>this.selection_group.select(li))
    });
  }
}
checkboxLabel_group(row?: any,group_name?:any): string {
  if (!row) {
    return `${this.isAllSelected_group(group_name) ? 'select' : 'deselect'} all`;
  }
  return `${this.selection_group.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
}
isAllSelected_group(group_name?: any) {
  let numRows = 0;
  if(group_name){
    const numSelected = this.selection_group.selected.filter(x=>x.group_name==group_name).length;
    this.group_item.forEach(row => row.name==group_name&&(numRows=numRows+row.item.length));
    return numSelected === numRows;
  }
  const numSelected = this.selection_group.selected.length;
  this.group_item.forEach(row => (numRows=numRows+row.item.length));
  return numSelected === numRows;
}
hasValueSubGroup(group_name){
  const ss =  this.selection_group.selected.filter(x=>x.group_name==group_name);
  return ss.length?true:false;
}
//formset
formset() {
  this.formGroup = this._formBuilder.group({
    sort: ['datetime'],
    filter: [0],
  });
}
zoomWithSlider(){
  this.scale = 1 + 0.1 * this.slider_value;
  this.transform = {
    ...this.transform,
    scale: this.scale
  };
}
imageCropped(event: ImageCroppedEvent) {
  this.croppedImage = event.base64;
  // console.log(event, base64ToFile(event.base64));
}
imageLoaded() {
  this.showCropper = true;
  // console.log('Image loaded');
}

cropperReady(sourceImageDimensions: Dimensions) {
  // console.log('Cropper ready', sourceImageDimensions);
}

loadImageFailed() {
  console.log('Load failed');
}
  onImgError(event){
    event.target.src = 'assets/img/error/noImage.png';
   //Do other stuff with the event.target
   }
}
