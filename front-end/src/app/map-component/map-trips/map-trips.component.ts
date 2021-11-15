import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, SimpleChange } from '@angular/core';
import {ControlAnchor, MapOptions, NavigationControlOptions, NavigationControlType, Point, BMarker, BMapInstance} from 'angular2-baidu-map';
import { MapCalculateService } from '../map-calculate.service';
declare const BMap: any;
declare const BMAP_SATELLITE_MAP: any;
@Component({
  selector: 'app-map-trips',
  templateUrl: './map-trips.component.html',
  styleUrls: ['./map-trips.component.scss'],
  providers: [MapCalculateService]
})
export class MapTripsComponent implements OnInit {
  @Input('gpsdata') gpsdata;
  @Input('vehicleInfo') vehicleInfo;
  @Output() map_loaded = new EventEmitter();
  gpsPrev;
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
  constructor(
    private mapCore:MapCalculateService
  ) { 
    this.setImage();
  }
 
  ngOnInit(): void {
  }
  ngOnChanges(changes: { [key: string]: SimpleChange }): any {
    if (changes["gpsdata"] && this._mapStatus) {
      this.startDraw()
    }
  }
  startDraw(){
    if(!this.gpsdata) return
    if(!this.gpsPrev) this.setZoomAndCenter([this.gpsdata])
    this.setMarker();
    this.drawTrackLine();
    this.zoomAndCenter(this.gpsdata)

    this.gpsPrev = JSON.parse(JSON.stringify(this.gpsdata));
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
  //map
  mapLoaded(map: any) {
    this._map = map;
    this.mapCore._map = map;
    this._mapStatus = true;
    this.map_loaded.emit();
    map.enableScrollWheelZoom(true);
    // 添加监听事件
    map.addEventListener('tilesloaded', () => {
    });
  }
  //setCarImage
  setMarker() {
    const opt = [this.gpsdata]
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
  drawTrackLine() {
    if (!this.gpsPrev){
      return;
    }
    const newMarker = {
      canvaslayerOptions: this.mapCore.getLineCanvasOption(this.gpsPrev, this.gpsdata),
    };
    if(this.lines.length>500) this.lines = this.lines.shift();
    this.lines.push(newMarker);
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
