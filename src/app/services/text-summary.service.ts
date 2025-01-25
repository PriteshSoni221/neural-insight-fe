import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../pages/extra/review-upload-page/review-upload-page.component';

export interface UploadReviewInterface {
  productID: number;
  fileContent: Review[]
}

@Injectable({
  providedIn: 'root'
})
export class TextSummaryService {

  private apiBaseUrl = 'http://127.0.0.1:8000'; // Replace with your backend endpoint

  constructor(private http: HttpClient) { }

  // Function to send a review and get the summary
  getSummary(review: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { review: review }; // Payload to send to backend

    return this.http.post<any>(this.apiBaseUrl + '/summarize', body, { headers });
  }

  uploadReviews(reviews: UploadReviewInterface): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = reviews; // Payload to send to backend

    return this.http.post<any>(this.apiBaseUrl + '/upload-reviews', body, { headers });
  }
}
