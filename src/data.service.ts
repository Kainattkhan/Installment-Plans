import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:3000/accounts'; 

  constructor(private http: HttpClient) { }

  getData(): Observable<any[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<any[]>(url);
  }

  saveData(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
