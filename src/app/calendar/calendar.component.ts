import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,  FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service'; // Import the DataService

interface InstallmentDetail {
  installmentNumber: number;
  dueDate: string;
  amount: number;
}

interface Account {
  Product: string;
  Description: string;
  Details: InstallmentDetail[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentYear: number = new Date().getFullYear(); // Initialize the current year
  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days: any[] = [];
  accountsData: { [accountNumber: string]: Account } = {};


  constructor(private http:HttpClient, private fb: FormBuilder, private dataService: DataService) {
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
      const dayInfo = { day: day, dayNames: [] as string[] }; // Correctly define the type
      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const dayName = this.getDayName(day, monthIndex);
        dayInfo.dayNames.push(dayName);
      }
      this.days.push(dayInfo);
    }
  }

  getDayName(day: number, month: number): string {
    const firstDayOfMonth = new Date(this.currentYear, month, 1).getDay();
    const dayIndex = (firstDayOfMonth + day - 1) % 7;
    return this.dayNames[dayIndex];
  }

  form: FormGroup;
  installments: any[] = [];
  showInstallmentsTable: boolean = false;

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
    const formData = {
      accountNumber: this.form.controls.accountNumber.value,
      Product: this.form.controls.product.value,
      Description: this.form.controls.description.value,
      Details: this.installments.map(installment => ({
        installmentNumber: installment.installmentNumberControl.value,
        dueDate: installment.dueDateControl.value,
        amount: installment.amountControl.value
      }))
    };
  
    this.accountsData[this.form.controls.accountNumber.value] = formData;
  
    this.dataService.saveData(this.accountsData).subscribe(
      (response: any) => {
        console.log('Data saved:', response);
      },
      (error: any) => {
        console.error('Error saving data:', error);
      }
    );
  }

}
