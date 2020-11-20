import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiktokService {
  constructor(private http: HttpClient) { }

  getVideoMetadata(videoUrl: string): Observable<HttpResponse<any>> {
    const url = 'https://europe-west3-sponsorproject.cloudfunctions.net/external-adapter-tiktok';
    return this.http.post<any>(
      url, videoUrl);
  }
}
