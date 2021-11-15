import { Component, OnInit, Input, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { CommonFunctionService } from '../../../../function/commonFunction.service';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { UserService } from '../../../../service/user.service';
import { ExcelService } from '../../../../function/excel.service';
//table
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LivePipe } from '../../../../pipe/live.pipe';
@Component({
  selector: 'app-video-live-list-mode',
  templateUrl: './video-live-list-mode.component.html',
  styleUrls: ['./video-live-list-mode.component.scss'],
})
export class VideoLiveListModeComponent implements OnInit, OnChanges {
  //search bar
  advanced = false;
  formGroup: FormGroup;
  @Input('item') item = [];
  //loading
  loading = false;
  //for mat-table
  tbHeader = ['ID', 'name', 'Push switch', 'Push Stream Authentication', 'Share switch', 'Live status', 'Push rate', 'Push traffic', 'Push total traffic', 'online users', "Play traffic", "Play total traffic", "Live duration", "Video preservation(days)", "Starting time", "End time", "Update time"];
  tbCol = ['id', 'name', 'push_switch', 'push_stream', 'share_switch', 'live_status', 'push_rate', 'push_traffic', 'push_total_traffic', 'online_users', 'play_traffic', 'play_total_traffic', 'live_duration', 'preservation', 'start_time', 'end_time', 'update_time'];
  switchCol = ['push_switch', 'push_stream', 'share_switch'];
  displayedColumns: string[] = ['id', 'name', 'push_switch', 'push_stream', 'share_switch', 'live_status', 'push_rate', 'push_traffic', 'push_total_traffic', 'online_users', 'play_traffic', 'play_total_traffic', 'live_duration', 'preservation', 'start_time', 'end_time', 'update_time', 'Action'];
  tableList: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('reminisceModal') public reminisceModal: ModalDirective;
  @ViewChild('snapVideoModal') public snapVideoModal: ModalDirective;
  @ViewChild('streamModal') public streamModal: ModalDirective;
  @ViewChild('snapPlayer') snapPlayer: ElementRef;
  @ViewChild('streamPlayer') streamPlayer: ElementRef;
  host_url = 'http://117.21.178.59:18000';
  live_key;
  re_src;
  re_item;
  snap_src;
  stream_src;
  constructor(
    public cf: CommonFunctionService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private excel: ExcelService,
    private secure: LivePipe,
  ) {
  }

  ngOnInit() {
  }
  async reminisce(item){
   this.re_src = undefined;
   this.re_item = item;
   this.loading = true;
   try {
     const res = await this.userService.postRequest('_api/video/live/getliveRecords', {id:item.id,day:'all'}, true).toPromise()
     console.log(res['key'])
     document.cookie = res['key'];
     this.live_key = res['key'];
     this.re_src = res['result'];
     this.reminisceModal.show()
   } catch (err) {
     this.handleError(err)
   }
   this.loading = false;
  }
  showSnapVideo(item){
    this.snapVideoModal.show();
    this.snap_src = item;
    this.snapPlayer.nativeElement.src = this.host_url+'/api/v1/record/video/play/'+this.re_item.id+'/'+item.start_time+'/'+this.getEnd_time(this.cf.convertTOYYYYMMDDHHMMSS(item.start_time),item.duration)+'/video.mp4';
    this.snapPlayer.nativeElement.load();
    this.snapPlayer.nativeElement.play();
  }
  stop(){
    setTimeout(()=>{
      this.snapPlayer.nativeElement.pause();
      this.streamPlayer.nativeElement.getVueInstance().pause();
      this.snap_src = undefined;
      this.stream_src = undefined;
    },300)
  }
  getEnd_time(start, duration) {
    const time_d = new Date(start).getTime();
    const newTimeStr = this.cf.getDateStringYYYYMMDDHHMMSSROW(time_d+duration*1000)
    return newTimeStr;
  }
  play(item,method){
    if(method=='RTMP'){
      this.stream_src = item.session[method];
    }
    else {
      this.stream_src = this.host_url+item.session[method];
    }
    this.streamPlayer.nativeElement.setAttribute("video-url", this.stream_src)
    this.streamModal.show()
  }
  //table
  setTableList(item) {
    let src = JSON.parse(JSON.stringify(item));
    this.tableList = new MatTableDataSource(src);
    this.tableList.paginator = this.paginator;
    this.tableList.sort = this.sort;
  }
  ngOnChanges(changes: { [key: string]: SimpleChange }): any {
    if (changes["item"]) {
      this.setTableList(this.item)
    }
  }
  pushSwitch(item){
    const {id,name,push_switch} = item;
    this.userService.postRequest('_api/video/live/createlive',{id:id,name:name,actived:push_switch}).subscribe(
      res=>{
          this.toastr.success(res['message']);
      },
      err=>{
        this.handleError(err)
        item.push_switch=!item.push_switch;
      }
    );
  }
  pushStreamAuthentication(item){
    const {id,name,push_stream} = item;
    this.userService.postRequest('_api/video/live/createlive',{id:id,name:name,authed:push_stream}).subscribe(
      res=>{
        this.toastr.success(res['message']);
      },
      err=>{
        this.handleError(err)
        item.push_stream=!item.push_stream;
      }
    );
  }
  shareSwitch(item){
    const {id,name,share_switch} = item;
    this.userService.postRequest('_api/video/live/createlive',{id:id,name:name,shared:share_switch}).subscribe(
      res=>{
        this.toastr.success(res['message']);
      },
      err=>{
        this.handleError(err)
        item.share_switch=!item.share_switch;
      }
    );
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
  //handle error
  handleError(err) {
    if (err.status == 504) this.toastr.error("Server is not responsing.")
    else err.error.message ? this.toastr.error(err.error.message) : this.toastr.error('something went wrong')
  }
}