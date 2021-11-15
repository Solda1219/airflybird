import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
@Pipe({
    name: 'secureLive'
})
@Injectable({
    providedIn: 'root'
})
export class LivePipe implements PipeTransform {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }
    transform(url: string) {
        return this.http.get(url,{responseType:'blob'}).pipe(  
          switchMap(blob => {
            // return new observable which emits a base64 string when blob is converted to base64
            return Observable.create(observer => {
                observer.next(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)))
            //   const reader = new FileReader();
            //   reader.readAsDataURL(blob); // convert blob to base64
            //   reader.onloadend = function () {
            //     observer.next(reader.result); // emit the base64 string result
            //   }
            });
          }));
    }
}