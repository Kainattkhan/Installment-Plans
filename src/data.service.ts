import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface InstallmentDetail {
  installmentNumber: number;
  dueDate: string;
  amount: number;
}

interface AccountDetail {
  id: string;
  Name: string;
  Product: string;
  Description: string;
  Details: InstallmentDetail[];
}

interface AccountWithTotal extends AccountDetail {
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  public apiUrl = 'http://localhost:3000/accounts';

  constructor(private http: HttpClient) {}

  getAllData(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  saveData(accountDetail: AccountDetail): Observable<any> {
    const newAccount = {
      id: accountDetail.id,
      Name: accountDetail.Name,
      Product: accountDetail.Product,
      Description: accountDetail.Description,
      Details: accountDetail.Details,
    };

    return this.http.post(`${this.apiUrl}`, newAccount);
  }

  updateData(accountNumber: string, accountDetail: AccountDetail): Observable<any> {
    const updatedAccount = {
      id: accountDetail.id,
      Name: accountDetail.Name,
      Product: accountDetail.Product,
      Description: accountDetail.Description,
      Details: accountDetail.Details,
    };

    return this.http.put(`${this.apiUrl}/${accountDetail.id}`, updatedAccount);
  }


}
