// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { DataService } from '../../data.service';
// import { MatDialog } from '@angular/material/dialog';
// import { InstallmentPopupComponent } from "../installment-popup/installment-popup.component"
// import { ToastrService } from "ngx-toastr"

// interface InstallmentDetail {
//   installmentNumber: number;
//   dueDate: string;
//   amount: number;
// }

// interface AccountDetail {
//   id: string;
//   Name:string;
//   Product: string;
//   Description: string;
//   Details: InstallmentDetail[];
// }

// interface AccountWithTotal extends AccountDetail {
//   totalAmount: number;
// }

// @Component({
//   selector: 'app-form',
//   templateUrl: './form.component.html',
//   styleUrls: ['./form.component.css']
// })

// export class FormComponent implements OnInit{
//   months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//   currentYear: number = new Date().getFullYear(); // Initialize the current year
//   dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   days: any[] = [];

//   form: FormGroup;
//   installments: any[] = [];
//   showInstallmentsTable: boolean = false;

//   accountsData: AccountDetail[] = [];
//   fetchedDueDateData: AccountWithTotal[] = [];

//   ngOnInit() {
//     this.fetchAllData();
      
//   }
 
//   constructor(
//     private http:HttpClient, 
//     private fb: FormBuilder, 
//     private dataService: DataService, 
//     private dialog: MatDialog,
//     private toastr: ToastrService)
//      {
//       this.form = this.fb.group({
//       id: [''],
//       name: ['',  Validators.required],
//       product: ['',  Validators.required],
//       description: ['',  Validators.required],
//       dueDate: '',
//       installmentNumber: '',
//       amount: ''
//     });
//     this.populateDays();  
//   }

//  apiUrl = 'http://localhost:3000/accounts'; 

// onSaveOrUpdate() {
//   const accountData = this.form.controls;
//   const id = accountData.id.value;

//   const existingAccountIndex = this.accountsData.findIndex(
//     account => account.id === id
//   );

//   const accountDetail: AccountDetail = {
//     id: id,
//     Name: accountData.name.value,
//     Product: accountData.product.value,
//     Description: accountData.description.value,
//     Details: this.installments.map(installment => ({
//       installmentNumber: installment.installmentNumberControl.value,
//       dueDate: installment.dueDateControl.value,
//       amount: installment.amountControl.value,
//     })),
//   };

//   if (existingAccountIndex !== -1) {
//     // Update existing data
//     this.dataService.updateData(id, accountDetail).subscribe(
//       (response: any) => {
//         console.log('Data updated:', response);
//         this.toastr.success('Data updated successfully!');
//         this.accountsData[existingAccountIndex] = accountDetail; // Updates the data in the local array
//         // this.fetchAllData(); // Fetch all data again to refresh the view
//       },
//       (error: any) => {
//         console.error('Error updating data:', error);
//         this.toastr.error('Error updating data!');
//       }
//     );
//   } else {
//     // Save new data
//     this.dataService.saveData(accountDetail).subscribe(
//       (response: any) => {
//         console.log('Data saved:', response);
//         this.toastr.success('Data saved successfully!');
//         this.fetchAllData(); // Fetch all data again to refresh the view
//         this.resetForm();
//       },
//       (error: any) => {
//         console.error('Error saving data:', error);
//         this.toastr.error('Error saving data!');
//       }
//     );
//   }
// }

// updateAccount() {
//   const id = this.form.controls.id.value;

//   const matchingAccountIndex = this.accountsData.findIndex(account =>
//     account.id === id
//   );

//   if (matchingAccountIndex!== -1) {
//     const matchingAccount = this.accountsData[matchingAccountIndex];

//     this.form.patchValue({
//       id: matchingAccount.id,
//       name: matchingAccount.Name,
//       description: matchingAccount.Description,
//       product: matchingAccount.Product,
//     });

//     this.installments = matchingAccount.Details.map(detail => ({
//       installmentNumberControl: new FormControl(detail.installmentNumber),
//       dueDateControl: new FormControl(detail.dueDate),
//       amountControl: new FormControl(detail.amount),
//     }));

