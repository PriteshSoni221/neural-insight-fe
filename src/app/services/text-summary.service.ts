import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextSummaryService {
  private apiUrl = 'http://127.0.0.1:8000/summarize'; // Replace with your backend endpoint

  constructor(private http: HttpClient) { }

  // Function to send a review and get the summary
  getSummary(review: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { review: review }; // Payload to send to backend

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
