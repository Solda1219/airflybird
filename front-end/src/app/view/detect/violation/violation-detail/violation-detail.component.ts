import { Component, OnInit, Input, OnChanges, SimpleChange, ViewChild, ElementRef} from '@angular/core';
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
  selector: 'app-violation-detail',
  templateUrl: './violation-detail.component.html',
  styleUrls: ['./violation-detail.component.scss']
})
export class ViolationDetailComponent implements OnInit {
//search bar
advanced = false;
item = [];
//loading
loading = false;
//video params
video_name = '';
video_params: any;
detail: any;
VDMSURL = 'http://vdms.aidetecting.com/';
//for mat-table
tbHeader = ['Agent', 'car Number',  'Video Name', 'Video Date', 'Recording Time', 'Violation Count'];
tbCol = ['agent_name', 'carNumber',  'video_name', 'video_date','dur', 'violation_count'];
displayedColumns: string[] = ['radio','agent_name', 'carNumber', 'video_name', 'video_date','dur', 'violation_count','checked_status','Action'];
tableList: MatTableDataSource<any>;
selection = new SelectionModel<any>(true, []);
selection1 = new SelectionModel<any>(true, []);
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;
@ViewChild('modal') public modal: ModalDirective;
modal_src;
modal_img;
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

async ngOnInit() {
 await this.init();
}
async init(){
  this.video_name = this.route.snapshot.params['video_name'];
    if (this.video_name) {
      this.video_params = JSON.parse(localStorage.getItem(this.video_name));
      this.item = await this.getItem({
        video_id: this.video_params.id,
        group: this.video_params.group,
      });
      this.setTableList(this.item)
      if(this.item.length>0)
      this.item.forEach(row=>{
        if(this.detail&&row.splite_start == this.detail.splite_start) this.setDetail(row)
        else this.setDetail(this.item[0])
      })
    }
}
async getItem(data) {
  this.loading = true;
  try {
    const result = await this.userService.postRequest('_api/video/vod/getvodDetail', data).toPromise();
    this.loading = false;
    return result['result'];
  } catch (err) {
    this.loading = false;
    return [];
  }
}
async getSplite(data) {
  this.loading = true;
  try {
    const result = await this.userService.postRequest('_api/video/vod/getSpliteInfo', data).toPromise();
    this.loading = false;
    return result['result'];
  } catch (err) {
    this.loading = false;
    return [];
  }
}
setTableList(item) {
  let src = JSON.parse(JSON.stringify(item));
  for(let i = 0 ; i < src.length; i ++ ){
    src[i].agent_name = this.video_params.agent_name;
    src[i].carNumber = this.video_params.license_plate_number;
    src[i].video_date = this.cf.getDateStringYYYYMMDDHHMMSS(src[i].video_date);
    src[i].violation_count = src[i].detected.length;
  }
  this.tableList = new MatTableDataSource(src);
  this.tableList.paginator = this.paginator;
  this.tableList.sort = this.sort;
}  
async setDetail(item){
  this.loading = true;
  const video_src = await this.getSplite(item)
  this.detail = item;
  this.detail.video_src = video_src;
  this.detail.detected.forEach(row => {if(row.is_check==1) this.selection1.select(row)});
  this.loading = false;
}
async showModal(item){
  this.modal_img = undefined;
  this.modal_src = item;
  const url = this.VDMSURL + 'detection_img/' + this.modal_src.video_id + '/' + this.modal_src.frame_time + '_o.jpg';
  const fileName = ''+this.modal_src.video_id+'_'+this.modal_src.frame_time+'_o.jpg';
  try{
    const res = await this.userService.postRequest('_api/file/_detectImagefileToServer', { url: [url], name: [fileName]}, true).toPromise()
    this.modal_img = res['result'][0];
  }catch(err){
    this.modal_img = 'Error';
  }
  this.modal.show()
}
async detect(item) {
  const request_data = {
    lat:item.lat,
    lng:item.lng,
    image: this.croppedImage,
    multi_detect: false
  };
  try{
    const detect = await this.userService.postRequest('_api/video/vod/detect', request_data, true).toPromise();
    item.address = detect['location'];
    item.number = detect['number']
  }
  catch(err){

  }
}
save(item){
  this.userService.postRequest('_api/video/vod/updateVodDetail', { data: item }).subscribe(
    res => {
      this.toastr.success(res['message']);
      this.init();
    },
    err => {
      this.handleError(err)
    }
  );
}
async downLoadVideoDetail() {
  const item = this.detail;
  if(!this.selection1.hasValue()){
    this.toastr.error('Please select items to download.')
    return;
  }
  this.loading = true;
  const video =  item.video_src;
  const videoText = `
  Agent:${item.agent_name}\n
  Vehicle:${item.carNumber}\n
  VideoName:${item.video_name}\n
  Video Date:${item.recording_time}\n
  Recording Time:${item.dur}\n
  Violation count:${item.violation_count}\n
  Check status:${item.checked_status}\n
  `;
  let image = [];
  let textOfImage = [];
  //for request 
  let fileListPath = [];
  let fileListName = [];
  for (let i = 0; i < item.detected.length; i++) {
    if(this.selection1.isSelected(item.detected[i])==false) continue;
    fileListPath.push(this.VDMSURL + 'detection_img/' + item.detected[i].video_id + '/' + item.detected[i].frame_time + '_o.jpg');
    fileListName.push(''+item.detected[i].video_id+'_'+item.detected[i].frame_time+'_o.jpg');
    const dataOfText = `
    FrameID:${item.detected[i].frame_id}\n
    DateTime:${item.detected[i].datetime}\n
    Longtitude:${item.detected[i].lng}\n
    Latitude:${item.detected[i].lat}\n
    Address:${item.detected[i].address}\n
    Vehicle:${item.detected[i].vehicle_number}\n
    Type:${this.detail.violation_types[item.detected[i].type-1].type}\n
    `;
    textOfImage.push(dataOfText);
  }
  this.userService.postRequest('_api/file/_detectImagefileToServer', { url: fileListPath, name: fileListName }, false).subscribe(
    async res => {
      image = res['result'];
      const cameraid = String(item.detected[0].frame_time).split('_');
      const zipName = (cameraid.length>0?cameraid[0]:'')+'_'+String(item.detected[0].datetime).trim()+'_'+new Date().getTime();
      await this.zipDownLoad.createMultiFileZip(video, videoText, image, textOfImage, zipName);
      this.loading = false;
    },
    err => {
      this.handleError(err);
      this.loading = false;
    }
  );
}
saveVideoDetail() {
    this.save(this.detail.detected);
}
deleteDetail() {
    const itemTodelete = this.detail.detected.filter(t=>t.is_check)
    this.delete(itemTodelete);
}
delete(item) {
  this.userService.postRequest('_api/video/vod/deleteVodeDetail', { data: item }).subscribe(
    res => {
      this.toastr.success(res['message']);
      this.init();
    },
    err => {
      this.handleError(err)
    }
  );
}
saveDetectResult(item) {
  this.save([item])
}
//radio
isRadioSelected(item) {
  if(!this.detail) return false
  return item.splite_start==this.detail.splite_start
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

//image selection
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected1() {
    if(!this.detail) return
    const numSelected = this.selection1.selected.length;
    const numRows = this.detail.detected.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle1() {
    if(!this.detail) return
    this.isAllSelected1() ?
        this.clearAll1() :
        this.selectAll1() ;
  }
  clearAll1(){
    this.selection1.clear()
    this.detail.detected.forEach(row => {
      row.is_check = 0;
    });
  }
  selectAll1(){
    this.detail.detected.forEach(row => {
      this.selection1.select(row);
      row.is_check = 1;
    });
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel1(row?: any): string {
    if (!row) {
      return `${this.isAllSelected1() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection1.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
//mat-table
ngAfterViewInit() {
  if(!this.tableList) return
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
  isAllSelected() {
    if(!this.tableList) return
    const numSelected = this.selection.selected.length;
    const numRows = this.tableList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if(!this.tableList) return
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
    //handle error
    handleError(err) {
      if (err.status == 504) this.toastr.error("Server is not responsing.")
      else err.error.message ? this.toastr.error(err.error.message) : this.toastr.error('something went wrong')
    }
}