//     this.form.controls.name.enable();
//     this.form.controls.description.enable();
//     this.form.controls.product.enable();
//     this.form.controls.id.disable();
//   } else {
//     console.log('Account not found for updating.');
//   }
// }

// fetchAllData() {
//   this.dataService.getAllData().subscribe(
//     (data: any) => {
//       this.accountsData = data;
//       console.log("Fetched data: ", this.accountsData)
//       this.toastr.success("Data for all fetched!!")
//     },
//     (error: any) => {
//       console.error('Error fetching data:', error);
//       this.toastr.error('Error fetching data!');
//     }
//   );
// }
// fetchDataById(id: string) {
//   const matchingAccount = this.accountsData.find(account =>
//     account.id === id
//   );

//   if (matchingAccount) {
//     const accountWithTotal: AccountWithTotal = {
//       ...matchingAccount,
//       totalAmount: matchingAccount.Details.reduce((sum, detail) => sum + detail.amount, 0)
//     };

//     this.fetchedDueDateData = [accountWithTotal];
//     console.log("Account data fetched:", this.fetchedDueDateData);
//     this.toastr.success("Account data fetched successfully!");
//   } else {
//     this.fetchedDueDateData = [];
//     console.log('Account not found.');
//     this.toastr.error("Account not found!");
//   }
// }

// addInstallments() {
//   const newInstallment = {
//     installmentNumberControl: new FormControl(0),
//     dueDateControl: new FormControl(''),
//     amountControl: new FormControl(0)
//   };
    
//   this.installments = [...this.installments, newInstallment];
//   this.showInstallmentsTable = true;
// }

// resetForm() {
  
// }

//   prevYear(): void {
//     this.currentYear -= 1;
//     this.populateDays();
//   }

//   nextYear(): void {
//     this.currentYear += 1;
//     this.populateDays();
//   }

//   populateDays() {
//     this.days = [];
//     for (let day = 1; day <= 31; day++) {
//       const dayInfo = { day: day, dayNames: [] as string[], isDueDate: false }; // Add isDueDate property
//       for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
//         const dayName = this.getDayName(day, monthIndex);
//         dayInfo.dayNames.push(dayName);
//       }
//       dayInfo.isDueDate = this.isDueDate(new Date(this.currentYear, 0, day)); // Check if it's a due date
//       this.days.push(dayInfo);
//     }
//   }
  
//   getDayName(day: number, month: number): string {
//     const firstDayOfMonth = new Date(this.currentYear, month, 1).getDay();
//     const dayIndex = (firstDayOfMonth + day - 1) % 7;
//     return this.dayNames[dayIndex];
//   }

//   private isDueDate(date: Date): boolean {
//     const formattedDate = date.toISOString().substr(0, 10); // Convert date to YYYY-MM-DD format
//     return this.fetchedDueDateData.some(account => 
//       account.Details.some(detail => detail.dueDate === formattedDate)
//     );
//   }

//   isSameDate(date1: Date, date2: Date): boolean {
//       return (
//         date1.getFullYear() === date2.getFullYear() &&
//         date1.getMonth() === date2.getMonth() &&
//         date1.getDate() === date2.getDate()
        
//       );
     
// } 

// //method to add css if its a dueDate
//   isDueDateCell(day: number, monthIndex: number): boolean {
//       const clickedDay = day;
//       const month = monthIndex;
//       const year = this.currentYear;
//       const dueDate = new Date(year, month, clickedDay);
  
//       return this.fetchedDueDateData.some(account =>
//         account.Details.some(installment =>
//         this.isSameDate(new Date(installment.dueDate), dueDate))
//       );
//     }
      

// }


// <div class="navbar">
//   <h1>Yearly Installments</h1>
// </div>

// <div class="container">
// <div class="form-container" [formGroup]="form">
//     <label class="form-label">Account Number:</label>
//     <input type="text" formControlName="accountNumber" class="form-input" />
  
