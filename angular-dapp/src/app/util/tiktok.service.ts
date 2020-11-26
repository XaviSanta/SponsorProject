import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const cors: string = 'https://cors-anywhere.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class TiktokService {
  constructor(private http: HttpClient) { }

  getVideoMetadata(videoUrl: string): Observable<HttpResponse<any>> {
    const url =`${cors}https://europe-west3-sponsorproject.cloudfunctions.net/external-adapter-tiktok`;
    const data = {
      id: 0,
      data: {
        videoUrl,
      }
    };

    return this.http.post<any>(url, data);
  }
}
