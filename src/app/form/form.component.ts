import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';
import { MatDialog } from '@angular/material/dialog';
import { InstallmentPopupComponent } from "../installment-popup/installment-popup.component"
import { ToastrService } from "ngx-toastr"

interface InstallmentDetail {
  installmentNumber: number;
  dueDate: string;
  amount: number;
}

interface Account {
  accountNumber: string;
  Product: string;
  Description: string;
  Details: InstallmentDetail[];
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent {
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentYear: number = new Date().getFullYear(); // Initialize the current year
  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days: any[] = [];

  accountsData: Account[] = [];

  form: FormGroup;
  installments: any[] = [];
  showInstallmentsTable: boolean = false;

  fetchedDueDateData: InstallmentDetail[] = [];
 
  constructor(
    private http:HttpClient, 
    private fb: FormBuilder, 
    private dataService: DataService, 
    private dialog: MatDialog,
    private toastr: ToastrService)
     {
      this.form = this.fb.group({
      accountNumber: [''],
      name: [''],
      product: [''],
      description: [''],
      dueDate: '',
      installmentNumber: '',
      amount: ''
    });
    this.populateDays();
    this.dataService.getData().subscribe(
      (data: any) => {
        this.accountsData = data; // The structure of the response is an array of account objects
        console.log('Accounts Data:', this.accountsData);
        this.toastr.success("fetched Data successfully!")
      },
      (error: any) => {
        console.error('Error loading data:', error);
        this.toastr.error("Error while fetching data!")
      }
    ); 
  }

  prevYear(): void {
    this.currentYear -= 1;
    this.populateDays();
  }

  nextYear(): void {
    this.currentYear += 1;
    this.populateDays();
  }

  populateDays() {
    this.days = [];
    for (let day = 1; day <= 31; day++) {
      const dayInfo = { day: day, dayNames: [] as string[], isDueDate: false }; // Add isDueDate property
      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const dayName = this.getDayName(day, monthIndex);
        dayInfo.dayNames.push(dayName);
      }
      dayInfo.isDueDate = this.isDueDate(new Date(this.currentYear, 0, day)); // Check if it's a due date
      this.days.push(dayInfo);
    }
  }
  
  getDayName(day: number, month: number): string {
    const firstDayOfMonth = new Date(this.currentYear, month, 1).getDay();
    const dayIndex = (firstDayOfMonth + day - 1) % 7;
    return this.dayNames[dayIndex];
  }


  addInstallments() {
    const newInstallment = {
      installmentNumberControl: new FormControl(0),
      dueDateControl: new FormControl(''),
      amountControl: new FormControl(0)
    };
      
    this.installments = [...this.installments, newInstallment];
    this.showInstallmentsTable = true;
  }
   
  saveData() {
    const formData: Account = {
      accountNumber: this.form.controls.accountNumber.value,
      Product: this.form.controls.product.value,
      Description: this.form.controls.description.value,
      Details: this.installments.map(installment => ({
        installmentNumber: installment.installmentNumberControl.value,
        dueDate: installment.dueDateControl.value,
        amount: installment.amountControl.value
      }))
    };

    this.dataService.saveData(formData).subscribe(
      (response: any) => {
        console.log('Data saved:', response);
        this.toastr.success("Data saved successfully!");
      },
      (error: any) => {
        console.error('Error saving data:', error);
        this.toastr.error("Error saving data!");
      }
    );
  }

  fetchDueDateData() {
    const accountNumber = this.form.controls.accountNumber.value; 

    if (!accountNumber) {
      console.log('Please enter an account number.');
      this.toastr.info("please enter an account number!")
      return;
    }

    const matchingAccount = this.accountsData.find(
      account => account.accountNumber === accountNumber
    );

    if (matchingAccount) {
      this.fetchedDueDateData = matchingAccount.Details;
      console.log("these are the fetched due dates: ", this.fetchedDueDateData)
      this.toastr.success("Data fetched on due dates!")
    } else {
      this.fetchedDueDateData = [];
      console.log('Account not found.');
      this.toastr.error("Account not found!")
    }
  }

//returns true if date is a dueDate
  isDueDate(date: Date): boolean {
    const formattedDate = date.toISOString().substr(0, 10); // Convert date to YYYY-MM-DD format
    return this.fetchedDueDateData.some(detail => detail.dueDate === formattedDate);
  }
  
  openInstallmentPopup(day: number, monthIndex: number) {
    const clickedDay = day; 
    const month = monthIndex;
    const year = this.currentYear;
    const dueDate = new Date(year, month, clickedDay);
    
    // Check if there are installment details for the current account
    if (this.fetchedDueDateData.length > 0) {
      const matchingInstallment = this.fetchedDueDateData.find(installment =>
        this.isSameDate(new Date(installment.dueDate), dueDate)
      );

      if (matchingInstallment) {
        const dialogRef = this.dialog.open(InstallmentPopupComponent, {
          data: matchingInstallment  // Passing data object here
        });
    
        dialogRef.afterClosed().subscribe(result => {
        });
      } else {
        console.log("No installment details found for this day.");
      }
    }
  }

  isSameDate(date1: Date, date2: Date): boolean {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    } 

    //method to add css if its a dueDate
    isDueDateCell(day: number, monthIndex: number): boolean {
      const clickedDay = day;
      const month = monthIndex;
      const year = this.currentYear;
      const dueDate = new Date(year, month, clickedDay);
  
      return this.fetchedDueDateData.some(installment =>
        this.isSameDate(new Date(installment.dueDate), dueDate)
      );
    }
  
}