//     <label class="form-label">Name:</label>
//     <input type="text" formControlName="name" class="form-input" />
  
//     <label class="form-label">Product:</label>
//     <input type="text" formControlName="product" class="form-input" />
  
//     <label class="form-label">Description:</label>
//     <input type="text" formControlName="description" class="form-input" />
  
//     <button type="button" (click)="addInstallments()" class="add-more-btn">Add Installments</button>
//     <table *ngIf="showInstallmentsTable" class="table">
//       <thead>
//         <tr>
//           <th>Installment Number</th>
//           <th>Due Date</th>
//           <th>Amount</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr *ngFor="let installment of installments; let i = index">
//           <td><input type="number" [formControl]="installment.installmentNumberControl" class="form-input" /></td>
//           <td><input type="date" [formControl]="installment.dueDateControl" class="form-input" /></td>
//           <td><input type="number" [formControl]="installment.amountControl" class="form-input" /></td>
//         </tr>
//       </tbody>
//       <button type="button" (click)="saveOrUpdateData()" class="add-more-btn">Save</button>
//     </table>      
// </div>


// <div [formGroup]="form" class="divmid">
//   <h3>View your Installments in calendar</h3>
//   <label class="form-label">Account Number:</label>
//   <input type="text" formControlName="accountNumber" class="form-input" />
//   <button type="button" class="view" (click)="fetchAllData()">View</button>

//   <div *ngFor="let data of fetchedDueDateData" class="data-box">
//     <h3>Account Details</h3>
//     <p>Account Number: {{ data.accountNumber }}</p>
//     <p>Name: {{ data.Name }}</p>
//     <p>Product: {{ data.Product }}</p>
//     <p>Description: {{ data.Description }}</p>
  
//     <h3>Installment Details</h3>
//   <table>
//     <thead>
//       <tr>
//         <th>Int.No.</th>
//         <th>Due Date  </th>
//         <th>Amount</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr *ngFor="let detail of data.Details">
//         <td>{{ detail.installmentNumber }}</td>
//         <td>{{ detail.dueDate }}</td>
//         <td>{{ detail.amount }}</td>
//       </tr>
//       <tr>
//       <td colspan="2" style="text-align: right;">Total:</td>
//       <td>{{ data.totalAmount }}</td>
//       </tr>
//     </tbody>
//   </table>
//   <button type="button" class="view" (click)="updateAccount()">Update</button>
//   </div>  
// </div>
 
// <div class="calendar-container">
//   <div class="calendar-controls">
//     <button (click)="prevYear()" class="btn">&#8249; </button>
//     <h3>{{ currentYear }}</h3>
//     <button (click)="nextYear()" class="btn"> &#8250;</button>
//   </div>

//   <div class="table-container">
//     <table class="calendar-table">
//       <tr>
//         <th></th>
//         <ng-container *ngFor="let month of months">
//           <th>{{ month }}</th>
//         </ng-container>
//       </tr>
//       <ng-container *ngFor="let day of days">
//         <tr>
//           <td>{{ day.day }}</td>
//           <ng-container *ngFor="let dayName of day.dayNames; let j = index">
//             <td
//               [ngClass]="{'due-date-cell': isDueDateCell(day.day, j)}">
//               {{ dayName }}
//             </td>
//           </ng-container>
//         </tr>
//       </ng-container>
//     </table>
//   </div>
// </div>


// SERVICE:
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

  // saveData(accountDetail: AccountDetail): Observable<any> {
  //   return this.http.post(`${this.apiUrl}`, accountDetail);
  // }
 
  // getAllData(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}`);
  // }

  // updateData(accountNumber: string, data: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${accountNumber}`, data);
  // }




  // saveData(accountDetail: AccountDetail): Observable<any> {
  //   return this.http.post(`${this.apiUrl}`, { account: accountDetail });
  // }

  // updateData(accountNumber: string, accountDetail: AccountDetail): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${accountNumber}`, { account: accountDetail });
  // }

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



  

 





