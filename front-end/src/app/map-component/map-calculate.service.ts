import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import {ControlAnchor, MapOptions, NavigationControlOptions, NavigationControlType, Point, BMarker, BMapInstance} from 'angular2-baidu-map';

export class MapCalculateService {
  _map: any;
  sight = 350;
  EARTH_RADIUS = 6378.137;
  getCanvasVehicleMarker(lat,lng,carNumber,carImage) {
    const layer = {
      async update(map: BMapInstance, canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        var data = new window.BMap.Point(lng, lat)
        var pixel = map.pointToPixel(data);
        //set
        const radius = 30;
        const textsize = 10;
        const circleLineWidth = 1;
        const textLineWidth = 0.5;
        const carSize = {
          w:50,
          h:50,
        };
        const name: string = String(carNumber);
        const text = name;
        const backReactSize={
          x:pixel.x-(text.length/2*textsize),
          y:pixel.y-carSize.h/2-textsize-4,
          w:text.length*textsize,
          h:textsize+10
        }
        //circle
        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = "rgba(34, 25, 25, 0.9)";
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = circleLineWidth;
        ctx.fillRect(backReactSize.x,backReactSize.y,backReactSize.w,backReactSize.h);
        ctx.strokeRect(backReactSize.x,backReactSize.y,backReactSize.w,backReactSize.h);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        //text
        ctx.beginPath();
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = 'white';
        ctx.lineWidth = textLineWidth;
        ctx.font = "" + (textsize) + "px Arial";
        ctx.font = "" + textsize + "px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(text, pixel.x, backReactSize.y+backReactSize.h/2);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
        //img
        ctx.beginPath();
        ctx.save();
        ctx.drawImage(carImage, pixel.x-carSize.w/2, pixel.y-carSize.h/2,carSize.w,carSize.h);
        ctx.fill();
        ctx.restore();
      }
    }
    return layer;
  }
  getMarker(lat,lng,Image,width,height) {
    const layer = {
      async update(map: BMapInstance, canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        var data = new window.BMap.Point(lng, lat)
        var pixel = map.pointToPixel(data);
        //img
        ctx.beginPath();
        ctx.save();
        ctx.drawImage(Image, pixel.x-width/2, pixel.y-height,width,height);
        ctx.fill();
        ctx.restore();
      }
    }
    return layer;
  }
  getLineCanvasOption(from, to) {
    const layer = {
      async update(map: BMapInstance, canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        var fromPixelPoint = new window.BMap.Point(from.lng, from.lat)
        var fromPixel = map.pointToPixel(fromPixelPoint);
        var toPixelPoint = new window.BMap.Point(to.lng, to.lat)
        var toPixel = map.pointToPixel(toPixelPoint);
        //set
        const lineWidth = 3;
        const carSize = {
          w: 30,
          h: 30,
        };
        //img
        ctx.beginPath();
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = "blue";
        ctx.moveTo(fromPixel.x, fromPixel.y);
        ctx.lineTo(toPixel.x, toPixel.y);
        ctx.stroke();
        ctx.restore();
      }
    }
    return layer;
  }
  getCenter(opt) {
    if (opt.length == 0) return;
    if (opt.length == 1) return { lat: opt[0].lat, lng: opt[0].lng, zoom: 20 };
    this._map.setZoom(20);
    let minLat, maxLat, minLng, maxLng, avgLat, avgLng;
    minLat = Number(opt[0].lat);
    maxLat = Number(opt[0].lat);
    minLng = Number(opt[0].lng);
    maxLng = Number(opt[0].lng);
    for (let i = 0; i < opt.length; i++) {
      if (!opt[i]) continue;
      if (opt[i].lat < minLat) minLat = Number(opt[i].lat);
      if (opt[i].lat > maxLat) maxLat = Number(opt[i].lat);
      if (opt[i].lng < minLng) minLng = Number(opt[i].lng);
      if (opt[i].lng > maxLng) maxLng = Number(opt[i].lng);
    }
    avgLat = minLat + (maxLat - minLat) / 2;
    avgLng = minLng + (maxLng - minLng) / 2;
    const min = new window.BMap.Point(minLng, minLat);
    const max = new window.BMap.Point(maxLng, maxLat);
    const width = Math.abs(this._map.pointToPixel(min).x - this._map.pointToPixel(max).x);
    const height = Math.abs(this._map.pointToPixel(min).y - this._map.pointToPixel(max).y);
    const critera = Math.max(width, height);
    let zoom;
    if(critera != 0) {
      zoom = this._map.getZoom() - Math.log2(critera / this.sight);
    }else{
      zoom = 12;
    }
    return { lat: avgLat, lng: avgLng, zoom: zoom };
  }
  calcTotalMile(opt:any,point){
    if(point < 1) return 0
    let total = 0
    for(let i = 1; i <= point; i++){
      const longitude1 = opt[i-1].lng;
      const longitude2 = opt[i].lng;
      const latitude1 = opt[i-1].lat;
      const latitude2 = opt[i].lat;
      total = total+ this.getDistance(longitude1, latitude1, longitude2, latitude2);
    }
    return total
  }
  getDistance(longitude1, latitude1, longitude2, latitude2) {
    // 纬度
    const lat1 = latitude1*Math.PI/180;//将一个角度测量的角度转换成以弧度表示的近似角度
    const lat2 = latitude2*Math.PI/180;//将一个角度测量的角度转换成以弧度表示的近似角度
    // 经度
    const lng1 = longitude1*Math.PI/180;//将一个角度测量的角度转换成以弧度表示的近似角度
    const lng2 = longitude2*Math.PI/180;//将一个角度测量的角度转换成以弧度表示的近似角度
    // 纬度之差
    const a = lat1 - lat2;
    // 经度之差
    const b = lng1 - lng2;
    // 计算两点距离的公式
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(b / 2), 2)));
    // 弧长乘地球半径, 返回单位: 千米
    s =  s * this.EARTH_RADIUS;
    return s;
  }

}