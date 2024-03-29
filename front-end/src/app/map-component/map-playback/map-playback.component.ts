import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, SimpleChange } from '@angular/core';
import {ControlAnchor, MapOptions, NavigationControlOptions, NavigationControlType, Point, BMarker, BMapInstance} from 'angular2-baidu-map';
import { MapCalculateService } from '../map-calculate.service';
declare const BMap: any;
declare const BMAP_SATELLITE_MAP: any;
@Component({
  selector: 'app-map-playback',
  templateUrl: './map-playback.component.html',
  styleUrls: ['./map-playback.component.scss'],
  providers: [MapCalculateService]
})
export class MapPlaybackComponent implements OnInit {
  @Input('gpsdata') gpsdata = [];
  @Input('vehicleInfo') vehicleInfo;
  @Input('curPoint') curPoint = 0;
  //map
  _map: any;
  _mapStatus=false;
  optionsMap = {
    centerAndZoom: {
      lat: 38,
      lng: 126,
      zoom: 3
    }
  };
  controlOpts = {
    anchor: ControlAnchor.BMAP_ANCHOR_TOP_LEFT,
    type: NavigationControlType.BMAP_NAVIGATION_CONTROL_LARGE
  };
  //for marker component
  carImage = new Image();
  startImage = new Image();
  endImage = new Image();
  vehicleMarker = [];
  lines = [];
  startAndEndPoint = [];
  constructor(
    private mapCore:MapCalculateService
  ) { 
    this.setImage();
  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: { [key: string]: SimpleChange }): any {
    if (changes["gpsdata"] && this._mapStatus) {
      this.start();
      this.startDraw();
    }
    if (changes["curPoint"] && this._mapStatus) {
      this.startDraw();
    }
    if (changes["vehicleInfo"] && this._mapStatus) {
      if('lat' in this.vehicleInfo.loc && 'lng' in this.vehicleInfo.loc){
        this.zoomAndCenter(this.vehicleInfo.loc)
      }
    }
  }
  reset(){
    this.curPoint = 0;
    this.lines = [];
    this.vehicleMarker = [];
    this.startAndEndPoint = [];
  };
  start(){
    this.reset();
    if(this.gpsdata.length>0) {
      this.setStartAndEndMarker(this.gpsdata[0],this.gpsdata[this.gpsdata.length-1]);
      this.setZoomAndCenter([this.gpsdata[0],this.gpsdata[this.gpsdata.length-1]])
    }
  }
  startDraw(){
   this.setMarker();
   this.drawTrackLine(this.gpsdata,this.curPoint);
   if(this.curPoint<this.gpsdata.length)
   this.zoomAndCenter(this.gpsdata[this.curPoint])
  }
  //map
  mapLoaded(map: any) {
    this._map = map;
    this.mapCore._map = map;
    this._mapStatus = true;
    if('lat' in this.vehicleInfo.loc && 'lng' in this.vehicleInfo.loc){
      this.zoomAndCenter(this.vehicleInfo.loc)
    }
    
    map.enableScrollWheelZoom(true);
    // 添加监听事件
    map.addEventListener('tilesloaded', () => {
      this._mapStatus = true;
    });
  }
  //setCarImage
  setImage(){
    this.carImage.onload = function (){
    }
    this.carImage.src = "assets/img/icon/car_type_organ.png";
    this.startImage.onload = function (){
    }
    this.startImage.src = "assets/img/icon/startMarker.png";
    this.endImage.onload = function (){
    }
    this.endImage.src = "assets/img/icon/endMarker.png";
  }
  setStartAndEndMarker(start: any, end: any) {
    this.startAndEndPoint = []
    if ('lat' in start && 'lng' in start) {
      const newMarker = {
        canvaslayerOptions: this.mapCore.getMarker(start.lat,start.lng,this.startImage,25,35),
      };
      this.startAndEndPoint.push(newMarker);
    }
    if ('lat' in end && 'lng' in end) {
      const newMarker = {
        canvaslayerOptions: this.mapCore.getMarker(end.lat,end.lng,this.endImage,25,35),
      };
      this.startAndEndPoint.push(newMarker);    
    }
  }
  setMarker() {
    const opt = [this.gpsdata[this.curPoint]]
    if (opt.length == 0) {
      this.vehicleMarker = [];
      return;
    }
    for (let i = 0; i < opt.length; i++) {
      const {lat,lng} = opt[i];
      const vehicle_number = this.vehicleInfo?this.vehicleInfo.license_plate_number:'';
      const newMarker = {
        canvaslayerOptions: this.mapCore.getCanvasVehicleMarker(lat,lng,vehicle_number,this.carImage),
      };
      this.vehicleMarker[i]=newMarker;
    }
  }
  drawTrackLine(item: any, point) {
    if (item.length < 1 || point < 1){
      this.lines = [];
      return;
    } 
    if(point < this.lines.length) {
      this.lines.splice(point,(this.lines.length-point))
    }else{
      for(let i = this.lines.length+1;i <= point; i ++){
        const newMarker = {
          canvaslayerOptions: this.mapCore.getLineCanvasOption(item[i - 1], item[i]),
        };
        this.lines.push(newMarker);
      }
    }
  }
  zoomAndCenter(loc){
    this.zoom(20);
    const location = {
      lat:loc.lat,
      lng:loc.lng
    };
    this.panTo(location);
  }
  setZoomAndCenter(opt:any) {
    if(opt.length == 0) return
    const CZ = this.mapCore.getCenter(opt);
    const center = {
      lat: CZ.lat,
      lng: CZ.lng,
    };
    this.zoom(CZ.zoom);
    this.panTo(center);
  }
  panTo(location: { lng: any, lat: any }) {
    this._map.panTo(new BMap.Point(location.lng, location.lat));
  }

  zoom(zoom) {
    this._map.setZoom(zoom);
  }
}
