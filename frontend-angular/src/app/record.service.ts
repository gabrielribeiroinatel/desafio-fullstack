import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private apiUrl = 'http://127.0.0.1:8001';

  constructor(private http: HttpClient) {}

  createRecord(data: any) {
    return this.http.post(`${this.apiUrl}/records`, data);
  }
}